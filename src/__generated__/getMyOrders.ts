/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: getMyOrders
// ====================================================

export interface getMyOrders_getMyOrders_orders_driver {
  __typename: "User";
  email: string;
}

export interface getMyOrders_getMyOrders_orders_customer {
  __typename: "User";
  email: string;
}

export interface getMyOrders_getMyOrders_orders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface getMyOrders_getMyOrders_orders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: getMyOrders_getMyOrders_orders_driver | null;
  customer: getMyOrders_getMyOrders_orders_customer | null;
  restaurant: getMyOrders_getMyOrders_orders_restaurant | null;
}

export interface getMyOrders_getMyOrders {
  __typename: "GetMyOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: getMyOrders_getMyOrders_orders[] | null;
}

export interface getMyOrders {
  getMyOrders: getMyOrders_getMyOrders;
}
