# Slotify
COMP 307 Final Project

This app facilitates appointments scheduling and booking for students and professors. It also allows easy poll creation and sharing.

## Team 
Student ID | Name |
|---------|-------|
261083785 | Abrar Mohammad Fuad |
260985409 | Christina Chen |
261075511 | Salomon Lavy Perez |
260982699 | Samuel Lin |

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
| Abrar Mohammad Fuad               | Christina Chen     | Samuel Lin                 | Salomon Lavy Perez      |
|-----------------------------------|--------------------|----------------------------|-------------------------|
| Backend Routing and Ticket System | Landing page       | Create poll                | Meeting History         |
| Nav Bar (member/user view)        | Create appointment | Access poll                | Upcoming appointments   |
| User Login/Register               | Manage poll        | Nav Bar (member/user view) | View Meeting Requests   |
| Book appointments                 | Member Dashboard   | Footer                     | Create Meeting Requests |


## Demo of the website

**Landing Page**
![image](https://github.com/user-attachments/assets/303c21d4-fec1-4b3f-a69a-09ce09a4d9ac)


**Creating Appointments**
![image](https://github.com/user-attachments/assets/0d11661f-a4cc-4dde-8c84-69ef8527f39a)


**Booking Appointments**
![image](https://github.com/user-attachments/assets/1b3869df-5f64-4313-b5f0-48d8dca64620)

**Requesting for an alternate time**
![image](https://github.com/user-attachments/assets/7f2d90c0-a5fd-4ac7-95e5-b31e2bbb725c)

**Viewing your upcoming schedule**
![image](https://github.com/user-attachments/assets/be043b04-9dfd-4095-921b-0c42993ebed1)

**Creating a Poll to decide suitable appointment timings**
![image](https://github.com/user-attachments/assets/d0f5de8a-636d-4435-932f-95e07d656dba)

**Voting on a Poll**
![image](https://github.com/user-attachments/assets/e3d4611f-eaa5-4599-9645-f19cc2d90ba7)

**Managing a Poll**
![image](https://github.com/user-attachments/assets/08270fd8-ace3-403f-96b0-615d7082dc3c)


