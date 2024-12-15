//Salomon Lavy Perez
const db = require("./db");

// Retrieve up to N of the upcoming meetings - with meeting time closest to today's date and time
const getUpcomingAppts = async (userData) => {

  try {
    const {email, max_num_meetings}= userData;

    // argument validation
    if (!email) {
      throw new Error('Email is missing.');
    }
    if (!max_num_meetings || max_num_meetings <= 0) {
      throw new Error('Max number of meetings is missing or is invalid.');
    }

    // query to get up to N=max_num_meetings of meetings
    const result = await new Promise((resolve, reject) => {
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
              [email, email, max_num_meetings], (err, rows) => {
        if (err) {
          reject("Database error: " + err.message);
        } else {        
          resolve({ data: rows });
        }
      });
    });
    return result;
  } catch (err) {
    throw new Error(err);
  }
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
