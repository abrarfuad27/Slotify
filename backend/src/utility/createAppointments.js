const db = require("./db");

// Create appointments
const createAppointments = async (userData, res) => {
  const {appointment_data, timeslot_data}= userData;
  const {appointmentId, creator, meeting_mode,start_date,end_date,topic,course,appointmentURL, start_time, end_time} = appointment_data;
  const {timeslotIds, timeslot_dates}=timeslot_data;
  return new Promise((resolve, reject) => {
    
    try {
      
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
        ],
        (err) => {
          if (err) {
            reject("Failed to create entry in Appointment table: " + err.message);
          } else {
            resolve("Entry successfully inserted into Appointment table");
          }
        }
      );

      // Insert entry into the Timeslot table
      const insertTimeslotEntries = () => {
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
               ]
            )
          });
      };
      
      insertTimeslotEntries();
      
      } catch (err) {
        reject("Failed to create appointment: " + err.message);
      }
  }

)
};

module.exports = { createAppointments };
