import React from 'react';
import '../style/pollViewingTable.css';

const PollViewingTable = ({content}) => {
    return (
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
    );
};
export default PollViewingTable;
