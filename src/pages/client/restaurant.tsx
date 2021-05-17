import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";

const RESTAURANT_QUERY = gql`
    query restaurant($input:RestaurantInput!) {
        restaurant(input:$input) {
            error
            ok
            restaurant {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`;

interface IRestaurantParams {
    id:string;
}

export const Restaurant = () => {
    const params = useParams<IRestaurantParams>();
    const { loading, data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
        variables: {
            input: {
                restaurantId:+params.id
            },
        },
    });
    console.log(data);
    
    return <h1>Restaurant</h1>;
}