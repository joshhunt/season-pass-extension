import { DestinySeasonDefinition } from "bungie-api-ts/destiny2";
import React from "react";

interface ExplainerProps {
  hasLoaded: boolean;
  statusIsActive: boolean;
  bungieApiKey: string | undefined;
  seasonOverride: number | undefined;
  selectedSeasonDef: DestinySeasonDefinition | undefined;
}

const Explainer: React.FC<ExplainerProps> = ({
  hasLoaded,
  statusIsActive,
  bungieApiKey,
  seasonOverride,
  selectedSeasonDef,
}) => {
  if (!hasLoaded) {
    return <p className="explainer">Starting up...</p>;
  }

  if (hasLoaded && !bungieApiKey) {
    return (
      <p className="explainer">
        Visit Bungie.net to initialise Season Pass Pass.
      </p>
    );
  }

  if (statusIsActive) {
    return (
      <p className="explainer">
        This extension is overriding the Previous Season on bungie.net to{" "}
        <span className="tag">
          {selectedSeasonDef?.displayProperties.name ?? (
            <code>{seasonOverride}</code>
          )}
        </span>
        <br />
        <br />
        Log into Bungie.net and visit{" "}
        <a
          className="link"
          target="_blank"
          href="https://www.bungie.net/7/en/Seasons/PreviousSeason"
        >
          Previous Season
        </a>{" "}
        to claim previous rewards.
      </p>
    );
  }

  return (
    <p className="explainer">
      Select a season to override the Previous Season on bungie.net and claim
      previous rewards
    </p>
  );
};

export default Explainer;
