import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";

interface IDishOptionProps {
    dishId:number;
    option:restaurant_restaurant_restaurant_menu_options;
    isSelected?:boolean;
    isOptionSelected?:boolean;
    addOptionToItem: (dishId:number, optionName:string) => void;
    removeOptionFromItem: (dishId:number, optionName:string) => void;
}

export const DishOption:React.FC<IDishOptionProps> = ({
    dishId,
    option,
    isSelected,
    isOptionSelected,
    addOptionToItem,
    removeOptionFromItem,
}) => {
    const onClick = () => {
        if(isOptionSelected) {
            removeOptionFromItem(dishId, option.name);
        } else {
            addOptionToItem(dishId, option.name);
        }
    }
    return (
        <span 
            onClick={onClick}
            className="flex items-center" 
        >
            <span className="mr-2">{option.name}</span>
            <span className="text-sm opacity-75">(${ option.extra ? option.extra : 0 })</span>
            {isSelected &&
                <button 
                    className={`font-bold ml-3 py-1 px-3 focus:outline-none text-sm text-white  ${isOptionSelected? "bg-red-600" : "bg-green-600"}`}
                >
                    {isOptionSelected? "Remove" : "Add" }
                </button>
            }
        </span>
    )
}