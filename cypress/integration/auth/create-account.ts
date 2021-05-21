describe("Create Account", () => {
    it("should see email / password validation errors", () => {
        cy.visit("/");
        cy.findByText(/Create Account/i).click();
        cy.findByPlaceholderText(/email/i).type("wsxwsx@email");
        cy.findByRole("alert").should("have.text", "Please enter a valid email");
        cy.findByPlaceholderText(/email/i).clear();
        cy.findByRole("alert").should("have.text", "Email is required");
        cy.findByPlaceholderText(/email/i).type("wsxwsx@email.com");
        cy.findByPlaceholderText(/password/i).type("A").clear();
        cy.findByRole("alert").should("have.text", "Password is required");
    })
    it("should be able to create account and login", () => {
        cy.intercept("http://localhost:4000/graphql", (req) => {
            const { operationName } = req.body;
            if(operationName && operationName === "createAccountMutation") {
                req.reply((res) => {
                    res.send({
                        data: {
                            createAccount: {
                                ok: true,
                                error: null,
                                __typename: "CreateAccountOutput",
                            },
                        },
                    });
                });
            }
        });
        cy.visit("/create-account");
        cy.findByPlaceholderText(/email/i).type("wsx2792@gmail.com");
        cy.findByPlaceholderText(/password/i).type("Djaakdi1213!!");
        cy.findByRole("button").click();
        cy.wait(1000);
        cy.title().should("eq", "Login | Nuber Eats");
        cy.findByPlaceholderText(/email/i).type("wsx2792@gmail.com");
        cy.findByPlaceholderText(/password/i).type("Djaakdi1213!!");
        cy.findByRole("button").click();
        cy.window().its("localStorage.nuber-token").should("be.a", "string");
    })
})