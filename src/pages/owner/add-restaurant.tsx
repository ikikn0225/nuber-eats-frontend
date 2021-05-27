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
    const [createRestaurantMutation, {data}] = useMutation<createRestaurant, createRestaurantVariables>(CREATE_RESTAURANT_MUTATION, {
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
//  async 하나에 await 여러개 선언하는건 상관이 없다. 
//  Promise 객체, async/await의 개념을 완벽히 이해하면 오해할 일이 없다.
//  작동방식
//  먼저 fetch가 동작해서 데이터를 보낸다.
//  비동기적 함수(AJAX, setTimeout)면 WebAPI를 통해 대기 후 해당 함수를 CallBack Queue로 이동한다. fetch도 서버와 비동기적 통신하는 함수이므로 Web API로 들어간다.
//  밖에 await json()을 실행하게 된다.
//  json()은 response 스트림을 가져와 스트림이 완료될때까지 읽고 텍스트를 JSON으로 바꾸는 결과로 해결되는 promise 객체를 반환한다.
//  await를 선언해줌으로서 json 값을 가져올 수 있게 된다.
                await fetch("http://localhost:4000/uploads/", {
                    method:"POST",
                    body: formBody,
                })
            ).json();
            setImageUrl(coverImg)
            createRestaurantMutation({
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