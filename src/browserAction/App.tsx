import "core-js/stable";
import "regenerator-runtime/runtime";
import browser from "webextension-polyfill";
import React, { useCallback, useEffect, useState } from "react";
import {
  load as loadDefinitions,
  getSeason,
  getAll,
  setApiKey,
  includeTables,
  getProgression,
} from "@d2api/manifest-web";
import { changesToValues, hasTimedout } from "../utils";
import { Season, SEASONS } from "../seasons";

import "inter-ui/inter.css";
import "./styles.css";
import Explainer from "./Explainer";
import { DestinySeasonDefinition } from "bungie-api-ts/destiny2";

includeTables(["Season", "Progression"]);

function useExtensionStorage(): [
  Record<string, any>,
  (newValues: Record<string, any>) => Promise<void>
] {
  const [state, setLocalState] = useState<Record<string, any>>({
    hasLoaded: false,
  });

  const validateAndSetLocalState = useCallback(
    (newState: Record<string, any>) => {
      const finalNewState: Record<string, any> = {
        ...newState,
        hasLoaded: true,
      };

      if (
        finalNewState.hasOwnProperty("lastChangedDate") &&
        hasTimedout(finalNewState.lastChangedDate)
      ) {
        finalNewState.lastChangedDate = undefined;
        finalNewState.seasonHash = undefined;
      }

      setLocalState((s) => ({ ...s, ...finalNewState }));
    },
    [state]
  );

  useEffect(() => {
    browser.storage.local
      .get()
      .then((values) =>
        validateAndSetLocalState({ ...values, hasLoaded: true })
      );

    browser.storage.onChanged.addListener((changes, area) => {
      const values = changesToValues(changes);

      validateAndSetLocalState({
        ...values,
        hasLoaded: true,
      });
    });
  }, []);

  const setExtensionStorage = (partialValues: Record<string, any>) => {
    const newValues = { ...state, ...partialValues };

    validateAndSetLocalState(newValues);

    return browser.storage.local.set(partialValues);
  };

  return [state, setExtensionStorage];
}

function isUsableSeason(season: DestinySeasonDefinition) {
  return (
    season.seasonNumber > 7 &&
    new Date(season.endDate ?? Number.MAX_SAFE_INTEGER).getTime() <
      Date.now() &&
    (getProgression(season.seasonPassProgressionHash ?? 0)?.rewardItems
      ?.length ?? 0) > 0
  );
}

async function loadSeasons(bungieApiKey: string) {
  setApiKey(bungieApiKey);
  await loadDefinitions();

  return getAll("Season")
    .filter((s) => isUsableSeason(s))
    .sort((seasonA, seasonB) => {
      return seasonA.seasonNumber - seasonB.seasonNumber;
    });
}

export default function App() {
  const [hasChanged, setHasChanged] = useState(false);
  const [
    { hasLoaded, seasonHash: seasonOverride, bungieApiKey, lastChangedDate },
    setExtensionStorage,
  ] = useExtensionStorage();

  const [seasons, setSeasons] = useState<
    NonNullable<ReturnType<typeof getSeason>>[]
  >([]);

  useEffect(() => {
    if (!bungieApiKey) return;

    loadSeasons(bungieApiKey).then(setSeasons);
  }, [bungieApiKey]);

  const handleSeasonSelected = (ev: any) => {
    const seasonHash = Number(ev.target.value);

    setHasChanged(true);
    setExtensionStorage({
      seasonHash: seasonHash,
      lastChangedDate: Date.now(),
    });
  };

  const handleClearAll = async () => {
    await setExtensionStorage({
      seasonHash: -1,
      bungieApiKey: undefined,
      lastChangedDate: 0,
    });

    await setExtensionStorage({
      seasonHash: undefined,
      bungieApiKey: undefined,
      lastChangedDate: undefined,
    });

    browser.storage.local.clear();
  };

  const selectedSeasonData = SEASONS.find((v) => v.hash === seasonOverride);
  const selectedSeasonDef = seasons.find((v) => v.hash === seasonOverride);

  const seasonName =
    selectedSeasonDef?.displayProperties?.name ?? selectedSeasonData?.name;

  const rootStyles =
    selectedSeasonData &&
    `html {
      background-image: url("https://www.bungie.net${selectedSeasonData.image}");
    }`;

  const statusIsActive =
    seasonOverride && seasonOverride !== -1 && !hasTimedout(lastChangedDate);

  return (
    <div className="root">
      <style dangerouslySetInnerHTML={{ __html: rootStyles ?? "" }}></style>

      <div className="header">
        <h1 className="title">Season Pass Pass</h1>

        {statusIsActive ? (
          <span className="status-active">
            Status: <span className="tag">ACTIVE</span>
          </span>
        ) : (
          <span className="status-inactive">
            Status: <span className="tag">INACTIVE</span>
          </span>
        )}
      </div>

      <div className="main">
        <Explainer
          hasLoaded={hasLoaded}
          statusIsActive={statusIsActive}
          bungieApiKey={bungieApiKey}
          seasonOverride={seasonOverride}
          selectedSeasonDef={selectedSeasonDef}
        />

        <span className="space-v"></span>

        {seasons.length > 0 && (
          <>
            <div className="fakeSelect">
              <div className="fakeSelectButton button">
                Change previous season
              </div>

              <select
                className="fakeSelectMenu"
                value={seasonOverride}
                onChange={handleSeasonSelected}
              >
                <option value={-1}>[Select a season]</option>
                {seasons.map((season) => (
                  <option key={season.hash} value={season.hash}>
                    {season.displayProperties.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="space"></span>

            <button className="link-button" onClick={handleClearAll}>
              Reset
            </button>
          </>
        )}

        <p className="small-explainer">
          Note: Only seasons that have rewards that can still be pulled are
          shown. There is a higher chance each season that previous seasons will
          become unobtainable, so do not leave rewards unobtained that you would
          be upset to lose.
        </p>
      </div>
    </div>
  );
}
