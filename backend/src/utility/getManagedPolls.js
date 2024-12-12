const db = require("./db");

// Fetch active and inactive polls a member created
const getManagedPolls = async (userData) => {
    try {
      const {email}= userData;
      if (!email) {
        throw new Error('Email is missing.');
      }
      const result = await new Promise((resolve, reject) => {
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
                        resolve({ data: rows });
                      }
          });
      });
      return result;
    } catch (err) {
      throw new Error('Could not create poll :' + err);
    }
  };
module.exports = { getManagedPolls };