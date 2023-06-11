export interface Season {
  name: string;
  endDate: Date;
  hash: number;
  seasonNumber: number;
  image: string;
  progressPageImage: string;
}

export const SEASONS: Season[] = [
  {
    name: "Season of the Deep",
    endDate: new Date("2023-08-22T17:00:00Z"),
    hash: 2758726569,
    seasonNumber: 21,
    image: "/7/ca/destiny/bgs/season21/S21_Key_Art_-16-9.jpg",
    progressPageImage: "/7/ca/destiny/bgs/season21/seasonbackground_21.jpg",
  },
  {
    name: "Season of Defiance",
    endDate: new Date("2023-05-23T17:00:00Z"),
    hash: 2758726568,
    seasonNumber: 20,
    image: "/7/ca/destiny/bgs/season20/S20_Key_Art_16-9.jpg",
    progressPageImage: "/7/ca/destiny/bgs/season20/seasonbackground_20.jpg",
  },
  {
    name: "Season of Seraph",
    endDate: new Date("2023-02-28T17:00:00Z"),
    hash: 2809059432,
    seasonNumber: 19,
    image:
      "/7/ca/destiny/bgs/season19/season_of_the_seraph_key_art_16x9_web.jpg",
    progressPageImage: "/7/ca/destiny/bgs/season19/seasonbackground_19.jpg",
  },
  {
    name: "Season of Plunder",
    endDate: new Date("2022-12-06T17:00:00Z"),
    hash: 2809059433,
    seasonNumber: 18,
    image: "/7/ca/destiny/bgs/season18/season_of_plunder_key_art_16x9_web.jpg",
    progressPageImage: "/7/ca/destiny/bgs/season18/seasonbackground_18.jpg",
  },
  {
    name: "Season of The Haunted",
    endDate: new Date("2022-08-23T17:00:00Z"),
    hash: 2809059430,
    seasonNumber: 17,
    image: "/7/ca/destiny/bgs/season17/Season_17_Key_Art_4k.jpg",
    progressPageImage: "/7/ca/destiny/bgs/season17/seasonbackground_17.jpg",
  },
  {
    name: "Season of The Risen",
    endDate: new Date("2022-05-24T17:00:00Z"),
    hash: 2809059431,
    seasonNumber: 16,
    image: "/7/ca/destiny/bgs/season16/s16_hero_bg_desktop.jpg",
    progressPageImage: "/7/ca/destiny/bgs/season16/seasonbackground_16.jpg",
  },
].sort((a, b) => b.seasonNumber - a.seasonNumber);
