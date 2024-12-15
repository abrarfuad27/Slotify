// Christina Chen
import React, { useEffect, useState } from 'react';
import NavBarMember from '../components/navbarMember';
import Footer from "../components/footer";
import '../style/managePoll.css';
import PollViewingTable from '../components/pollViewingTable';
import axios from "axios";
import { publicUrl } from "../constants";
import { useAuth } from '../context/AuthContext';
import Modal from "react-modal";
import PollBarChart from '../components/barChart';
import { parseISO, format } from 'date-fns';
import copy_icon from "../assets/copy-icon.png";

// Page to manage a member's active/inactive polls
const ManagePoll = () => {
    // Member meta data
    const { user } = useAuth();
    const email = user.email;
    const userData = { email };

    // Poll information attributes
    const [polls, setPolls] = useState([]);
    const [activePolls, setActivePolls] = useState(null);
    const [inactivePolls, setInactivePolls] = useState(null);
    const [pollName, setPollName] = useState('');
    const [pollUrl, setPollUrl] = useState('');
    const [pollId, setPollId] = useState('');

    //Poll modal display attribute
    const [displayModalSection, setDisplayModalSection] = useState('');

    // Poll bar chart modal attributes
    const [pollModalIsOpen, setPollModalIsOpen] = useState(false);
    const [pollModalMessage, setPollModalMessage] = useState('');
    const [isSuccessPoll, setIsSuccessPoll] = useState(false);
    const [pollLink, setPollLink] = useState('');

    // Confirmation modal attributes
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    // Bar chart data
    const [dataset, setDataset] = useState([]);

    // Error modal attributes
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");


    // Get all the polls a member created
    useEffect(() => {
        getManagedPolls();
    }, []);

    // Show Active and Inactive polls
    useEffect(() => {
        const active = 1;
        const inactive = 0;
        showPolls(active);
        showPolls(inactive);
    }, [polls]);

    // Error modal methods
    const openErrorModal = (message) => {
        setErrorModalMessage(message);
        setErrorModalIsOpen(true);
    };

    const closeErrorModal = () => {
        setErrorModalIsOpen(false);
    };

    // Confirmation modal methods
    const openModal = (message, success) => {
        setModalMessage(message);
        setIsSuccess(success);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    // Poll bar chart modal methods
    const openModalPoll = (message, success) => {
        setPollModalMessage(message);
        setIsSuccessPoll(success);
        setPollModalIsOpen(true);
    };

    const closeModalPoll = () => {
        setPollModalIsOpen(false);
    };

    // Method to get all the polls a member has created
    const getManagedPolls = async () => {
        try {
            // Call backend API to get polls
            const resp = await axios.get(`${publicUrl}/getManagedPolls`, {
                params: userData
            });
            // Set the list of polls
            setPolls(resp.data.data);

        }
        // Open error modal
        catch (error) {
            openErrorModal('There was an error getting the polls.');
        }
    };

    // Method to get information of a specific poll - called when a user clicks on 'View Details'
    const handleClick = async (e) => {
        try {
            const pollId = e.currentTarget.id;

            // Call backend API to get data on poll
            const response = await axios.get(`${publicUrl}/pollAndSlots`, {
                params: { pollId }
            });

            // If successful retrieval
            if (response.status === 200) {
                const data = response.data;
                const tempDataset = [];

                // Generate dataset for bar chart, based on poll information
                for (let i = 0; i < data.slots.length; i++) {
                    let d = data.slots[i]; // get poll option information
                    tempDataset.push({
                        date: formatDateTime(d.startTime, d.endTime, d.pollingSlotDate),
                        option: `option ${i + 1}`,
                        vote_count: d.voteCount
                    });
                }

                const display_mode = data.isActive ? 'display' : 'do-not-display';

                openModalPoll(data.pollQuestion, true); // show bar chart
                setDisplayModalSection(display_mode); // display bar chart informations based on poll status 
                setDataset(tempDataset); //set the dataset for bar chart

                // set barchart information
                setPollName(data.pollName);
                setPollUrl(data.pollUrl);
                setPollId(data.pollId);
                setPollLink(data.pollUrl);
            } else {
                // Open error modal
                openErrorModal('There was an error getting the details of this poll');
            }
            // Open error modal
        } catch (error) {
            openErrorModal('There was an error getting the details of this poll');
        }
    };

    // Method to show polls based on status (active/inactive)
    const showPolls = (isActive) => {

        // Filter and get only polls where status === isActive
        let filteredPolls = polls.filter((poll) => {
            return poll.isActive === isActive;
        });

        // Generate table data with poll information
        let result = filteredPolls.map((poll, index) => (
            <tr key={index}>
                <td>{poll.pollName}</td>
                <td>{poll.pollId}</td>
                <td>
                    <div id={poll.pollId} className='link' onClick={handleClick}>View Details</div>
                </td>
            </tr>
        ));

        // Set poll information
        if (isActive) {
            setActivePolls(result);
        } else {
            setInactivePolls(result);
        }
    };

    // Method to open modal and confirm poll closure 
    const handleConfirmation = () => {
        openModal("Are you sure you want to close the poll?", true);
    }

    // Method to end a poll
    const handleEndPoll = async () => {
        try {
            // Call backend API to end poll
            await axios.put(`${publicUrl}/endPoll`, {
                pollId,
            });
        }
        // Open error modal
        catch (err) {
            openErrorModal('There was an error when ending the poll.');
        }
    };

    // Method to copy poll Url to clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Could not copy text:', error);
        }
    };

    // Method to format date and time for the poll bar chart
    // Example output : December 31st, 2024 | 8:00 AM - 9:00 AM
    const formatDateTime = (startTime, endTime, date) => {
        let formatted_date_time = '';
        const start_time = parseISO(`${date}T${startTime}:00`);
        const end_time = parseISO(`${date}T${endTime}:00`);

        const formatted_date = format(parseISO(date), 'MMMM do, yyyy');
        const formatted_start_time = format(start_time, 'h:mm a');
        const formatted_end_time = format(end_time, 'h:mm a');

        formatted_date_time = `${formatted_date} | ${formatted_start_time} - ${formatted_end_time}`
        return formatted_date_time;
    };

    return (
        <div className='poll-management'>
            {/* Nav bar */}
            <NavBarMember />
            {/* Main content */}
            <div className='poll-management-content'>
                <h1>Manage my polls</h1>

                {/* Tables that shows active polls */}
                <div className='active-polls'>
                    <h2>Active poll(s)</h2>
                    <PollViewingTable content={activePolls && activePolls.length !== 0 ? activePolls : <tr><td colSpan='3' style={{ border: 'none' }}>No polls yet</td></tr>} />
                </div>
                {/* Tables that shows closed polls */}
                <div className='closed-polls'>
                    <h2>Closed poll(s)</h2>
                    <PollViewingTable content={inactivePolls && inactivePolls.length !== 0 ? inactivePolls : <tr><td colSpan='3' style={{ border: 'none' }}>No polls yet</td></tr>} />
                </div>
            </div>
            {/* Footer */}
            <Footer />

            {/* Modal that shows poll statistics in a bar chart */}
            <Modal
                isOpen={pollModalIsOpen}
                onRequestClose={closeModalPoll}
                contentLabel="Poll Result"
                className="poll-modal"
                overlayClassName="modal-overlay"
            >
                {/* Button to close modal */}
                <button
                    className='close-modal-btn'
                    onClick={() => {
                        if (isSuccessPoll) {
                            window.location.reload(); // Refresh the page
                        } else {
                            closeModalPoll(); // Close the modal if not successful
                        }
                    }}>
                    X
                </button>

                {/* Poll bar chart content */}
                <div className='modal-content'>

                    <h2>Results for: {pollName}</h2>
                    <h3>{pollModalMessage}</h3>

                    {/* Bar chart */}
                    <PollBarChart dataset={dataset} />

                    {/* Section only visible for active polls */}
                    <div className={`${displayModalSection} active-poll-info`}>
                        <p className='poll-ended-msg'>Poll has ended </p> {/* Message is only available for closed polls*/}
                        <button
                            className='end-poll-btn'
                            onClick={handleConfirmation}
                        >
                            End poll
                        </button>

                        {/* Section with poll Url that member can share */}
                        <div className='share-poll-section'>
                            Share poll URL: &nbsp;
                                <p className='poll-url'>
                                    {pollUrl}
                                </p>
                            {/* Button that allows user to copy Url */}
                            <button
                                className="copy-icon-btn"
                                onClick={() => copyToClipboard(pollLink)}
                            >
                                <img src={copy_icon} alt='Copy icon' />
                            </button>
                        </div>
                        <div className="copy-confirmation">{copied && "Link Copied!"}</div>
                    </div>
                </div>
            </Modal>

            {/* Confirmation modal, to end poll */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Appointment Creation Status"
                className="confirmation-modal"
                overlayClassName="modal-overlay"
            >
                <h3>{modalMessage}</h3>
                {/* Yes (end poll) button */}
                <button
                    className='confirm-yes'
                    onClick={() => {

                        if (isSuccess) {
                            handleEndPoll(); //end the poll
                            setDisplayModalSection('do-not-display')
                            closeModal();
                        } else {
                            closeModal(); // Close the modal if not successful
                        }
                    }}
                >
                    Yes
                </button>

                {/* No (don't end poll) button */}
                <button
                    className='confirm-no'
                    onClick={() => {
                        closeModal();
                    }}
                >
                    No
                </button>

            </Modal>

            {/* Error message modal */}
            <Modal
                isOpen={errorModalIsOpen}
                onRequestClose={closeErrorModal}
                contentLabel="Error Status"
                className="modal"
                overlayClassName="modal-overlay"
            >
                {/* Error modal content */}
                <h2>Error</h2>
                <p>{errorModalMessage}</p>

                {/* Error modal closing button */}
                <button
                    onClick={() => {
                        window.location.reload();
                        closeErrorModal();
                    }}
                >
                    OK
                </button>
            </Modal>
        </div>
    );
};

export default ManagePoll;