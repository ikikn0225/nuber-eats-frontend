import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { ORDERS_FRAGMENT, DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { myRestaurant, myRestaurantVariables } from "../../__generated__/myRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { Dish } from "../../components/dish";
import { 
VictoryBoxPlot,
VictoryArea,
VictoryAxis,
VictoryBar,
VictoryCandlestick,
VictoryChart,
VictoryErrorBar,
VictoryGroup,
VictoryLine,
VictoryPie,
VictoryPolarAxis,
VictoryScatter,
VictoryStack,
VictoryVoronoi,
VictoryHistogram,
VictoryTheme,
VictoryVoronoiContainer,
VictoryTooltip,
VictoryLabel
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
                orders {
                  ...OrderParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
    ${ORDERS_FRAGMENT}
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
                    {data?.myRestaurant.restaurant?.menu.map((dish, index) => (
                        <Dish
                            key={index}
                            id={dish.id}
                            name={dish.name} 
                            description={dish.description}
                            price={dish.price + ""}
                        />
                    ))}
                    </div>}
                </div>
                <div className="mt-10">
                <VictoryChart
              height={500}
              theme={VictoryTheme.material}
              width={window.innerWidth}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 18 } as any}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 20,
                  } as any,
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
                </div>
              </div>
            </div>
          );
}