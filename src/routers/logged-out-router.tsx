
import { validate } from "graphql";
import React from "react";
import { useForm } from "react-hook-form";

export const LoggedOutRouter = () =>  {
    const { register, watch, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = () => {
        console.log(watch("email"));
    }
    const onInvalid = () => {
        console.log("cannot create account!");
    };
    console.log(errors);
    
    
    return (
        <div>
            <h1>Logged Out</h1>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                <div>
                    <input {...register("email", {
                        required:"this is required", pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
                    })} 
                    type="email" name="email" required placeholder="email" />
                </div>
                <div>
                    <input {...register("password", {required:true})} type="password" name="password" required placeholder="password" />
                </div>
                <button className="bg-yellow-300 text-white">Submit</button>
            </form>
        </div>
    );
}