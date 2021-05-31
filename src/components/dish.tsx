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
    addItemToOrder?: (dishId:number) => void;
    removeFromOrder?:(dishId:number) => void;
    addOptionToItem?:(dishId:number, option: any) => void;
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
    addOptionToItem,
    }) => {
    
    const onClick = () => {
        if(orderStarted) {
            if(!isSelected && addItemToOrder) {
                return addItemToOrder(id);
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
                        <button className="bg-green-600 text-white font-bold" onClick={onClick} >{ isSelected ? "Removed" : "Add" }</button>
                    )}
                </h3>
                <h4 className="font-medium">{description}</h4>
            </div>
            <span>${price}</span>
            {isCustomer && options && options?.length !== 0 && (
                <div>
                    <h5 className="mt-8 mb-5 font-medium">Dish Options:</h5>
                    <div>{options?.map((option, index) => (
                        <span 
                            onClick={() => (
                                addOptionToItem
                                ? addOptionToItem(id, {
                                    name: option.name,
                                }) 
                                : null
                            )}
                            className="flex border items-center" key={index}
                        >
                            <h6 className="mr-2">{option.name}</h6>
                            <h6 className="text-sm opacity-75">({option.extra})</h6>
                        </span>
                    ))}</div>
                </div>
                )
            }

        </div>
    )
}