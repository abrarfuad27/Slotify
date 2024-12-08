import React from 'react';
import '../style/pollViewingTable.css';

const PollViewingTable = () => {
    return (
        <table className='poll-table'>
            <tr>
                <th>Poll name</th>
                <th>Poll ID</th>
                <th>Details</th>
            </tr>
        </table>
    );
};
export default PollViewingTable;
