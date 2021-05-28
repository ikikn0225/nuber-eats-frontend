import { gql, useApolloClient, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { myRestaurants } from "../../__generated__/myRestaurants";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
    const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
    return (
      <div>
        <Helmet>
          <title>My Restaurants</title>
        </Helmet>
        <div className="max-w-screen-2xl mx-auto mt-32">
          <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
          <Link className="text-green-600 hover:underline" to="/add-restaurant">
            Create Restaurant &rarr;
          </Link>
          {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
            <>
              <h4 className="text-xl mb-5">You have no restaurants.</h4>
            </>
          ) : 
          <div className="grid md:grid-cols-3 gap-x-3 gap-y-5 mt-16">
          {data?.myRestaurants.restaurants?.map((restaurant) => (
              <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  name={restaurant.name} 
                  coverImg={restaurant.coverImg} 
                  categoryName={restaurant.category?.name} 
              />
          ))}
      </div>
          }
        </div>
      </div>
    );
}