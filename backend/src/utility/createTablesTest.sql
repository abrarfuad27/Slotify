
-- Name: Samuel Lin --
-- Christina Chen

-- Members Table --

-- Drop tables if they exist
DROP TABLE IF EXISTS Timeslot;
DROP TABLE IF EXISTS Appointment;
DROP TABLE IF EXISTS Member;
DROP TABLE IF EXISTS PollingSlot;
DROP TABLE IF EXISTS Polling;

CREATE TABLE Member (
    email TEXT PRIMARY KEY,
    encryptedPassword TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL
);

-- Appointments Table --

CREATE TABLE Appointment ( 
    appointmentId TEXT PRIMARY KEY, 
    mode TEXT CHECK (mode IN ('recurring', 'one-time')), 
    creator TEXT NOT NULL, 
    startDate DATE NOT NULL, 
    endDate DATE NOT NULL CHECK (startDate <= endDate), 
    topic TEXT NOT NULL, 
    course TEXT,
    appointmentURL TEXT NOT NULL UNIQUE,

    FOREIGN KEY (creator) REFERENCES Member(email)
);

-- Timeslot Table --

CREATE TABLE Timeslot ( 
    timeslotID TEXT PRIMARY KEY, 
    appointmentId TEXT NOT NULL, 
    startTime TIME NOT NULL, 
    endTime TIME NOT NULL CHECK (startTime < endTime), 
    timeslotDate DATE NOT NULL, 
    appointee TEXT, 
    isRequest BOOLEAN NOT NULL, 
    requestStatus TEXT CHECK (requestStatus IN ('approved', 'pending')),
    
    FOREIGN KEY (appointmentId) REFERENCES Appointment(appointmentId) 
);

-- Polling Table --

CREATE TABLE Polling (
    pollId TEXT PRIMARY KEY,
    pollName TEXT NOT NULL,
    pollQuestion TEXT NOT NULL,
    creator TEXT NOT NULL,
    isActive BOOLEAN NOT NULL,
    pollUrl TEXT NOT NULL UNIQUE
);

-- Polling Slot Table --

CREATE TABLE PollingSlot (
    pollSlotId TEXT PRIMARY KEY,
    pollId TEXT NOT NULL,
    voteCount INTEGER NOT NULL,
    startTime DATE NOT NULL,
    endTime DATE NOT NULL CHECK (startTime < endTime),
    pollingSlotDate DATE NOT NULL,

    FOREIGN KEY (pollId) REFERENCES Polling(pollId)
);