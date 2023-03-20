// Generated by https://quicktype.io

export interface ReleaseDate {
  id: number;
  category: number;
  created_at: number;
  date: number;
  game: Game;
  // human: "Mar 09, 2023";
  human: `${string} ${number}${number}, ${number}${number}${number}${number}`;
  m: number;
  platform: Platform;
  region: number;
  updated_at: number;
  y: number;
  checksum: string;
}

export interface Game {
  id: number;
  cover?: Cover;
  name: string;
  summary?: string;
  videos?: Video[];
  genres?: Genre[];
  involved_companies?: InvolvedCompany[];
}

export interface Cover {
  id: number;
  alpha_channel?: boolean;
  animated?: boolean;
  game: number;
  height: number;
  image_id: string;
  url: string;
  width: number;
  checksum: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
}

export interface InvolvedCompany {
  id: number;
  company: Company;
  developer: boolean;
  porting: boolean;
  publisher: boolean;
  supporting: boolean;
}

export interface Video {
  id: number;
  video_id: string;
  name?: VideoName;
}

export enum VideoName {
  AnnouncementTrailer = "Announcement Trailer",
  GameplayTrailer = "Gameplay Trailer",
  GameplayVideo = "Gameplay Video",
  NameGameplayVideo = "Gameplay video",
  Other = "Other",
  ReleaseDateTrailer = "Release Date Trailer",
  Teaser = "Teaser",
  Trailer = "Trailer",
}

export interface Platform {
  id: number;
  abbreviation: Abbreviation;
  name: PlatformName;
}

export enum Abbreviation {
  PC = "PC",
  Ps4 = "PS4",
  Ps5 = "PS5",
  SeriesX = "Series X",
  Switch = "Switch",
  Xone = "XONE",
}

export enum PlatformName {
  NintendoSwitch = "Nintendo Switch",
  PCMicrosoftWindows = "PC (Microsoft Windows)",
  PlayStation4 = "PlayStation 4",
  PlayStation5 = "PlayStation 5",
  XboxOne = "Xbox One",
  XboxSeriesXS = "Xbox Series X|S",
}