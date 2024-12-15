//Salomon Lavy Perez

const db = require('./db');

const getRequests = async (userData, res) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT 
                    t.timeslotDate, 
                    t.startTime, 
                    t.endTime, 
                    t.appointee,
                    t.timeSlotId,
                    a.topic, 
                    a.course, 
                    m.firstName,
                    m.lastName
                FROM 
                    Timeslot t
                JOIN 
                    Appointment a ON t.appointmentId = a.appointmentId
                JOIN
                    Member m ON t.appointee = m.email
                WHERE a.creator = ?
                    AND (t.isRequest = 1 AND t.requestStatus = 'pending')
                    AND (t.timeslotDate || ' ' || t.endTime) > datetime('now')
                ORDER BY t.timeslotDate, t.endTime`, 
                [userData.email], async (err, rows) => {
          if (err) {
            reject("Database error: " + err.message);
          } else {       
            console.log(userData.email)
            resolve(rows);
          }
        });
      });
    };
    
    module.exports = { getRequests };    