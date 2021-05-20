import { render, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Login } from "../../pages/login";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";


describe("<Login />", () => {
    let renderResult: RenderResult;
    beforeEach(async() => {
        await waitFor(() => {
            const mockedClient = createMockClient();
            renderResult = render(
                <HelmetProvider>
                    <Router>
                        <ApolloProvider client={mockedClient}>
                            <Login />
                        </ApolloProvider>
                    </Router>
                </HelmetProvider>
            );
        });
    })
    it("renders OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Login | Nuber Eats");
        })
    });
    it("displays email validation error", async () => {
        const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        await waitFor(() => {
            userEvent.type(email, "this@wont");
        });
        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
        await waitFor(() => {
            userEvent.clear(email);
        });
        debug();
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Email is required/i);
    });
});