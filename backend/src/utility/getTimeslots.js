const db = require("./db"); // Assuming your database connection is in db.js

/**
 * Fetch available timeslots for a given search URL.
 * @param {string} searchUrl - The URL to search for the appointment.
 * @returns {Promise<Array>} - A promise resolving to an array of available timeslots.
 */
const getAvailableTimeslots = (searchUrl) => {
  return new Promise((resolve, reject) => {
    if (!searchUrl) {
      return reject({ status: 400, message: "URL is required" });
    }

    // Get current date and time
    const now = new Date();

    // Extract YYYY-MM-DD in local time
    const curDate =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") + // Month is zero-based
      "-" +
      String(now.getDate()).padStart(2, "0");

    // Extract HH:mm in local time
    const curTime =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    // Step 1: Query the database to find the appointmentId and creator using the URL
    const findAppointmentQuery = `
        SELECT appointmentId, creator, course, topic
        FROM Appointment
        WHERE appointmentURL = ?
      `;

    db.get(findAppointmentQuery, [searchUrl], (err, appointmentRow) => {
      if (err) {
        console.error(
          "Database error while finding appointmentId:",
          err.message
        );
        return reject({ status: 500, message: "Internal server error" });
      }

      if (!appointmentRow) {
        return reject({ status: 404, message: "Appointment not found" });
      }

      const { appointmentId, creator, course, topic } = appointmentRow;

      // Step 2: Fetch the creator's first and last names
      const findMemberQuery = `
          SELECT firstName, lastName
          FROM Member
          WHERE email = ?
        `;

      db.get(findMemberQuery, [creator], (err, memberRow) => {
        if (err) {
          console.error("Database error while finding member:", err.message);
          return reject({ status: 500, message: "Internal server error" });
        }

        if (!memberRow) {
          return reject({ status: 404, message: "Creator not found" });
        }

        const { firstName, lastName } = memberRow;

        // Step 3: Fetch available timeslots for the appointment
        const queryTimeslots = `
            SELECT timeslotID, timeslotDate, startTime, endTime
            FROM Timeslot
            WHERE appointmentId = ? AND appointee IS NULL AND isRequest = 0 AND (
                  timeslotDate > ? OR
                  (timeslotDate = ? AND startTime >= ?)
              )
          `;

        db.all(
          queryTimeslots,
          [appointmentId, curDate, curDate, curTime],
          (err, rows) => {
            if (err) {
              console.error(
                "Database error while fetching timeslots:",
                err.message
              );
              return reject({ status: 500, message: "Internal server error" });
            }

            // Always return the creator details
            const response = {
              firstName,
              lastName,
              creator, // Email of the professor
              course,
              topic,
              timeslots: rows || [], // Return an empty array if no timeslots are available
            };

            if (rows.length === 0) {
              return resolve({
                ...response,
                message: "This appointment no longer has available timeslots",
              });
            }

            // If timeslots exist
            resolve(response);
          }
        );
      });
    });
  });
};

module.exports = { getAvailableTimeslots };
