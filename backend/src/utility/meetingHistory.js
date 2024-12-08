const db = require("./db");

// Retrieve up to three of the closest upcoming meetings to today's date and time
const getMeetingHistory = async (userData, res) => {

  return new Promise((resolve, reject) => {
    db.all(`SELECT 
                t.timeslotDate, 
                t.startTime, 
                t.endTime, 
                a.creator, 
                a.topic, 
                a.course, 
                a.appointmentURL
            FROM 
                Timeslot t
            JOIN 
                Appointment a ON t.appointmentId = a.appointmentId
            WHERE t.appointee = ?
                AND (t.isRequest = 0 OR (t.isRequest = 1 AND t.requestStatus = 'approved'))
                AND (t.timeslotDate || ' ' || t.endTime) < datetime('now')
            ORDER BY t.timeslotDate, t.endTime`, 
            [userData.email], async (err, rows) => {
      if (err) {
        reject("Database error: " + err.message);
      } else {  
        resolve(rows);
      }
    });
  });
};

module.exports = { getMeetingHistory };
