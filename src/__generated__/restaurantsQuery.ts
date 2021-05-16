/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantsQuery
// ====================================================

export interface restaurantsQuery_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface restaurantsQuery_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: restaurantsQuery_allCategories_categories[] | null;
}

export interface restaurantsQuery_restaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface restaurantsQuery_restaurants_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantsQuery_restaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface restaurantsQuery_restaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  results: restaurantsQuery_restaurants_results[] | null;
}

export interface restaurantsQuery {
  allCategories: restaurantsQuery_allCategories;
  restaurants: restaurantsQuery_restaurants;
}

export interface restaurantsQueryVariables {
  input: RestaurantsInput;
}
