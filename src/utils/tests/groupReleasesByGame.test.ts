import { groupReleasesByGame } from "@/helpers/helpers";
import { ReleaseDate } from "@/types";

const releaseDates: ReleaseDate[] = [
  {
    id: 534993,
    category: 0,
    created_at: 1699605336,
    date: 1730419200,
    game: {
      id: 139530,
      cover: {
        id: 117012,
        alpha_channel: false,
        animated: false,
        game: 139530,
        height: 800,
        image_id: "co2iac",
        url: "//images.igdb.com/igdb/image/upload/t_thumb/co2iac.jpg",
        width: 600,
        checksum: "e756d7de-b9fc-8da6-c87e-26bb98668d0b",
      },
      name: "Death Blonde",
    },
    human: "Nov 01, 2024",
    m: 11,
    platform: {
      id: 6,
      abbreviation: "PC",
      name: "PC (Microsoft Windows)",
    },
    region: 8,
    updated_at: 1699605436,
    y: 2024,
    checksum: "f3028efc-e261-0bbd-760e-63f109b4b35e",
  },
  {
    id: 567998,
    category: 1,
    created_at: 1709044984,
    date: 1730419200,
    game: {
      id: 244879,
      cover: {
        id: 364436,
        alpha_channel: true,
        animated: false,
        game: 244879,
        height: 1600,
        image_id: "co7t78",
        url: "//images.igdb.com/igdb/image/upload/t_thumb/co7t78.jpg",
        width: 1200,
        checksum: "90feaf62-94fd-0708-edc2-de616adca58e",
      },
      name: "Ancient Mind",
    },
    human: "Nov 2024",
    m: 11,
    platform: {
      id: 3,
      abbreviation: "Linux",
      name: "Linux",
    },
    region: 8,
    updated_at: 1709086149,
    y: 2024,
    checksum: "3d0e7923-990f-81fc-1cf4-cdf43ae49f2e",
    status: 6,
  },
  {
    id: 567999,
    category: 1,
    created_at: 1709044985,
    date: 1730419200,
    game: {
      id: 244879,
      cover: {
        id: 364436,
        alpha_channel: true,
        animated: false,
        game: 244879,
        height: 1600,
        image_id: "co7t78",
        url: "//images.igdb.com/igdb/image/upload/t_thumb/co7t78.jpg",
        width: 1200,
        checksum: "90feaf62-94fd-0708-edc2-de616adca58e",
      },
      name: "Ancient Mind",
    },
    human: "Nov 2024",
    m: 11,
    platform: {
      id: 6,
      abbreviation: "PC",
      name: "PC (Microsoft Windows)",
    },
    region: 8,
    updated_at: 1709086149,
    y: 2024,
    checksum: "d5055c5e-e913-5bfb-12a3-c9fdd2793fd1",
    status: 6,
  },
];

describe("groupReleasesByGame", () => {
  it("should group releases by game", () => {
    const result = groupReleasesByGame(releaseDates);

    expect(result).toEqual([
      {
        id: 139530,
        cover: {
          id: 117012,
          alpha_channel: false,
          animated: false,
          game: 139530,
          height: 800,
          image_id: "co2iac",
          url: "//images.igdb.com/igdb/image/upload/t_thumb/co2iac.jpg",
          width: 600,
          checksum: "e756d7de-b9fc-8da6-c87e-26bb98668d0b",
        },
        name: "Death Blonde",
        release_dates: [
          {
            id: 534993,
            category: 0,
            created_at: 1699605336,
            date: 1730419200,
            game: {
              id: 139530,
              cover: {
                id: 117012,
                alpha_channel: false,
                animated: false,
                game: 139530,
                height: 800,
                image_id: "co2iac",
                url: "//images.igdb.com/igdb/image/upload/t_thumb/co2iac.jpg",
                width: 600,
                checksum: "e756d7de-b9fc-8da6-c87e-26bb98668d0b",
              },
              name: "Death Blonde",
            },
            human: "Nov 01, 2024",
            m: 11,
            platform: {
              id: 6,
              abbreviation: "PC",
              name: "PC (Microsoft Windows)",
            },
            region: 8,
            updated_at: 1699605436,
            y: 2024,
            checksum: "f3028efc-e261-0bbd-760e-63f109b4b35e",
          },
        ],
      },
      {
        id: 244879,
        cover: {
          id: 364436,
          alpha_channel: true,
          animated: false,
          game: 244879,
          height: 1600,
          image_id: "co7t78",
          url: "//images.igdb.com/igdb/image/upload/t_thumb/co7t78.jpg",
          width: 1200,
          checksum: "90feaf62-94fd-0708-edc2-de616adca58e",
        },
        name: "Ancient Mind",
        release_dates: [
          {
            id: 567998,
            category: 1,
            created_at: 1709044984,
            date: 1730419200,
            game: {
              id: 244879,
              cover: {
                id: 364436,
                alpha_channel: true,
                animated: false,
                game: 244879,
                height: 1600,
                image_id: "co7t78",
                url: "//images.igdb.com/igdb/image/upload/t_thumb/co7t78.jpg",
                width: 1200,
                checksum: "90feaf62-94fd-0708-edc2-de616adca58e",
              },
              name: "Ancient Mind",
            },
            human: "Nov 2024",
            m: 11,
            platform: {
              id: 3,
              abbreviation: "Linux",
              name: "Linux",
            },
            region: 8,
            updated_at: 1709086149,
            y: 2024,
            checksum: "3d0e7923-990f-81fc-1cf4-cdf43ae49f2e",
            status: 6,
          },
          {
            id: 567999,
            category: 1,
            created_at: 1709044985,
            date: 1730419200,
            game: {
              id: 244879,
              cover: {
                id: 364436,
                alpha_channel: true,
                animated: false,
                game: 244879,
                height: 1600,
                image_id: "co7t78",
                url: "//images.igdb.com/igdb/image/upload/t_thumb/co7t78.jpg",
                width: 1200,
                checksum: "90feaf62-94fd-0708-edc2-de616adca58e",
              },
              name: "Ancient Mind",
            },
            human: "Nov 2024",
            m: 11,
            platform: {
              id: 6,
              abbreviation: "PC",
              name: "PC (Microsoft Windows)",
            },
            region: 8,
            updated_at: 1709086149,
            y: 2024,
            checksum: "d5055c5e-e913-5bfb-12a3-c9fdd2793fd1",
            status: 6,
          },
        ],
      },
    ]);
  });

  it("should handle empty releaseDates array", () => {
    const releaseDates: ReleaseDate[] = [];

    const result = groupReleasesByGame(releaseDates);

    expect(result).toEqual([]);
  });

  it("should handle releaseDates with no game", () => {
    const releaseDates: ReleaseDate[] = [
      { game: { id: 1, name: "Game A" }, release_date: "2023-01-01" },
      { game: null, release_date: "2023-02-01" } as any,
    ];

    const result = groupReleasesByGame(releaseDates);

    expect(result).toEqual([
      {
        id: 1,
        name: "Game A",
        release_dates: [
          { game: { id: 1, name: "Game A" }, release_date: "2023-01-01" },
        ],
      },
    ]);
  });
});
