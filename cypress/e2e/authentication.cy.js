describe("Authentication and Access Control Tests", () => {
  const validEmail = "abrar@mail.mcgill.ca";
  const validPassword = "securePassword123";

  const publicPages = ["/userLogin", "/userRegister", "/"];
  const protectedPages = [
    "/memberDashboard",
    "/createPoll",
    "/managePoll",
    "/meetingHistory",
    "/upcomingAppointments",
  ];

  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/");
  });

  it("Validates login with valid credentials", () => {
    cy.visit("/userLogin");
    cy.get('input[type="text"]').eq(0).type(validEmail);
    cy.get('input[type="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    // Assert redirection to the dashboard
    cy.url().should("include", "/memberDashboard");
  });

  it("Denies login with invalid credentials", () => {
    cy.visit("/userLogin");
    cy.get('input[type="text"]').eq(0).type("wrongEmail");
    cy.get('input[type="password"]').type("wrongPassword");
    cy.get('button[type="submit"]').click();

    // Assert error message
    cy.contains("Invalid email or password").should("exist");
    cy.url().should("include", "/userLogin");
  });

  it("Redirects unauthenticated users to login for protected pages", () => {
    protectedPages.forEach((page) => {
      cy.visit(page);
      cy.url().should("include", "/userLogin");
    });
  });

  it("Allows authenticated users to access protected pages", () => {
    cy.visit("/userLogin");
    cy.get('input[type="text"]').eq(0).type(validEmail);
    cy.get('input[type="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    protectedPages.forEach((page) => {
      cy.visit(page);
      cy.url().should("include", page);
    });
  });

  it("Redirects logged-in users away from public pages", () => {
    // Log in
    cy.visit("/userLogin");
    cy.get('input[type="text"]').eq(0).type(validEmail);
    cy.get('input[type="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/memberDashboard");

    // Try to visit public pages
    publicPages.forEach((page) => {
      cy.visit(page);
      cy.url().should("include", "/memberDashboard"); // Logged-in users redirected
    });
  });

  it("Handles token expiry and logout", () => {
    // Log in
    cy.visit("/userLogin");
    cy.get('input[type="text"]').eq(0).type(validEmail);
    cy.get('input[type="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    // Wait for the dashboard to load
    cy.url().should("include", "/memberDashboard");

    // Simulate token expiry
    cy.clearCookie("authToken");

    // Reload the page to trigger token validation
    cy.reload();

    // Assert redirection to login
    cy.url().should("include", "/userLogin");
  });

  it("Logs out and prevents further access to protected pages", () => {
    // Log in
    cy.visit("/userLogin");
    cy.get('input[type="text"]').eq(0).type(validEmail);
    cy.get('input[type="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    // Ensure the hamburger menu is visible and expanded
    cy.get(".hamburger-content") // Replace with your hamburger menu selector
      .should("be.visible")
      .click();

    // Log out
    cy.get(".hamburger-content .logout-button").should("be.visible").click();

    // Confirm redirection to login page
    cy.url().should("include", "/userLogin");

    // Try accessing protected pages
    protectedPages.forEach((page) => {
      cy.visit(page);
      cy.url().should("include", "/userLogin");
    });
  });
});
