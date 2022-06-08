import { Movie, Person, TV } from ".";

export interface Search<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface MyInterface extends Search<Movie | TV | Person> {}
