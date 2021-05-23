import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { createAccountMutation, createAccountMutationVariables } from "../../__generated__/createAccountMutation";

const CREATE_RESTAURANT_MUTATION = gql `
    mutation createRestaurant($input:CreateRestaurantInput!) {
        createRestaurant(input:$input) {
            ok
            error
        }
    }
`;

interface IFormProps {
    name:string;
    address:string;
    categoryName:string;
}

export const AddRestaurant = () => {
    const [createAccountMutation, {loading, data}] = useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_RESTAURANT_MUTATION);
    const {register, getValues, formState, formState: { errors }, handleSubmit } = useForm<IFormProps>({
        mode:"onChange",
    })
    const onSubmit = () => {
        console.log(getValues());
    }
    return(
        <div className="container">
            <Helmet>
                <title>Add Restaurant | Nuber Eats</title>
            </Helmet>
            <h1>Add Restaurant</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input className="input" type="text" placeholder="name" {...register("name", {required:"Name is required."})} />
                <input className="input" type="text" placeholder="address" {...register("address", {required:"Address is required."})} />
                <input className="input" type="text" placeholder="categoryName" {...register("categoryName", {required:"CategoryName is required."})} />
                <Button
                    loading={loading}
                    canClick={formState.isValid}
                    actionText="Create Restaurant"
                />
            </form>
        </div>
    )
}