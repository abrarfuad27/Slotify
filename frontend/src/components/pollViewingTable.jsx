// Christina Chen
import React from 'react';
import '../style/pollViewingTable.css';

// Table to display member poll information
const PollViewingTable = ({content}) => {
    return (
        <div className='poll-table-div'>
        <table className='poll-table'>
            {/* Header */}
            <thead>
                <tr>
                    <th>Poll name</th>
                    <th>Poll ID</th>
                    <th>Details</th>
                </tr>
            </thead>
            {/* Body */}
            <tbody>
                {content}
            </tbody>
        </table>
        </div>
    );
};
export default PollViewingTable;
