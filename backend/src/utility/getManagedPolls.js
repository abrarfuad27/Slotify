// Christina Chen
const db = require("./db");

// Fetch active and inactive polls a member created
const getManagedPolls = async (userData) => {
  try {
    const { email } = userData;
    // Argument validation
    if (!email) {
      throw new Error('Email is missing.');
    }

    // Get poll based on query argument
    const result = await new Promise((resolve, reject) => {
      db.all(`SELECT
                      pollId,
                      pollName,
                      isActive
                  FROM 
                      Polling
                  WHERE 
                      creator = ?`,
        [email], async (err, rows) => {
          if (err) {
            reject("Database error: " + err.message); // Reject with error message
          } else {
            resolve({ data: rows }); // Resolve with result
          }
        });
    });
    return result;
  } catch (err) {
    throw new Error('Could not create poll :' + err);
  }
};
module.exports = { getManagedPolls };