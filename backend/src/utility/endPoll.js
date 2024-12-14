// Christina Chen
const db = require('./db');

// End a given poll
const endPoll = async (pollId) => {
    try {
        // Argument validation
        if (!pollId) {
            throw new Error('Poll ID is required.');
        }
        // End the poll
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE Polling
                 SET isActive = FALSE
                 WHERE pollId = ?`,
                [pollId],
                (err) => {
                    if (err) {
                        reject("Database error: " + err.message); // Reject with error message
                    } else {
                        resolve({ message: "Poll status updated successfully!" }); // Resolve with success message
                    }
                }
            );
        });
    } catch (err) {
        throw new Error('Could not end poll :' + err);
    }

};

module.exports = { endPoll };
