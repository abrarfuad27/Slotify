import React, {useEffect, useState} from 'react';
import NavBarMember from '../components/navbarMember';
import Footer from "../components/footer";
import '../style/managePoll.css';
import PollViewingTable from '../components/pollViewingTable';
import axios from "axios";
import { publicUrl } from "../constants";
import { useAuth } from '../context/AuthContext';
import Modal from "react-modal"; 
import AxisFormatter from '../components/barChart';
import { parseISO, format } from 'date-fns';
import copy_icon from "../assets/copy_icon.png";

const ManagePoll = () => {
    // Member meta data
    const {user} = useAuth();
    const email = user.email;
    const userData = { email};

    // Poll information attributes
    const [polls, setPolls] = useState([]);
    const [activePolls, setActivePolls] = useState(null);
    const [inactivePolls, setInactivePolls] = useState(null);
    const [pollName, setPollName] = useState('');
    const [pollUrl, setPollUrl] = useState('');
    const [pollId, setPollId] = useState('');

    //Poll modal display attribute
    const[displayModalSection, setDisplayModalSection] = useState('');

    // Poll modal attributes
    const [pollModalIsOpen, setPollModalIsOpen] = useState(false);
    const [pollModalMessage, setPollModalMessage] = useState('');
    const [isSuccessPoll, setIsSuccessPoll] = useState(false);
    const [pollLink, setPollLink] = useState('');

    // Confirmation modal attributes
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);    
    
    // Bar chart data
    const [dataset, setDataset] = useState([]);

    //Error modal attributes
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");

    // Error modal methods
    const openErrorModal = (message) => {
        setErrorModalMessage(message);
        setErrorModalIsOpen(true);
    };

    const closeErrorModal = () => {
        setErrorModalIsOpen(false);
    };
    

    //confirmation modal methods
    const openModal = (message, success) => {
        setModalMessage(message);
        setIsSuccess(success);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };


    // Poll modal methods
    const openModalPoll = (message, success) => {
        setPollModalMessage(message);
        setIsSuccessPoll(success);
        setPollModalIsOpen(true);
      };
    
    const closeModalPoll = () => {
    setPollModalIsOpen(false);
    };

    // Method to get polls
    const getManagedPolls = async () => {
        try{
          const resp = await axios.get(`${publicUrl}/getManagedPolls`, {
            params: userData
          });
          console.log(resp);
          setPolls(resp.data.data);
           
        }catch (error) {
          openErrorModal('There was an error getting the polls.');
          console.error('There was an error getting the polls.', error);
        }
    };

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

    const handleClick = async (e) => {
        try{
            const pollId = e.currentTarget.id;
            const response = await axios.get(`${publicUrl}/pollAndSlots`, {
                params: {pollId}
            });
        console.log(response);
        if (response.status === 200) {
            const data = response.data;
            const tempDataset = [];
            for (let i = 0; i< data.slots.length; i++) {
                let d = data.slots[i];
                tempDataset.push({
                    date: formatDateTime(d.startTime, d.endTime, d.pollingSlotDate), 
                    option: `option ${i+1}`, 
                    vote_count: d.voteCount 
                });
            }
            const display_mode = data.isActive ? 'display' : 'do-not-display';
            openModalPoll(data.pollQuestion, true);
            setDisplayModalSection(display_mode);
            setDataset(tempDataset);  
            setPollName(data.pollName);  
            setPollUrl(data.pollUrl); 
            setPollId (data.pollId);
            setPollLink(data.pollUrl);
        } else {
            openErrorModal('There was an error getting the details of this poll');
        }
        // open modal
        }catch (error) {
            openErrorModal('There was an error getting the details of this poll');
        }
    };
    const showPolls = (isActive) => {
        let filteredPolls = polls.filter((poll) => {
            return poll.isActive === isActive;
        });
        let mapPolls = filteredPolls.map((poll, index) => (
            <tr key={index}>
                <td>{poll.pollId}</td>
                <td>{poll.pollName}</td>
                <td>
                    <div id={poll.pollId} className='link' onClick={handleClick}>View Details</div>
                  
                </td>
            </tr>
        ))
        if (isActive) {
            setActivePolls(mapPolls);
        }else{
            setInactivePolls(mapPolls);
        }
    };

    const handleConfirmation = () => {
        openModal("Are you sure you want to close the poll?", true);
    }

    const handleEndPoll = async () => {
        try {
            await axios.put(`${publicUrl}/endPoll`, {
                pollId,
            });
        }catch(err){
            openErrorModal('There was an error when ending the poll.');
        }    
    };
    useEffect(() => {
        getManagedPolls();

    }, []);

    useEffect(() => {
        showPolls(1);
        showPolls(0);
    }, [polls])

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };
      
    return (
        <div className='poll-management'>
            <NavBarMember/>
            <div className='poll-management-content'>
                <h1>Manage my polls</h1>
                <div className='active-polls'>
                    <h2>Active poll(s)</h2>
                    <PollViewingTable content={activePolls && activePolls.length !== 0 ? activePolls : <tr><td colSpan='3'>No polls found.</td></tr>}/>
                </div>
                <div className='closed-polls'>
                    <h2>Closed poll(s)</h2>
                    <PollViewingTable content={inactivePolls && inactivePolls.length !== 0 ? inactivePolls : <tr><td colSpan='3'>No polls found.</td></tr>}/>
                </div>
            </div>
            <Footer/>
            <Modal
                isOpen={pollModalIsOpen}
                onRequestClose={closeModalPoll}
                contentLabel="Poll Result"
                className="poll-modal"
                overlayClassName="modal-overlay"
            >
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
                <div className='modal-content'>
                    
                    <h2>Results for: {pollName}</h2>
                    <h3>{pollModalMessage}</h3>
                    <AxisFormatter dataset={dataset}/>

                    {/* this section is only visible for active polls */}
                    <div className={`${displayModalSection} active-poll-info`}>
                        <p className='poll-ended-msg'>Poll has ended </p>
                        <button
                        className='end-poll-btn'
                        onClick={handleConfirmation}
                        >
                        End poll
                        </button>

                        <div className='share-poll-section'>
                            <p> Share poll token: &nbsp; 
                                <a
                                href={pollLink}
                                className="modal-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                    {pollUrl}
                                </a>
                            </p>
                            <button
                                className="copy-icon-btn"
                                onClick={() => copyToClipboard(pollLink)}
                            >
                            {/* when styling add class name */}
                                <img src={copy_icon} alt='Copy icon'/>
                            </button>
                        </div>
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
                onRequestClose={closeErrorModal }
                contentLabel="Manage Poll Status"
                className="modal"
                overlayClassName="modal-overlay"
            >
                {/* Modal content */}
                <h2>Error</h2>
                <p>{errorModalMessage}</p>

                {/* Modal closing button */}
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