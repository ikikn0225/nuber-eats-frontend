import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useParams } from "react-router";
import { Dish } from "../../components/dish";
import { RESTAURANT_FRAGMENT, DISH_FRAGMENT } from "../../fragment";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";

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

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($input: CreateOrderInput!) {
        createOrder(input:$input) {
            error
            ok
            orderId
        }
    }
`

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
    const [orderStarted, setOrderStarted] = useState(false);
    const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([])
    const triggerStartOrder = () => {
        setOrderStarted(true);
    };
    const addItemToOrder = (dishId: number) => {
        setOrderItems((current) => [{dishId}]);
    };
    console.log(orderItems);
    return (
        <div>
            <div className="bg-gray-800 py-28 bg-contain bg-center relative" style={{backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
            }}
            >
                <div className=" w-screen bg-gradient-to-t from-black absolute inset-x-0 bottom-0 h-28">
                        <h4 className="text-white text-5xl mb-3">{data?.restaurant.restaurant?.name}</h4>
                        <div className="flex flex-row">
                            <h5 className="text-white text-md font-light mb-2 mr-3">{data?.restaurant.restaurant?.category?.name}</h5>
                            <h5 className="text-white text-md font-light">{data?.restaurant.restaurant?.address}</h5>
                        </div>
                </div>
            </div>
                <div className="container flex flex-col items-end pb-32 mt-5">
                    <button onClick={triggerStartOrder} className="btn px-10">
                        Start Order
                    </button>
                    <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.restaurant.restaurant?.menu.map((dish, index) => (
                            <Dish
                                key={index}
                                id={dish.id}
                                name={dish.name} 
                                description={dish.description}
                                price={dish.price + ""}
                                isCustomer={true}
                                options={dish.options}
                                orderStarted={orderStarted}
                                addItemToOrder={addItemToOrder}
                            />
                        ))}
                    </div>
                </div>
        </div>
    );
}