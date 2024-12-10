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
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { barElementClasses } from '@mui/x-charts/BarChart';
import { parseISO, format } from 'date-fns';
const ManagePoll = () => {
    const {user} = useAuth();
    const email = user.email;
    const userData = { email};
    const [polls, setPolls] = useState([]);
    const [activePolls, setActivePolls] = useState(null);
    const [inactivePolls, setInactivePolls] = useState(null);

    // modal attributes
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [pollName, setPollName] = useState("");

    
    // bar chart data
    const [dataset, setDataset] = useState([]);


    const openModal = (message, success) => {
        setModalMessage(message);
        setIsSuccess(success);
        setModalIsOpen(true);
      };
    
      const closeModal = () => {
        setModalIsOpen(false);
      };

    // method to get polls
    const getManagedPolls = async () => {
        try{
          const resp = await axios.get(`${publicUrl}/getManagedPolls`, {
            params: userData
          });
          console.log(resp);
          setPolls(resp.data.data);
           
        }catch (error) {
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
            openModal(data.pollQuestion, true);
            const tempDataset = [];
            for (let i = 0; i< data.slots.length; i++) {
                let d = data.slots[i];
                tempDataset.push({
                    date: formatDateTime(d.startTime, d.endTime, d.pollingSlotDate), 
                    option: `option ${i+1}`, 
                    vote_count: d.voteCount 
                });
            }
            setDataset(tempDataset);  
            setPollName(data.pollName);   
            console.log("THE DATA SET", tempDataset);       
        } else {
            openModal("There was an error :", false);
        }
        // open modal
        }catch (error) {
            console.error('There was an error getting the polls.', error);
        }
        
    };
    const showPolls = (isActive) => {
        let filteredPolls = polls.filter((poll) => {
            console.log("IN", poll.isActive == isActive);
            return poll.isActive == isActive;
        });
        console.log("FILTER" , filteredPolls);
        let mapPolls = filteredPolls.map((poll, index) => (
            <tr key={index}>
                <td>{poll.pollId}</td>
                <td>{poll.pollName}</td>
                <td>
                    <div id={poll.pollId} onClick={handleClick}>View Details</div>
                  
                </td>
            </tr>
        ))
        if (isActive) {
            setActivePolls(mapPolls);
        }else{
            setInactivePolls(mapPolls);
        }
    };

    useEffect(() => {
        getManagedPolls();

    }, []);

    useEffect(() => {
        showPolls(1);
        showPolls(0);
    }, [polls])

    // if (loading) {
    //     return <div className="loading">Loading...</div>;
    // }




    const chartParams = {
        yAxis: [
          {
            label: 'Vote Count',
          },
        ],
        series: [
          {
          //   label: 'GDP',
            dataKey: 'vote_count',
            valueFormatter: (v) =>
              `${v} votes`,
          },
        ],
        slotProps: { 
            legend: { hidden: true }},
        dataset,
        width: 600,
        height: 400,
        sx: {
            [`.${barElementClasses.root}`]: { 
                '&:hover': { fill: '#085A77', 
                stroke: '#085A77',
                }, 

            },
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
          },
          [`.${axisClasses.root}`]: {
            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
              stroke: '#085A77',
              strokeWidth: 5,
            },
            [`.${axisClasses.tickLabel}`]: {
              fill: '#085A77',
            },
          },
        }
      };
    return (
        <div className='poll-management'>
            <NavBarMember/>
            <div className='poll-management-content'>
                <h1>Manage my polls</h1>
                <div className='active-polls'>
                    <h3>Active poll(s)</h3>
                    <PollViewingTable content={activePolls ? activePolls : <tr>No upcoming appointments found.</tr>}/>
                </div>
                
                <div className='closed-polls'>
                    <h3>Closed poll(s)</h3>
                    <PollViewingTable content={inactivePolls}/>
                </div>
            </div>
            <Footer/>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Appointment Creation Status"
                className="modal poll-modal"
                overlayClassName="modal-overlay"
                style={{
                    content: {
                        width: '65vw',
                        height: '80vh',
                        maxWidth: 'none',
                    }
                }}
            >
                <div className='modal-content'>
                    <h2>Results for: {pollName}</h2>
                    <p>{modalMessage}</p>
                    <AxisFormatter dataset={dataset} chartParams={chartParams}/>

                    <button
                    onClick={() => {
                        if (isSuccess) {
                        window.location.reload(); // Refresh the page
                        } else {
                        closeModal(); // Close the modal if not successful
                        }
                    }}
                    >
                    End poll
                    </button>
                </div>
                

            </Modal>
            
        </div>
    );
};

export default ManagePoll;