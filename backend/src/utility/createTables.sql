-- Members Table --

CREATE TABLE IF NOT EXISTS Member (
    email TEXT PRIMARY KEY,
    encryptedPassword TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL
);

-- Appointments Table --

CREATE TABLE IF NOT EXISTS Appointment ( 
    appointmentId TEXT PRIMARY KEY, 
    mode TEXT CHECK (mode IN ('recurring', 'one-time')), 
    creator TEXT NOT NULL, 
    startDate DATE NOT NULL, 
    endDate DATE NOT NULL CHECK (endDate > startDate), 
    topic TEXT NOT NULL, 
    appointmentURL TEXT NOT NULL UNIQUE 
);

-- Timeslot Table --

CREATE TABLE IF NOT EXISTS Timeslot ( 
    timeslotID TEXT PRIMARY KEY, 
    appointmentId TEXT NOT NULL UNIQUE, 
    startTime TIME NOT NULL, 
    endTime TIME NOT NULL CHECK (startTime < endTime), 
    timeslotDate DATE NOT NULL, 
    appointee TEXT, 
    isRequest BOOLEAN NOT NULL, 
    requestStatus TEXT CHECK (requestStatus IN ('approved', 'pending')),
    
    FOREIGN KEY (appointmentId) REFERENCES Appointment(appointmentId) 
);

-- Booking Table --

CREATE TABLE IF NOT EXISTS Booking (
    timeslotID TEXT NOT NULL,
    appointeeEmail TEXT NOT NULL,
    upcoming BOOLEAN NOT NULL,
    
    FOREIGN KEY (timeslotID) REFERENCES Timeslot(timeslotID)
);

-- Polling Table --

CREATE TABLE IF NOT EXISTS Polling (
    pollId TEXT PRIMARY KEY,
    pollName TEXT NOT NULL,
    pollQuestion TEXT NOT NULL,
    creator TEXT NOT NULL,
    isActive BOOLEAN NOT NULL,
    pollUrl TEXT NOT NULL UNIQUE
);

-- Polling Slot Table --

CREATE TABLE IF NOT EXISTS PollingSlot (
    pollSlotId TEXT PRIMARY KEY,
    pollId TEXT NOT NULL,
    voteCount INTEGER NOT NULL,
    startTime DATE NOT NULL,
    endTime DATE NOT NULL CHECK (startTime < endTime),
    pollingSlotDate DATE NOT NULL,

    FOREIGN KEY (pollId) REFERENCES Polling(pollId)
);