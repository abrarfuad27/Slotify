//Salomon Lavy Perez
const db = require('./db');

/**
 * Creates a timeslot in the database.
 * @param {Object} timeslotData - The timeslot details.
 * @param {string} timeslotData.timeslotID - Unique ID for the timeslot.
 * @param {string} timeslotData.appointmentId - Associated appointment ID.
 * @param {string} timeslotData.startTime - Start time of the timeslot.
 * @param {string} timeslotData.endTime - End time of the timeslot.
 * @param {string} timeslotData.timeslotDate - Date of the timeslot.
 * @param {string} [timeslotData.appointee] - Email of the appointee (optional).
 * @param {boolean} timeslotData.isRequest - Whether the timeslot is a request.
 * @param {string} [timeslotData.requestStatus] - Status of the request ('approved' or 'pending').
 * @returns {Promise<Object>} Resolves with success message or rejects with error.
 */
const createTimeSlot = async (timeslotData) => {
    const {
        timeslotID,
        appointmentId,
        startTime,
        endTime,
        timeslotDate,
        appointee,
        isRequest,
        requestStatus,
    } = timeslotData;

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO Timeslot (
                timeslotID, appointmentId, startTime, endTime, timeslotDate, appointee, isRequest, requestStatus
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [timeslotID, appointmentId, startTime, endTime, timeslotDate, appointee, isRequest, requestStatus],
            (err) => {
                if (err) {
                    reject("Database error: " + err.message);
                } else {
                    resolve({ message: "Timeslot created successfully!" });
                }
            }
        );
    });
};

module.exports = { createTimeSlot };