
describe("Edit Profile", () => {
    beforeEach(() => {
        // @ts-ignore
        cy.login("wsx2792@gmail.com", "Djaakdi1213!!");
    });

    it("can go to /edit-profile using the header", () => {
        cy.get('a[href="/edit-profile"]').click();
        cy.title().should("eq", "Edit Profile | Nuber Eats");
    });

    it("can change email", () => {
        cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if(req.body?.operationName === "editProfile") {
                // @ts-ignore
                req.body?.variables?.input?.email = "wsx2792@gmail.com"
            }
        })
        cy.visit("/edit-profile");
        cy.findByPlaceholderText(/email/i).clear().type("wsx2793@gmail.com");
        cy.findByRole("button").click();
    })
})