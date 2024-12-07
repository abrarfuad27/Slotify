const db = require("./db");

function bookTimeslot(timeslotId, email) {
  return new Promise((resolve, reject) => {
    if (!timeslotId || !email) {
      return reject({ status: 401, message: "Missing timeslotId or email" });
    }

    const updateQuery = `
      UPDATE Timeslot
      SET appointee = ?
      WHERE timeSlotID = ? AND appointee IS NULL
    `;

    db.run(updateQuery, [email, timeslotId], function (err) {
      if (err) {
        console.error("Database error while booking timeslot:", err.message);
        return reject({ status: 500, message: "Internal server error" });
      }
      //if no rows were changed, then the timeslot is no longer available
      if (this.changes === 0) {
        return reject({ status: 400, message: "Timeslot is no longer available." });
      }

      resolve({ status: 200, message: "Timeslot successfully booked!" });
    });
  });
}

module.exports = { bookTimeslot };