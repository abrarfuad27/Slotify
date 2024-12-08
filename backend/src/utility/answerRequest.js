const db = require('./db');

const acceptRequest = async (timeSlotId) => {
    console.log("Received timeSlotId:", timeSlotId); // Debug log to confirm input

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE Timeslot
             SET requestStatus = 'approved'
             WHERE timeslotID = ?`,
            [timeSlotId], // Use the timeSlotId directly as parameter
            (err) => {
                if (err) {
                    console.error("Database error:", err.message); // Log any database errors
                    reject("Database error: " + err.message); // Reject with error message
                } else {
                    console.log("Successfully updated timeSlotId:", timeSlotId); // Debug log for success
                    resolve({ message: "Request status updated to accepted successfully!" }); // Resolve with success message
                }
            }
        );
    });
};

const deleteRequest = async (timeSlotId) => {
    console.log(timeSlotId);
    return new Promise((resolve, reject) => {
        db.run(
            `DELETE FROM TimeSlot
             WHERE timeslotID = ?`,
            [timeSlotId],
            (err) => {
                if (err) {
                    reject("Database error: " + err.message);
                } else {
                    resolve({ message: "Request status denied successfully!" });
                }
            }
        );
    });
};

module.exports = { acceptRequest, deleteRequest };
