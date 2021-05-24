import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { createRestaurant, createRestaurantVariables } from "../../__generated__/createRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql `
    mutation createRestaurant($input:CreateRestaurantInput!) {
        createRestaurant(input:$input) {
            ok
            error
            restaurantId
        }
    }
`;

interface IFormProps {
    name:string;
    address:string;
    categoryName:string;
    file:FileList;
}

export const AddRestaurant = () => {
    const client = useApolloClient();
    const history = useHistory();
    const [imageUrl, setImageUrl] = useState(false);
    const onCompleted = (data:createRestaurant) => {
        const { createRestaurant: { ok, restaurantId } } = data;
        if(ok) {
            setUploading(false);
            const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
            const { file, name, address, categoryName } = getValues();
            client.writeQuery({
            query: MY_RESTAURANTS_QUERY,
            data: {
                myRestaurants: {
                    ...queryResult.myRestaurants,
                    restaurants: [
                        {address,
                        category:{
                        name: categoryName,
                        __typename: "Category",
                        __proto__: Object},
                        coverImg: imageUrl,
                        id: restaurantId,
                        isPromoted: false,
                        name,
                        __typename: "Restaurant",
                        __proto__: Object}
                    ],

                }
            },
            });
            history.push("/");
        }
    }
    const [createRestauratnMutation, {data}] = useMutation<createRestaurant, createRestaurantVariables>(CREATE_RESTAURANT_MUTATION, {
        onCompleted,
    });
    const {register, getValues, formState, formState: { errors }, handleSubmit } = useForm<IFormProps>({
        mode:"onChange",
    });
    const [ uploading, setUploading ] = useState(false);
    const onSubmit = async() => {
        try {
            setUploading(true);
            const { file, name, address, categoryName } = getValues();
            const actualFile = file[0];
            const formBody = new FormData();
            formBody.append("file", actualFile);
            const { url:coverImg }= await (
                await fetch("http://localhost:4000/uploads/", {
                    method:"POST",
                    body: formBody,
                })
            ).json();
            setImageUrl(coverImg)
            createRestauratnMutation({
                variables: {
                    input: {
                        name,
                        address,
                        categoryName,
                        coverImg,
                    }
                }
            })
        } catch(e) {}
        

    }
    return(
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>Add Restaurant | Nuber Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
                <input className="input" type="text" placeholder="name" {...register("name", {required:"Name is required."})} />
                <input className="input" type="text" placeholder="address" {...register("address", {required:"Address is required."})} />
                <input className="input" type="text" placeholder="categoryName" {...register("categoryName", {required:"CategoryName is required."})} />
                <div>
                    <input type="file" accept="image/" {...register("file", {required:true})} />
                </div>
                <Button
                    loading={uploading}
                    canClick={formState.isValid}
                    actionText="Create Restaurant"
                />
                {data?.createRestaurant.error && (
                    <FormError errorMessage={data.createRestaurant.error} />
                )}
            </form>
        </div>
    )
}