// Christina Chen
const db = require("./db");

// Create appointments for a member
const createAppointments = async (userData) => {
  try {
    const { appointmentId, creator, meeting_mode,
      start_date, end_date,
      topic, course, appointmentURL,
      start_time, end_time,
      timeslotIds, timeslot_dates } = userData;

    // Argument validation (course is optional)
    if (!appointmentId || !creator || !meeting_mode
      || !start_date || !end_date || !topic || !appointmentURL
      || !start_time || !end_time || !timeslotIds || !timeslot_dates
    ) {
      throw new Error('Cannot create appointment. At least one required field is missing.');
    }

    // Create the appointment in database
    const result = await new Promise((resolve, reject) => {

      // Track the numbers of timeslot entries created
      let numTimeslot = timeslot_dates.length;
      let numCreatedTimeslot = 0;

      // Insert entry into the Appointment table
      db.run(
        `INSERT INTO Appointment (appointmentId, mode, creator, startDate, endDate, topic, course, appointmentURL)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [appointmentId,
          meeting_mode,
          creator,
          start_date,
          end_date,
          topic,
          course ? course : null,
          appointmentURL
        ], (err) => {
          if (err) {
            console.error("Database error:", err.message); // Log any database errors
            reject("Database error: " + err.message); // Reject with error message
          }
        }
      );

      // Insert entry into the Timeslot table
      const createTimeslotEntries = () => {
        timeslot_dates.forEach((timeslot, ind) => {
          db.run(
            `INSERT INTO Timeslot (timeslotID, appointmentId, startTime, endTime, timeslotDate, appointee, isRequest, requestStatus)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [timeslotIds[ind],
              appointmentId,
              start_time,
              end_time,
              timeslot,
              null,
              false,
              null
            ], (err) => {
              if (err) {
                reject("Database error: " + err.message); // Reject with error message
              } else {
                numCreatedTimeslot++;
                if (numCreatedTimeslot === numTimeslot) {
                  resolve("Successfully created appointment!"); // Resolve when all timeslots are created 
                }
              }
            }

          )
        });
      };
      // Call method to create Timeslot entries
      createTimeslotEntries();
    });
    return result;

  } catch (err) {
    reject('Error while creating appointment.'); // Reject with error message
  }
};

module.exports = { createAppointments };
