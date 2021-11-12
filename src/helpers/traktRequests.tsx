export async function getImdbLookupById(id: string): Promise<any> {
  const response = await fetch(
    `https://api.trakt.tv/search/imdb/${id}?type=movie&extended=full`,
    {
      headers: {
        "trakt-api-key":
          "8c5d0879072bf8414e5d6963e9a4c3bfc69b24db9ac28f1c664ff0431d2e31bb",
      },
    }
  );
  return response.json();
}

export async function getMovieById(id: string): Promise<any> {
  const response = await fetch(
    `https://api.trakt.tv/movies/${id}?extended=full`,
    {
      headers: {
        "trakt-api-key":
          "8c5d0879072bf8414e5d6963e9a4c3bfc69b24db9ac28f1c664ff0431d2e31bb",
      },
    }
  );
  return response.json();
}

export async function getRelated(id: string): Promise<any> {
  const response = await fetch(`https://api.trakt.tv/movies/${id}/related`, {
    headers: {
      "trakt-api-key":
        "8c5d0879072bf8414e5d6963e9a4c3bfc69b24db9ac28f1c664ff0431d2e31bb",
    },
  });
  return response.json();
}

// export async function getTraktLookupById(id: string): Promise<any> {
//   const response = await fetch(`https://api.trakt.tv/search/trakt/${id}?type=movie`, {
//     headers: {
//       "trakt-api-key": "8c5d0879072bf8414e5d6963e9a4c3bfc69b24db9ac28f1c664ff0431d2e31bb",
//     }
//   });
//   return response.json();
// }
