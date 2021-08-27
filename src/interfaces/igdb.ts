export namespace IGDB {

  export namespace Game {
    export interface Cover {
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

    export interface Genre {
      id: number;
      name: string;
    }

    export interface Platform {
      id: number;
      name: string;
      abbreviation: string;
    }

    export interface ReleaseDate {
      id: number;
      category: number;
      created_at: number;
      date: number;
      game: number;
      human: string;
      m: number;
      platform: Platform;
      region: number;
      updated_at: number;
      y: number;
      checksum: string;
    }

    export interface Video {
      id: number;
      name: string;
      video_id: string;
    }

    export interface Company {
      id: number,
      name: string
    }

    export interface InvolvedCompany {
      id: number,
      company: Company,
      developer: true,
      porting: false,
      publisher: false,
      supporting: false
    }

    export interface Game {
      id: number;
      cover: Cover;
      genres: Genre[];
      name: string;
      release_dates: ReleaseDate[];
      summary: string;
      videos: Video[];
      involved_companies: InvolvedCompany[];
    }
  }

  export namespace ReleaseDate {
    export interface Game {
      id: number;
      cover: IGDB.Game.Cover;
      genres: IGDB.Game.Genre[];
      name: string;
      summary: string;
      videos: IGDB.Game.Video[];
      involved_companies: IGDB.Game.InvolvedCompany[];
    }

    export interface ReleaseDate {
      id: number;
      category: number;
      created_at: number;
      date: number;
      game: Game;
      human: string;
      m: number;
      platform: IGDB.Game.Platform;
      region: number;
      updated_at: number;
      y: number;
      checksum: string;
    }
  }
}
