import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { Button } from "../../components/button";
import { createDish, createDishVariables } from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql `
    mutation createDish($input:CreateDishInput!) {
        createDish(input:$input) {
            ok
            error
        }
    }
`

interface IParams {
    restaurantId: string;
}

interface IForm {
    name:string;
    price:string;
    description:string;
    [key: string]: string;
}

export const AddDish = () => {
    const { restaurantId } = useParams<IParams>();
    const history = useHistory();
    const { register, handleSubmit, formState, getValues, setValue } = useForm<IForm>({
        mode: "onChange",
    })
    const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
    const onAddOptionClick = () => {
        
        console.log(optionsNumber);
        setOptionsNumber((current) => [Date.now(), ...current]);
    };

    const onDeleteClick = (idToDelete: number) => {
        setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
        setValue(`${idToDelete}-optionName`, "");
        setValue(`${idToDelete}-optionExtra`, "");
    };
    const [ createDishMutation, {loading} ] = useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION, {
        refetchQueries: [
            {
              query: MY_RESTAURANT_QUERY,
              variables: {
                input: {
                  id: +restaurantId,
                },
              },
            },
          ],
    });
    const onSubmit = () => {
        const { name, price, description, ...rest } = getValues();
        console.log(rest);
        
        /*createDishMutation({
            variables: {
                input: {
                    name,
                    price:+price,
                    description,
                    restaurantId:+restaurantId,

                },
            },
        });
        history.goBack();*/
    }
    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>Add Dish | Nuber Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
                <input
                    {...register("name", {required:"Name is required."})}
                    className="input"
                    placeholder="Name" 
                    type="text"/>
                <input 
                    {...register("price", {required:"Price is required."})}
                    className="input"
                    placeholder="Price" 
                    min={0}
                    type="number"/>
                <input 
                    {...register("description", {required:"Description is required."})}
                    className="input"
                    placeholder="Description" 
                    type="text"/>
                <div>
                    <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
                    <span onClick={onAddOptionClick} className="bg-gray-900 cursor-pointer text-white py-1 px-2 mt-5">Add Dish Options</span>
                    {optionsNumber.length !== 0 &&
                        optionsNumber.map((id) => (
                            <div key={id} className="mt-5">
                                <input
                                    {...register(`${id}-optionName`)}
                                    className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2" 
                                    type="text"
                                    placeholder="Option Name"
                                />
                                <input
                                    {...register(`${id}-optionExtra`)}
                                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2" 
                                    type="number"
                                    min={0}
                                    placeholder="Option Extra"
                                />
                                <span onClick={()=> onDeleteClick(id)}>Delete Option</span>
                            </div>
                        ))
                    }
                </div>
                <Button 
                    loading={loading}
                    canClick={formState.isValid}
                    actionText="Create Dish"/>
            </form>
        </div>
    )
}