import React from "react";

interface IRestaurantProps {
    name:string;
    coverImg: string;
    categoryName?:string;
    id:string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ name, coverImg, categoryName }) => (
    <div className="flex flex-col">
        <div style={{backgroundImage: `url(../images/${coverImg})`}} className="py-28 mb-3 bg-cover"></div>
        <h3 className="text-xl font-medium">{name}</h3>
        <span className="border-t py-2 mt-4 text-xs opacity-50 border-gray-400">{categoryName}</span>
        
    </div>
)