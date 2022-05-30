import { useEffect, useState } from "react";

import usePrevious from "../helpers/helpers";

const key = "68991fbb0b75dba5ae0ecd8182e967b1";

// On option change --> set page to 1, set movies
// On page change --> add to movies

export function useGetMovies(
  option: "Coming Soon" | "Now Playing" | "Popular" | "Trending",
  page: number,
  searchValue: string,
  isSearchTriggered: boolean
) {
  const prevOption = usePrevious(option);
  const prevPage = usePrevious(page);
  const prevIsSearchTriggered = usePrevious(isSearchTriggered);
  const [state, setState] = useState({ movies: [], loading: true });

  useEffect(() => {
    if (prevOption !== option || prevIsSearchTriggered !== isSearchTriggered) {
      setState({ movies: [], loading: true });
    }

    if (prevOption !== option || prevPage !== page || isSearchTriggered) {
      const abortController = new AbortController();

      const endpoints = {
        "Coming Soon": `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&region=US&include_adult=false&page=${page}`,
        "Now Playing": `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&region=US&include_adult=false&page=${page}`,
        Popular: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&region=US&page=${page}`,
        Trending: `https://api.themoviedb.org/3/trending/movie/day?api_key=${key}&page=${page}`,
        Search: `https://api.themoviedb.org/3/search/multi?api_key=${key}&language=en-US&region=US&include_adult=false&page=${page}&query=${searchValue}`,
      };
      console.log("hook sides", {
        loading: state.loading,
        prevOption: prevOption,
        option: option,
        page: page,
        endpoint: !isSearchTriggered ? endpoints[option] : endpoints.Search,
      });

      async function getMovies() {
        const response = await fetch(
          !isSearchTriggered ? endpoints[option] : endpoints.Search
        );
        const json = await response.json();
        // console.log(json);
        setState({
          movies:
            page === 1 ? json.results : [...state.movies, ...json.results],
          loading: false,
        });
      }
      getMovies();
      return () => {
        // this will cancel the fetch request when the effect is unmounted
        abortController.abort();
      };
    }
  }, [option, page, isSearchTriggered]);

  return state;
}
