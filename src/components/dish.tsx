import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";

interface IDishProps {
    id?:number;
    name:string;
    description:string;
    price:string;
    isCustomer?:boolean;
    isSelected?:boolean;
    options?:restaurant_restaurant_restaurant_menu_options[] | null;
    orderStarted?:boolean;
    addItemToOrder?: (dishId:number, extra:number) => void;
    removeFromOrder?:(dishId:number) => void;
}

export const Dish:React.FC<IDishProps> = ({
    id = 0,
    name, 
    description, 
    price, 
    isCustomer = false, 
    isSelected,
    options,
    orderStarted = false,
    addItemToOrder,
    removeFromOrder,
    children: dishOptions,
    }) => {
    
    const onClick = () => {
        if(orderStarted) {
            if(!isSelected && addItemToOrder) {
                return addItemToOrder(id, +price);
            }
            if(isSelected && removeFromOrder) {
                return removeFromOrder(id);
            }
        }
    }
    return (
        <div className={`px-8 py-4 border cursor-pointer transition-all ${isSelected ? "border-gray-800" : "hover:border-gray-800"} `}>
            <div className="mb-5">
                <h3 className="text-lg font-medium">
                    {name}{" "}
                    {orderStarted && (
                        <button 
                            className={`${isSelected ? "bg-red-600" : "bg-green-600"} text-white font-bold ml-3 py-1 px-3 focus:outline-none text-sm`} 
                            onClick={onClick} 
                        >
                            { isSelected ? "Removed" : "Add" }
                        </button>
                    )}
                </h3>
                <h4 className="font-medium">{description}</h4>
            </div>
            <span>${price}</span>
            {isCustomer && options && options?.length !== 0 && (
                <div className="bg-gray-100 pl-3">
                    <h5 className="mt-8 mb-5 font-medium">Dish Options:</h5>
                    <div className="grid gap-2 pl-5">{dishOptions}</div>
                </div>
                )
            }

        </div>
    )
}