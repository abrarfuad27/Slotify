describe("User Authentication", () => {
  const userData = {
    firstName: "Abrar",
    lastName: "Fuad",
    email: "abrar@mail.mcgill.ca",
    password: "securePassword123",
  };

  before(() => {
    cy.visit("/userRegister"); // Navigate to the registration page

    // Register a new user
    cy.get('input[type="text"]').eq(0).type(userData.firstName);
    cy.get('input[type="text"]').eq(1).type(userData.lastName);
    cy.get('input[type="text"]').eq(2).type(userData.email);
    cy.get('input[type="password"]').type(userData.password);
    cy.get('button[type="submit"]').click();

    // Verify successful registration and navigate to login page
    cy.contains("Your Slotify account has been registered successfully").should(
      "exist"
    );
    cy.get("button").contains("Login").click();
    cy.url().should("include", "/userLogin");
  });

  describe("Login Page", () => {
    beforeEach(() => {
      cy.visit("/userLogin"); // Navigate to the login page
    });

    it("validates empty input fields", () => {
      cy.get('button[type="submit"]').click();
      cy.contains("Email is required.").should("exist");
      cy.contains("Password is required.").should("exist");
    });

    it("validates incorrect credentials", () => {
      cy.get('input[type="text"]').type("nonexistent@mail.mcgill.ca");
      cy.get('input[type="password"]').type("wrongPassword123");
      cy.get('button[type="submit"]').click();

      cy.contains("Invalid email or password").should("exist");
    });

    it("displays error on server failure", () => {
      // Mock a server error
      cy.intercept("POST", "/userLogin", {
        statusCode: 500,
        body: { message: "Server error occurred" },
      }).as("loginRequest"); // Alias for easier debugging

      // Fill out the form
      cy.get('input[type="text"]').type(userData.email);
      cy.get('input[type="password"]').type(userData.password);
      cy.get('button[type="submit"]').click();

      // Wait for the mocked request and validate the error
      cy.wait("@loginRequest");
      cy.contains("Server error occurred").should("exist");
    });

    it("logs in with valid credentials", () => {
      cy.get('input[type="text"]').type(userData.email);
      cy.get('input[type="password"]').type(userData.password);
      cy.get('button[type="submit"]').click();
      cy.url().should("include", "/memberDashboard"); // Adjust route if necessary
    });
  });
});
