import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useLocation, useParams } from "react-router";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql `
    query category($input:CategoryInput!) {
        category(input:$input) {
            error
            ok
            totalPages
            totalResults
            restaurants {
                ...RestaurantParts
            }
            category {
                ...CategoryParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
    slug:string;
}

export const Category = () => {
    const param = useParams<ICategoryParams>();
    const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page:1,
                slug: param.slug,
            }
        }
    });
    console.log(data);
    
    return <h1>Cat</h1>
};