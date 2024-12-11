const db = require("./db");

// Retrieve up to N of the closest upcoming meetings to today's date and time
const getUpcomingAppts = async (userData, res) => {
  const {email, max_num_meetings}= userData;

  return new Promise((resolve, reject) => {
    db.all(`SELECT 
                t.timeslotDate, 
                t.startTime, 
                t.endTime, 
                t.appointee,
                a.creator, 
                a.topic, 
                a.course, 
                a.appointmentURL
            FROM 
                Timeslot t
            JOIN 
                Appointment a ON t.appointmentId = a.appointmentId
            WHERE (t.appointee = ? OR a.creator = ?) 
                AND (t.appointee IS NOT NULL)
                AND (t.isRequest = 0 OR (t.isRequest = 1 AND t.requestStatus = 'approved'))
                AND (t.timeslotDate || ' ' || t.endTime) > datetime('now')
            ORDER BY t.timeslotDate, t.endTime
            LIMIT ?`, 
            [email, email, max_num_meetings], async (err, rows) => {
      if (err) {
        reject("Database error: " + err.message);
      } else {        
        res.json({ data: rows });
      }
    });
  });
};

const getCreatorUpcomingAppts = async (userData, res) => {
  const {email}= userData;

  return new Promise((resolve, reject) => {
    db.all(`SELECT 
                t.timeslotDate, 
                t.startTime, 
                t.endTime, 
                t.appointee,
                a.topic, 
                a.course, 
                a.appointmentURL
            FROM 
                Timeslot t
            JOIN 
                Appointment a ON t.appointmentId = a.appointmentId
            WHERE (a.creator = ?) 
                AND (t.appointee IS NOT NULL)
                AND (t.isRequest = 0 OR (t.isRequest = 1 AND t.requestStatus = 'approved'))
                AND (t.timeslotDate || ' ' || t.endTime) > datetime('now')
            ORDER BY t.timeslotDate, t.endTime`, 
            [email], async (err, rows) => {
      if (err) {
        reject("Database error: " + err.message);
      } else {        
        res.json({ data: rows });
      }
    });
  });
};

module.exports = { getUpcomingAppts, getCreatorUpcomingAppts };
