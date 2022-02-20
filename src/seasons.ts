export interface Season {
  name: string;
  image: string;
  productPageLink: {
    legacy: boolean;
    url: string;
  };
  progressPageImage: string;
  startDate: Date;
  endDate: Date;
  seasonNumber: number;
  actionRouteString: string;
  smallIcon?: string;
  calendarBackgroundImage?: string;
  calendarContentItem?: string;
  hash: number;
}

export const SEASONS: Season[] = [
  {
    name: "Season of the Lost",
    hash: 2809059428,
    startDate: new Date("2021-08-24T17:00:00Z"),
    endDate: new Date("2022-02-22T17:00:00Z"),
    image: "/7/ca/destiny/bgs/season15/s15_key-art-final.jpg",
    productPageLink: {
      legacy: false,
      url: "/en/Seasons/SeasonOfTheLost",
    },
    progressPageImage: "/7/ca/destiny/bgs/season15/seasonbackground_15.jpg",
    calendarBackgroundImage: "",
    seasonNumber: 15,
    actionRouteString: "SeasonOfTheLost",
    smallIcon: "7/ca/destiny/bgs/season15/s15_season_icon.png",
  },
  {
    name: "Season of the Splicer",
    hash: 2809059429,
    startDate: new Date("2021-05-11T17:00:00Z"),
    endDate: new Date("2021-08-24T17:00:00Z"),
    image: "/7/ca/destiny/bgs/season14/Season14_season_hub_bg.jpg",
    productPageLink: {
      legacy: false,
      url: "/en/Seasons/SeasonOfTheSplicer",
    },
    progressPageImage: "/7/ca/destiny/bgs/season14/seasonbackground_14.jpg",
    calendarBackgroundImage:
      "/7/ca/destiny/bgs/season14/calendar_bg_desktop.jpg",
    seasonNumber: 14,
    actionRouteString: "SeasonOfTheSplicer",
    smallIcon: "7/ca/destiny/bgs/season14/s14_season_icon_square.png",
  },
  {
    name: "Season of the Chosen",
    hash: 2809059426,
    startDate: new Date("2021-02-09T17:00:00Z"),
    endDate: new Date("2021-05-11T17:00:00Z"),
    image: "/7/ca/destiny/bgs/season13/Season13_Key_Art.jpg",
    productPageLink: {
      legacy: false,
      url: "/en/Seasons/SeasonOfTheChosen",
    },
    progressPageImage: "/7/ca/destiny/bgs/season13/seasonbackground_13.jpg",
    calendarBackgroundImage:
      "/7/ca/destiny/bgs/season13/calendar_bg_desktop.jpg",
    seasonNumber: 13,
    actionRouteString: "SeasonOfTheChosen",
    smallIcon: "7/ca/destiny/bgs/season13/s13_icon.svg",
  },
  {
    name: "Season of the Hunt",
    hash: 2809059427,
    startDate: new Date("2020-11-10T17:00:00Z"),
    endDate: new Date("2021-02-09T17:00:00Z"),
    image: "/7/ca/destiny/bgs/season12/ArticleBanner_01.jpg",
    productPageLink: {
      legacy: false,
      url: "/en/Seasons/SeasonOfTheHunt",
    },
    progressPageImage: "/7/ca/destiny/bgs/season12/season_progress_bg.jpg",
    calendarBackgroundImage:
      "/7/ca/destiny/bgs/season12/calendar_bg_desktop.png",
    seasonNumber: 12,
    actionRouteString: "SeasonOfTheHunt",
    smallIcon: "7/ca/destiny/bgs/season12/icon_season12_full.png",
  },
  {
    name: "Season of Arrivals",
    hash: 2809059424,
    startDate: new Date("2020-06-09T17:00:00Z"),
    endDate: new Date("2020-11-10T17:00:00Z"),
    image: "/7/ca/destiny/bgs/season11/S11_hero_desktop_bg.jpg",
    productPageLink: {
      legacy: false,
      url: "/en/Seasons/SeasonOfArrivals",
    },
    progressPageImage: "/7/ca/destiny/bgs/season11/season_progress_bg.jpg",
    calendarBackgroundImage: "/7/ca/destiny/bgs/season11/S11_Calendar_bg.png",
    seasonNumber: 11,
    actionRouteString: "SeasonOfArrivals",
    smallIcon: "7/ca/destiny/bgs/season11/icon_season11_full.png",
  },
  {
    name: "Season of the Worthy",
    hash: 2809059425,
    startDate: new Date("2020-03-10T17:00:00Z"),
    endDate: new Date("2020-06-09T17:00:00Z"),
    image: "/7/ca/destiny/bgs/season10/hero_desktop_bg.jpg",
    productPageLink: {
      legacy: false,
      url: "/en/Seasons/SeasonOfTheWorthy",
    },
    progressPageImage: "/7/ca/destiny/bgs/season10/season_progress_bg.jpg",
    calendarContentItem: "48773",
    calendarBackgroundImage: "/7/ca/destiny/bgs/season10/calendar_bg.jpg",
    seasonNumber: 10,
    actionRouteString: "SeasonOfTheWorthy",
    smallIcon: "7/ca/destiny/bgs/season10/gear_rasputin_icon.png",
  },
  {
    name: "Season of Dawn",
    hash: 1743682819,
    startDate: new Date("2019-12-10T17:00:00Z"),
    endDate: new Date("2020-03-10T17:00:00Z"),
    image: "/7/ca/destiny/bgs/season_of_dawn/hero_desktop_bg.jpg",
    productPageLink: {
      legacy: false,
      url: "/en/Seasons/SeasonOfDawn",
    },
    progressPageImage: "/7/ca/destiny/bgs/seasons/season_dawn_progressbg.jpg",
    calendarBackgroundImage:
      "/7/ca/destiny/bgs/season_of_dawn/calendar_desktop_bg.png",
    seasonNumber: 9,
    actionRouteString: "SeasonOfDawn",
    smallIcon: "7/ca/destiny/icons/icon_season_dawn.jpg",
  },
  {
    name: "Season of The Undying",
    hash: 1743682818,
    startDate: new Date("2019-10-01T17:00:00Z"),
    endDate: new Date("2019-12-10T17:00:00Z"),
    image: "/7/ca/destiny/bgs/seasons/hero_desktop_bg1.jpg",
    productPageLink: {
      legacy: false,
      url: "/en/Seasons/SeasonOfTheUndying",
    },
    progressPageImage:
      "/7/ca/destiny/bgs/seasons/season_undying_progressbg.jpg",
    seasonNumber: 8,
    actionRouteString: "SeasonOfTheUndying",
  },
].sort((a, b) => b.seasonNumber - a.seasonNumber);
