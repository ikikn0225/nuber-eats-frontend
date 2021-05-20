import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { CreateAccount } from "../../pages/create-account";
import { render, waitFor } from "../../test-utils";

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
});