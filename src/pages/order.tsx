import React from "react";
import { useParams } from "react-router";

interface IParams {
    id:string;
}

export const Order = () => {
    const params = useParams<IParams>();
    return (
        <h1>Order: #{params.id}</h1>
    )
}