import React from "react";
import { Link } from "react-router-dom";

interface IMyOrdersProps {
    id:string;
}

export const MyOrders: React.FC<IMyOrdersProps> = ({id}) => {
    return (
        <Link to={`/order/${id}`}>
            <div className="flex flex-col">
                <span className="border px-10 py-10 mx-4 text-lg opacity-80 border-black">Order: #{id}</span>
            </div>
        </Link>
    )
}