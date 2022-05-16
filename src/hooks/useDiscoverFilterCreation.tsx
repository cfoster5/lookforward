import { useEffect, useState } from "react";

export function useDiscoverFilterCreation(
  genre,
  company,
  keyword,
  provider,
  selectedMovieWatchProvider,
  sortMethod
) {
  const [filter, setFilter] = useState({
    genreId: undefined,
    companyId: undefined,
    keywordId: undefined,
    watchProvider: selectedMovieWatchProvider,
    sortMethod: sortMethod,
  });

  useEffect(() => {
    if (genre) {
      setFilter({ ...filter, genreId: genre.id });
    } else if (company) {
      setFilter({ ...filter, companyId: company.id });
    } else if (keyword) {
      setFilter({ ...filter, keywordId: keyword.id });
    } else if (provider) {
      if (provider.provider_id !== selectedMovieWatchProvider) {
        setFilter({ ...filter, watchProvider: selectedMovieWatchProvider });
      } else {
        setFilter({ ...filter, watchProvider: provider.provider_id });
      }
    }
  }, [
    genre,
    company,
    keyword,
    provider,
    selectedMovieWatchProvider,
    sortMethod,
  ]);

  return filter;
}
