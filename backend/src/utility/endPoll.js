// Christina Chen
const db = require('./db');

const endPoll = async (pollId) => {
    try {
        if (!pollId) {
            throw new Error('Poll ID is required.');
        }
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE Polling
                 SET isActive = FALSE
                 WHERE pollId = ?`,
                [pollId],
                (err) => {
                    if (err) {
                        console.error("Database error:", err.message); // Log any database errors
                        reject("Database error: " + err.message); // Reject with error message
                    } else {
                        console.log("Successfully updated poll :",pollId); // Debug log for success
                        resolve({ message: "Poll status updated successfully!" }); // Resolve with success message
                    }
                }
            );
        });
    }catch (err){
        throw new Error('Could not end poll :' + err);
    }
    
};

module.exports = { endPoll };
