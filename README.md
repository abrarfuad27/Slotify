# Slotify
COMP 307 Final Project

This app facilitates appointments scheduling and booking for students and professors. It also allows easy poll creation and sharing.

## How to run the app:
**Browser : use Chrome**

**Website URL : https://fall2024-comp307-group06.cs.mcgill.ca**

**Note about the meeting/poll URL** : 
To find a meeting/poll, we input the URL into the search bar in the "Book Appointment" and "Access Poll" page. **We can't query for an appointment/poll on the browser.**

Confirmed this as a valid implentation with professor Vybihal over email.

### IF ON LOCAL:

* In **backend/src/constants.js**, change the following: 
    * backendPort: uncomment whichever port is available, and comment the other one.
    * frontendUrl: uncomment the *localhost* URL, and comment the `fall2024` one.
* In **frontend/src/constants.js**, change the following:
    * publicUrl: uncomment whichever port is available, and comment all other lines.
* CTRL-C the backend and frontend if it already was running.
* When running the backend, use the command `npm run dev` in the `Slotify/backend` directory.
* After running `npm start` in `Slotify/frontend`, the webapp will be running on your default localhost with the *frontendPort* in **frontend/src/constants.js** (most likely port 3000).

### IF ON SERVER (i.e. running from SOCS's MERN server)

* **Run McGill VPN if not on campus**
* Connect to SSH (e.g. on VSCode)
* In **backend/src/constants.js**, change the following:
    * backendPort: uncomment `backendPort 5000`, and comment the other one.
    * frontendUrl: uncomment the `fall2024` URL line, and comment the `localhost` one.
* In **frontend/src/constants.js**, change the following:
    * publicUrl: uncomment the `fall2024[...]/api` URL line, and comment all other lines.
* CTRL-C the backend and frontend if it already was running.
* When running the backend, use the command `npm run prod` in the `Slotify/backend` directory.
* After running `npm start` in `Slotify/frontend`, the webapp will be running on **https://fall2024-comp307-group06.cs.mcgill.ca**, not on your localhost.

N.B.: `npm start` on frontend should not be affected, but restart with CTRL-C just in case.

## App features
Note : non-member refers to people who do not have an account with Slotify

### Public pages
1. Landing page
2. Login and register page with a ticket system for security
3. Book a meeting using URL page (non-member)
4. Access Poll page (vote on poll) (non-member)

### Private pages
1. Book a Meeting using URL page (member)
2. Meeting Request page (sending a meeting request to someone)
3. Upcoming Appointments page (upcoming appointment that member has created or will attend)
4. History page (past appointments that member attended or created)
5. Create Poll page
6. Access Poll page (vote on poll) (member)
7. Manage a Poll (display poll active and inactive polls statistics, allow user to end a poll)

## Contributions

| Abrar Mohammad Fuad  | Christina Chen  | Samuel Lin  | Salomon Lavy Perez  |
|-----------|-----------|-----------|-----------|
| Backend Routing and Ticket System | Landing page | Create poll | Meeting History |
| Nav Bar (member/user view) | Create appointment | Access poll | Upcoming appointments |
| User Login/Register | Manage poll | Nav Bar (member/user view) | View Meeting Requests |
| Book appointments | Member Dashboard | Footer | Create Meeting Requests |
