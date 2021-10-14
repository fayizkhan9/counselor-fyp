import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addSession } from '../../actions/profile';

const AddSession = ({ addSession, history }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        fromTime: '',
        toTime: '',
        price: '',
        bookedByName: '',
        bookedByEmail: '',
        bookedByPhNo: '',
        status: 'available',
        description: ''
    });

    const { title, date, fromTime, toTime, price, description } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <Fragment>
            <h1 className="large text-primary">Add a Session</h1>
            <p className="lead">
                <i className="fas fa-code-branch" /> Add any Available Date / Time for Being Hired
            </p>
            <form
                className="form"
                onSubmit={e => {
                    e.preventDefault();
                    addSession(formData, history);
                }}
            >
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <h4>Date</h4>
                    <input type="date" name="date" value={date} onChange={onChange} min={new Date().toISOString().split('T')[0]} required />
                </div>

                <div className="form-group">
                    <h4>From Time</h4>
                    <input type="time" name="fromTime" value={fromTime} onChange={onChange} required />
                </div>

                <div className="form-group">
                    <h4>To Time</h4>
                    <input type="time" name="toTime" value={toTime} onChange={onChange} />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Price in $"
                        name="price"
                        value={price}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Description"
                        value={description}
                        onChange={onChange}
                    />
                </div>

                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-dark my-1" to="/dashboard">
                    Go Back
                </Link>
            </form>
        </Fragment>
    );
};

AddSession.propTypes = {
    addSession: PropTypes.func.isRequired
};

export default connect(null, { addSession })(AddSession);
