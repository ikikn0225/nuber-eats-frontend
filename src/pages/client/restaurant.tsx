import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { Dish } from "../../components/dish";
import { RESTAURANT_FRAGMENT, DISH_FRAGMENT } from "../../fragment";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import { DishOption } from "../../components/dish-option";
import { createOrder, createOrderVariables } from "../../__generated__/createOrder";

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
    const triggerCancelOrder = () => {
        setOrderStarted(false);
        setOrderItems([]);
    }
    const history = useHistory();
    const onCompleted = (data: createOrder) => {
        const { createOrder:{ ok, orderId } } = data;
        if(data.createOrder.ok) {
            history.push(`/order/${orderId}`);
        }
    };
    const [createOrderMutation, {loading: placingOrder }] = useMutation<createOrder, createOrderVariables>(CREATE_ORDER_MUTATION, {
        onCompleted,
    });
    const triggerConfirmOrder = () => {
        if (placingOrder) {
            return;
        }
        if(orderItems.length == 0) {
            alert("It's empty order!");
            return;
        }
        // const ok = window.confirm("You are about to place an order");
        // if(ok) {
            createOrderMutation({
                variables: {
                    input:{
                        restaurantId:+params.id,
                        items:orderItems,
                    },
                },
            });
        // };
    };
    const getItem = (dishId:number) => {
        return orderItems.find((item) => item.dishId === dishId)
    }
    const isSelected = (dishId:number) => {
        return Boolean(getItem(dishId));
    }
    const addItemToOrder = (dishId: number) => {
        if(isSelected(dishId)) {
            return;
        }
        setOrderItems((current) => [{dishId, options: []}, ...current]);
    };
    const removeFromOrder = (dishId:number) => {
        setOrderItems((current) => current.filter((dish) => dish.dishId !== dishId));
    };
    const addOptionToItem = (dishId:number, optionName:string) => {
        if(!isSelected(dishId)) {
            return;
        }
        const oldItem = getItem(dishId);
        // console.log(option);
        
        if(oldItem) {
            const hasOption = Boolean(
                oldItem.options?.find((aOption) => aOption.name === optionName)
            );
            if(!hasOption){
                removeFromOrder(dishId);
                setOrderItems((current) => [
                    {dishId, options:[{name: optionName}, ...oldItem.options!]},
                    ...current,
                ]);
            }
        }
    };
    const removeOptionFromItem = (dishId:number, optionName:string) => {
        if(!isSelected(dishId)) {
            return;
        }
        
        const oldItem = getItem(dishId);
        if(oldItem) {
            removeFromOrder(dishId);
            setOrderItems((current) => [
                {
                    dishId,
                    options: oldItem.options?.filter(
                        (option) => option.name !== optionName
                    ),
                },
                ...current,
            ]);
            return;
        }
    }
    const isOptionSelected = (dishId: number, optionName:string) => {
        const item = getItem(dishId);
        if(item) {
            return Boolean(getOptionFromItem(item, optionName));
        }
    };
    const getOptionFromItem = (item: CreateOrderItemInput, optionName:string) => {
        return item.options?.find((option) => option.name === optionName)
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
                    {!orderStarted &&
                        <button onClick={triggerStartOrder} className="btn pl-10 pr-10">
                            Start Order
                        </button>
                    }
                    {orderStarted &&(
                        <div className="grid">
                            <button onClick={triggerConfirmOrder} className="btn px-10 mr-2">
                                {placingOrder ? "Loading..." : "Confirm Order"}
                            </button>
                            <button onClick={triggerCancelOrder} className="btn bg-red-600 px-10 mr-2">
                                Cancel Order
                            </button>
                        </div>
                    )
                    }
                    <div className="w-full grid mt-16 md:grid-cols-3 px-10 gap-x-5 gap-y-10">
                        {data?.restaurant.restaurant?.menu.map((dish, index) => (
                            <Dish
                                key={index}
                                id={dish.id}
                                name={dish.name} 
                                description={dish.description}
                                price={dish.price + ""}
                                isCustomer={true}
                                isSelected={isSelected(dish.id)}
                                options={dish.options}
                                orderStarted={orderStarted}
                                addItemToOrder={addItemToOrder}
                                removeFromOrder={removeFromOrder}
                            >
                            {/* React 엘리먼트도 객체라서 prop으로 전달이 가능하다. 
                            여기에서 prop으로 정의하고 
                            Dish에서 prop으로 받을 수 있다.(children) */}
                            {dish.options?.map((option, index) => (
                                <DishOption 
                                    key={index}
                                    dishId={dish.id}
                                    option={option}
                                    isSelected={isSelected(dish.id)}
                                    isOptionSelected={isOptionSelected(dish.id, option.name)}
                                    addOptionToItem={addOptionToItem}
                                    removeOptionFromItem={removeOptionFromItem}
                                />
                            ))}
                            </Dish>
                        ))}
                    </div>
                </div>
        </div>
    );
}