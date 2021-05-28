import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { myRestaurant, myRestaurantVariables } from "../../__generated__/myRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { Dish } from "../../components/dish";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryPie,
} from "victory";


export const MY_RESTAURANT_QUERY = gql `
    query myRestaurant($input:MyRestaurantInput!) {
        myRestaurant(input:$input) {
            ok
            error
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
`

interface IParams {
    id: string;
}

export const MyRestaurant = () => {
    const {id} = useParams<IParams>();
    const {data} = useQuery<myRestaurant, myRestaurantVariables>(
        MY_RESTAURANT_QUERY,
        {
            variables: {
                input: {
                    id:+id,
                }
            }
        }
        )

        const chartData = [
          { x: 1, y: 3000 },
          { x: 2, y: 1500 },
          { x: 3, y: 4250 },
          { x: 4, y: 1250 },
          { x: 5, y: 2300 },
          { x: 6, y: 7150 },
          { x: 7, y: 6830 },
          { x: 8, y: 6830 },
          { x: 9, y: 6830 },
          { x: 10, y: 6830 },
          { x: 11, y: 6830 },
        ];
        return (
            <div>
              <div
                className="  bg-gray-700  py-28 bg-center bg-cover"
                style={{
                  backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
                }}
              ></div>
              <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                  {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link to={`/restaurant/${id}/add-dish`} className=" mr-8 text-white bg-gray-800 py-3 px-10">
                  Add Dish &rarr;
                </Link>
                <Link to={``} className=" text-white bg-green-700 py-3 px-10">
                  Buy Promotion &rarr;
                </Link>
                <div className="mt-10">
                  {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
                    <h4 className="text-xl mb-5">Please upload a dish!</h4>
                  ) : 
                  <div className="grid md:grid-cols-3 gap-x-3 gap-y-5 mt-16">
                    {data?.myRestaurant.restaurant?.menu.map((dish) => (
                        <Dish
                            key={dish.id}
                            name={dish.name} 
                            description={dish.description}
                            price={dish.price + ""}
                        />
                    ))}
                    </div>}
                </div>
                <div className="mt-20 mb-10">
                      <h4 className="text-center text-2xl font-medium">Sales</h4>
                      <div className="max-w-lg w-full mx-auto">
                      <VictoryPie
                        data={chartData}
                        colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
                        cornerRadius={({ datum }) => datum.y * 5}
                      />
                      </div>
                    </div>
              </div>
            </div>
          );
}