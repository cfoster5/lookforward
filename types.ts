export interface cover {
  id: number;
  alpha_channel: boolean;
  animated: boolean;
  game: number;
  height: number;
  image_id: string;
  url: string;
  width: number;
  checksum: string;
}

export interface genre {
  id: number,
  name: string
}

// export interface platform {
//   id: number;
//   abbreviation: string;
//   alternative_name: string;
//   category: number;
//   created_at: number;
//   generation: number;
//   name: string;
//   platform_logo: number;
//   product_family: number;
//   slug: string;
//   summary: string;
//   updated_at: number;
//   url: string;
//   versions: number[];
//   websites: number[];
//   checksum: string;
// }

// export interface release {
//   id: number;
//   category: number;
//   created_at: number;
//   date: number;
//   game: number;
//   human: string;
//   m: number;
//   platform: platform;
//   region: number;
//   updated_at: number;
//   y: number;
//   checksum: string;
// }

// export interface game {
//   id: number;
//   cover: cover;
//   genres: genre[];
//   name: string;
//   release_dates: release[];
//   summary: string;
// }




export interface game {
  id: number;
  cover: cover;
  genres: genre[];
  name: string;
  summary: string;
}

export interface platform {
  id: number;
  abbreviation: string;
  alternative_name: string;
  category: number;
  created_at: number;
  name: string;
  platform_logo: number;
  slug: string;
  updated_at: number;
  url: string;
  versions: number[];
  websites: number[];
  checksum: string;
  generation?: number;
  product_family?: number;
  summary: string;
}

export interface release {
  id: number;
  category: number;
  created_at: number;
  date: number;
  game: game;
  human: string;
  m: number;
  platform: platform;
  region: number;
  updated_at: number;
  y: number;
  checksum: string;
}

