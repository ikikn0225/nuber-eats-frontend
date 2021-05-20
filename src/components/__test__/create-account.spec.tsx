import { ApolloProvider } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../../pages/create-account";
import { render, waitFor, RenderResult } from "../../test-utils";
import { UserRole } from "../../__generated__/globalTypes";

describe("<CreateAccount/>", () => {
    let mockedClient: MockApolloClient;
    let renderResult: RenderResult;
    beforeEach(async () => {
        await waitFor(() => {
            mockedClient = createMockClient();
            renderResult = render(
                <ApolloProvider client={mockedClient}>
                    <CreateAccount/>
                </ApolloProvider>
            );
        });
    })
    it("renders OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Create Account | Nuber Eats");
        })
    });
    it("renders validation errors", async() => {
        const {getByRole, getByPlaceholderText} = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const button = getByRole("button");
        await waitFor(()=>{
            userEvent.type(email, "wont@work");
        });
        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
        await waitFor(()=> {
            userEvent.clear(email);
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Email is required/i);
        await waitFor(() => {
            userEvent.type(email, "woring@email.com");
            userEvent.click(button);
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Password is required/i);
    });
    it("submits mutation with form values", async () => {
        const {getByRole, getByPlaceholderText} = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const button = getByRole("button");
        const formData = {
            email:"woring@email.com",
            password:"123",
            role:UserRole.Client,
        };
        const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
            data: {
                createAccount: {
                    ok: true,
                    error:"mutation-error",
                },
            },
        });
        mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedLoginMutationResponse);
        jest.spyOn(window, "alert").mockImplementation(() => null);
        await waitFor(() => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(button);
        });
        expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
            createAccountInput: {
                email: formData.email,
                password: formData.password,
                role: formData.role,
            },
        });
        expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
        const mutationError = getByRole("alert");
        expect(mutationError).toHaveTextContent("mutation-error");
    })
});