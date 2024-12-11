const db = require('./db');

const endPoll = async (pollId) => {

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE Polling
             SET isActive = FALSE
             WHERE pollId = ?`,
            [pollId], // Use the pollId directly as parameter
            (err) => {
                if (err) {
                    console.error("Database error:", err.message); // Log any database errors
                    reject("Database error: " + err.message); // Reject with error message
                } else {
                    //TODO rewrite this
                    console.log("Successfully updated pollId:",pollId); // Debug log for success
                    resolve({ message: "Request status updated to accepted successfully!" }); // Resolve with success message
                }
            }
        );
    });
};

module.exports = { endPoll };
