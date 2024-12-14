// Christina Chen
import React from 'react';
import '../style/pollViewingTable.css';

const PollViewingTable = ({content}) => {
    return (
        <div className='poll-table-div'>
        <table className='poll-table'>
            <thead>
                <tr>
                    <th>Poll name</th>
                    <th>Poll ID</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {content}
            </tbody>
        </table>
        </div>
    );
};
export default PollViewingTable;
