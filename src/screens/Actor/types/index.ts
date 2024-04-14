import { PeopleImages, PersonDetails, PersonMovieCredit } from "tmdb-ts";

export interface MyPerson extends PersonDetails {
  movie_credits: PersonMovieCredit;
  images: PeopleImages;
}
