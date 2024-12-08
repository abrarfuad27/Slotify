import React from 'react';
import NavBarMember from '../components/navbarMember';
import Footer from "../components/footer";
import '../style/managePoll.css';
import PollViewingTable from '../components/pollViewingTable';

const ManagePoll = () => {
    return (
        <div className='poll-management'>
            <NavBarMember/>
            <div className='poll-management-content'>
                <h1>Manage my polls</h1>
                <div className='active-polls'>
                    <h3>Active poll(s)</h3>
                    <PollViewingTable/>
                </div>
                
                <div className='closed-polls'>
                    <h3>Closed poll(s)</h3>
                    <PollViewingTable/>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default ManagePoll;