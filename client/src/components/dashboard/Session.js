import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteSession } from '../../actions/profile';
import formatDate from '../../utils/formatDate';

const Session = ({ session, deleteSession }) => {
    const sessions = session.map((item) => (
        <tr key={item._id}>
            <td>{item.title}</td>
            <td>
                {formatDate(item.date)}
            </td>
            <td>{item.fromTime}</td>
            <td>{item.toTime}</td>
            <td>{item.price} $</td>
            <td>{item.status}</td>
            <td>{item.bookedByName} <br/> {item.bookedByEmail} <br/> {item.bookedByPhNo} </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteSession(item._id)}> <i className="fas fa-times" /> </button>
            </td>
        </tr>
    ));

    return (
        <Fragment>
            <h2 className="my-2">Session Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th id="tableHeaderLeft">Title</th>
                        <th className="hide-sm">Date</th>
                        <th className="hide-sm">From Time</th>
                        <th className="hide-sm">To Time</th>
                        <th className="hide-sm">Price</th>
                        <th className="hide-sm">Status</th>
                        <th className="hide-sm">Booked By</th>
                        <th className="hide-sm" id="tableHeaderRight">Delete</th>
                    </tr>
                </thead>
                <tbody>{sessions}</tbody>
            </table>
        </Fragment>
    );
};

Session.propTypes = {
    session: PropTypes.array.isRequired,
    deleteSession: PropTypes.func.isRequired
};

export default connect(null, { deleteSession })(Session);
