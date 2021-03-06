import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { restaurantsQuery, restaurantsQueryVariables } from "../../__generated__/restaurantsQuery";

const RESTAURANTS_QUERY = gql `
    query restaurantsQuery($input:RestaurantsInput!) {
        allCategories {
            ok
            error
            categories {
                ...CategoryParts
            }
        }
        restaurants(input:$input) {
            ok
            error
            totalPages
            totalResults
            results {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
    searchTerm:string;
}

export const Restaurants = () => {
    const [page, setPage] = useState(1);  
    const { data, loading, error } = useQuery<restaurantsQuery, restaurantsQueryVariables>(RESTAURANTS_QUERY, {
        variables: {
            input: {
                page,
            },
        },
    });
    const onNextPageClick = () => setPage((current) => current + 1);
    const onPrevPageClick = () => setPage((current) => current - 1);
    const { register, handleSubmit, getValues } = useForm<IFormProps>();
    const history = useHistory();
    const onSearchSubmit = () => {
        const { searchTerm } = getValues();
        history.push({
            pathname:"/search",
            search: `?term=${searchTerm}`,
        });
    };
    return (
        <div>
            <Helmet>
                <title>Home | Nuber Eats</title>
            </Helmet>
            <form onSubmit={handleSubmit(onSearchSubmit)} className="bg-gray-800 w-full py-40 flex items-center justify-center">
                <input 
                {...register("searchTerm", {
                    required: true,                    
                })}
                type="Search"
                className="input rounded-md border-0 w-3/4 md:w-3/12" 
                placeholder="Search restaurants..."/>
            </form>
            {!loading && (
                <div className=" max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="flex justify-around max-w-screen-sm mx-auto">
                        {data?.allCategories.categories?.map(category => (
                            <Link key={category.id} to={`/category/${category.slug}`}>
                            <div className="flex flex-col group items-center cursor-pointer">
                                <div 
                                    className="w-16 h-16 bg-cover transform group-hover:bg-gray-200 rounded-full"
                                    style={{ backgroundImage: `url(${category.coverImg})`}}
                                ></div>
                                <span className="mt-1 text-sm text-center font-medium">{category.name}</span>
                            </div>
                            </Link>
                        ))}
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-3 gap-y-5 mt-16">
                        {data?.restaurants.results?.map((restaurant) => (
                            <Restaurant 
                                key={restaurant.id}
                                id={restaurant.id + ""}
                                name={restaurant.name} 
                                coverImg={restaurant.coverImg} 
                                categoryName={restaurant.category?.name} 
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
                        {page > 1 ? (
                            <button onClick={onPrevPageClick} className="focus:outline-none font-medium text-2xl">&larr;</button>
                        ) : (
                            <div></div>
                        )}
                        <span className="mx-5">
                            Page {page} of {data?.restaurants.totalPages}
                        </span>
                        {page !== data?.restaurants.totalPages ? (
                            <button onClick={onNextPageClick} className="focus:outline-none font-medium text-2xl">&rarr;</button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};