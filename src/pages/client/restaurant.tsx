import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router";
import { Dish } from "../../components/dish";
import { RESTAURANT_FRAGMENT, DISH_FRAGMENT } from "../../fragment";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";

const RESTAURANT_QUERY = gql`
    query restaurant($input:RestaurantInput!) {
        restaurant(input:$input) {
            error
            ok
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
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
    
    return (
        <div>
            <div className="bg-gray-800 py-28 bg-contain bg-center relative" style={{backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
            }}
            >
                <div className=" w-screen bg-gradient-to-t from-black absolute inset-x-0 bottom-0 h-16">
                        <h4 className="text-white text-5xl mb-3">{data?.restaurant.restaurant?.name}</h4>
                        <div className="flex flex-row">
                            <h5 className="text-white text-md font-light mb-2 mr-3">{data?.restaurant.restaurant?.category?.name}</h5>
                            <h5 className="text-white text-md font-light">{data?.restaurant.restaurant?.address}</h5>
                        </div>
                </div>
            </div>
                <div className="container grid md:grid-cols-3 gap-x-3 gap-y-5 mt-16">
                {data?.restaurant.restaurant?.menu.map((dish, index) => (
                    <Dish
                        key={index}
                        name={dish.name} 
                        description={dish.description}
                        price={dish.price + ""}
                        isCustomer={true}
                        options={dish.options}
                    />
                ))}
                </div>
        </div>
    );
}