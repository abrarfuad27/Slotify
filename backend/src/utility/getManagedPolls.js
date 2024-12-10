const db = require("./db");

// Allows us to fetch active and inactive polls a member created
const getManagedPolls = async (userData, res) => {
    const {email}= userData;
    return new Promise((resolve, reject) => {
        db.all(`SELECT
                    pollId,
                    pollName,
                    isActive
                FROM 
                    Polling
                WHERE 
                    creator = ?`,
                [email],async (err, rows) => {
                    if (err) {
                      reject("Database error: " + err.message);
                    } else {        
                      res.json({ data: rows });
                    //   resolve
                    }
        });
    });
  };
module.exports = { getManagedPolls };