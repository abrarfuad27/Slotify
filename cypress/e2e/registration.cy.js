describe("Registration Page", () => {
    beforeEach(() => {
      cy.visit("/userRegister"); // Adjust the route if necessary
    });
  
    it("validates empty input fields", () => {
      cy.get('button[type="submit"]').click();
      cy.contains("First name is required.").should("exist");
      cy.contains("Last name is required.").should("exist");
      cy.contains("Email is required.").should("exist");
      cy.contains("Password is required.").should("exist");
    });
  
    it("validates invalid email format", () => {
      cy.get('input[type="text"]').eq(2).type("invalidEmail");
      cy.get('button[type="submit"]').click();
      cy.contains("Please enter a valid McGill email address.").should("exist");
    });
  
    it("submits valid registration data", () => {
      cy.get('input[type="text"]').eq(0).type("Abrar");
      cy.get('input[type="text"]').eq(1).type("Fuad");
      cy.get('input[type="text"]').eq(2).type("abrar@mail.mcgill.ca");
      cy.get('input[type="password"]').type("securePassword123");
      cy.get('button[type="submit"]').click();
  
      cy.contains("Your Slotify account has been registered successfully").should("exist");
      cy.get("button").contains("Login").click();
      cy.url().should("include", "/userLogin");
    });
  
    it("handles duplicate email error", () => {
      cy.get('input[type="text"]').eq(0).type("Abrar");
      cy.get('input[type="text"]').eq(1).type("Fuad");
      cy.get('input[type="text"]').eq(2).type("abrar@mail.mcgill.ca"); // Existing email
      cy.get('input[type="password"]').type("securePassword123");
      cy.get('button[type="submit"]').click();
  
      cy.contains("Email already exists").should("exist");
    });
  });
  