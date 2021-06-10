import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MyOrders } from "../../components/my-orders";
import { Restaurant } from "../../components/restaurant";
import { FULL_ORDER_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { useMe } from "../../hooks/useMe";
import { getMyOrders } from "../../__generated__/getMyOrders";
// import { getOrders, getOrdersVariables } from "../../__generated__/getOrders";
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

const GET_ORDERS = gql `
  query getOrders($input: GetOrdersInput!) {
    getOrders(input:$input) {
      ok
      error
      orders {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const GET_MY_ORDERS = gql `
  query getMyOrders {
    getMyOrders {
      ok
      error
      orders {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;


export const MyRestaurants = () => {
    const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
    const {data: userData} = useMe();
    const { data: orderData } = useQuery<getMyOrders>(GET_MY_ORDERS,)
    return (
      <div>
        <Helmet>
          <title>My Restaurants</title>
        </Helmet>
        <div className="max-w-screen-2xl mx-auto mt-32">
          <h2 className="text-4xl font-medium mb-5">My Restaurant's Orders</h2>
            {orderData?.getMyOrders.ok && orderData.getMyOrders.orders?.length === 0 ? (
              <>
                <h4 className="text-xl mb-5">You have no orders.</h4>
              </>
            ) : 
              <div className="grid md:grid-cols-5 gap-x-3 gap-y-5 mt-10 mb-10">
                {orderData?.getMyOrders.orders?.map((order) => (
                  <MyOrders
                    key={order.id}
                    id={order.id + ""}
                  />
                ))}
              </div>
            }
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