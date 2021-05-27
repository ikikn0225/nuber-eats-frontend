import { render, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Login, LOGIN_MUTATION } from "../../pages/login";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";


describe("<Login />", () => {
    let renderResult: RenderResult;
    let mockedClient: MockApolloClient;
    beforeEach(async() => {
        await waitFor(() => {
            mockedClient = createMockClient();
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
    });
    it("renders OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Login | Nuber Eats");
        })
    }); 
    it("displays email validation error", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;               // render 결과값 불러온다.
        const email = getByPlaceholderText(/email/i);                           // placeholder로 email DOM Element를 찾는다.
        await waitFor(() => {                                                   // email에 "this@wont"를 삽입한다.
            userEvent.type(email, "this@wont");                                 
        });
        let errorMessage = getByRole("alert");                                  // DOM Element에 role="alert"되어있는 객체를 가져온다.
        expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);  // 해당 객체의 컨텐츠를 테스트한다.
        await waitFor(() => {                                                   // email DOM Element의 값을 clear한다.
            userEvent.clear(email);
        });
        errorMessage = getByRole("alert");                                      
        expect(errorMessage).toHaveTextContent(/Email is required/i);           // email DOM Element에 값이 없을때 컨텐츠를 테스트한다.
    });
    it("displays password validation errors", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const submitBtn = getByRole("button");
        await waitFor(() => {                                                   
            userEvent.type(email, "this@wont.com");                             // email DOM Element에 "this@wont.com"을 삽입한다. 
            userEvent.click(submitBtn);                                         // submit 버튼을 클릭한다.
        });
        const errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/password is required/i);
    });
    it("submits form and call mutation", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const submitBtn = getByRole("button");
        const formData = {                                                      // formData(email, password) 객체를 담은 변수를 선언한다.
            email: "real@test.com",
            password: "123",
        };
        const mockedMutationResponse = jest.fn().mockResolvedValue({            // 해당 변수에 data 아래의 객체를 mocking 해주는 과정
            data: {
                login: {
                    ok:true,
                    token:"XXX",
                    error: "mutation-error",
                },
            },
        });
        mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse); // Apollo Client가 LOGIN_MUTATION을 실행할때 불려진 함수를 set한다.
        jest.spyOn(Storage.prototype, "setItem");                               // setItem를 뺏어온다.
        await waitFor(() => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(submitBtn);
        });
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);                // mockedMutationResponse이 1번 불렸는지 확인
        expect(mockedMutationResponse).toHaveBeenCalledWith({                   // loginInput(email, password)에 바른 값이 들어갔는지 확인
            loginInput: {
                email: formData.email,
                password: formData.password,
            },
        });
        const errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/mutation-error/i);
        expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "XXX");    // key:nuber-token, value:XXX 확인
    });
});