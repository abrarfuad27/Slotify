describe("Appointment Creation Tests", () => {
  const validEmail = "abrar@mail.mcgill.ca";
  const validPassword = "securePassword123";
  const appointmentFormData = {
    meeting_mode: "one-time", // Default value for meeting_mode
    start_date: "2025-01-15",
    end_date: "2025-01-15",
    topic: "Project Discussion",
    course: "COMP551",
    start_time: "10:00",
    end_time: "11:00",
    timeslot_dates: ["2025-01-15"],
  };

  beforeEach(() => {
    cy.visit("/userLogin");

    // Log in
    cy.get('input[type="text"]').first().type(validEmail);
    cy.get('input[type="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    // Confirm login by checking redirection
    cy.url().should("not.include", "/userLogin");
  });

  it("Should successfully create an appointment", () => {
    // Navigate to appointment creation page
    cy.visit("/appointmentCreation");

    // Select meeting mode radio button (One-Time)
    cy.get('input[name="meeting_mode"][value="one-time"]').check({
      force: true,
    });

    // Fill out the appointment creation form
    cy.get('input[name="start_date"]').type(appointmentFormData.start_date);
    cy.get('input[name="topic"]').type(appointmentFormData.topic);
    if (appointmentFormData.course) {
      cy.get('input[name="course"]').type(appointmentFormData.course);
    }
    cy.get('input[name="start_time"]').type(appointmentFormData.start_time);
    cy.get('input[name="end_time"]').type(appointmentFormData.end_time);
    //   cy.get('input[name="timeslot_dates"]').each(($el, index) => {
    //     cy.wrap($el).type(appointmentFormData.timeslot_dates[index]);
    //   });

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check success modal
    cy.get(".modal").should("be.visible");
    cy.get(".modal h2").should("contain", "Success");
    cy.get(".modal .appt-url")
      .invoke("text")
      .should("contain", "slotify.com/appt/");
  });

  it("Should not submit the form with missing required fields", () => {
    // Navigate to appointment creation page
    cy.visit("/appointmentCreation");

    // Select meeting mode radio button (One-Time)
    cy.get('input[name="meeting_mode"][value="one-time"]').check({
      force: true,
    });

    // Fill only some fields (leaving out required ones)
    cy.get('input[name="start_date"]').type(appointmentFormData.start_date);

    // Try submitting the form
    cy.get('button[type="submit"]').click();

    // Check that the form has not been submitted, i.e., page is not redirected or form does not submit
    cy.url().should("include", "/appointmentCreation"); // Assuming it stays on the same page when the form is not valid

    // Alternatively, check that the submit button is not disabled (if you are using such behavior for disabled state)
    cy.get('button[type="submit"]').should("not.be.disabled");
  });

  it("Should show an error when the start date is after the end date", () => {
    cy.visit("/appointmentCreation");

    // Select meeting mode and fill in the dates
    cy.get('input[name="meeting_mode"][value="recurring"]').check({
      force: true,
    });
    cy.get('input[name="start_date"]').type("2025-01-20");
    cy.get('input[name="end_date"]').type("2025-01-10"); // Invalid date range
    cy.get('input[name="topic"]').type(appointmentFormData.topic);
    cy.get('input[name="start_time"]').type(appointmentFormData.start_time);
    cy.get('input[name="end_time"]').type(appointmentFormData.end_time);

    // Try submitting the form
    cy.get('button[type="submit"]').click();

    // Check for error message
    cy.get(".error-msg").should("be.visible");
    cy.get(".error-msg").should("contain", "Start date must be earlier than end date.");
  });
});
