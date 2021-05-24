import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { myRestaurant, myRestaurantVariables } from "../../__generated__/myRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";


const MY_RESTAURANT_QUREY = gql `
    query myRestaurant($input:MyRestaurantInput!) {
        myRestaurant(input:$input) {
            ok
            error
            restaurant {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`

interface IParams {
    id: string;
}

export const MyRestaurant = () => {
    const {id} = useParams<IParams>();
    const {data} = useQuery<myRestaurant, myRestaurantVariables>(
        MY_RESTAURANTS_QUERY,
        {
            variables: {
                input: {
                    id:+id,
                }
            }
        }
        )
    console.log(data);
    
    return <h1>My Restaurant</h1>
}