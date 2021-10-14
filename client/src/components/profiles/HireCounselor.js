import React, { Fragment, useState } from 'react';
import formatDate from '../../utils/formatDate';
import api from '../../utils/api';
import { connect } from 'react-redux'
import StripeCheckOut from 'react-stripe-checkout';

const HireCounselors = ({ auth, match }) => {

    var [product] = useState({});

    const [session, setSessionData] = useState([]);
    const [userData, setUserData] = useState({});
    const [profileId, setProfileId] = useState('');
    const [sessionId, setSessionId] = useState('');

    const getSessionsData = (userId) => {
        api.get(`/profile/user/${userId}`)
            .then(res => {
                setUserData(res.data.user);
                setProfileId(res.data._id);
                filterSessionData(res.data.session);
            })
            .catch(err => {
                console.log(err)
            })
    };

    const filterSessionData = (data) => {
        var avaibleOnly = [];
        var j = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].status === "available") {
                avaibleOnly[j] = data[i];
                j = j + 1;
            }
        }
        setSessionData(avaibleOnly);
    }


    if (session.length === 0)
        getSessionsData(match.params.id);


    const clickedSession = (e) => {

        setSessionId(e.target.value);

        for (var i = 0; i < session.length; i++) {
            if (session[i]._id === sessionId) {
                product = {
                    name: session[i].title,
                    price: session[i].price,
                    description: session[i].description
                };
            }
        }
    }

    async function updateUi() {

        await api.post(`/payment/updateBookingStatus/${profileId}`, { sessionId })
            .then(res => {
                console.log(res.data)
                setSessionData(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    async function updateClientInfo() {

        const sendData = {
            name: auth.user.name,
            email: auth.user.email,
            phNo: auth.user.phNo
        }

        await api.post(`/payment/client/${sessionId}`, sendData)
            .then(res => {
                setSessionData(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    async function handleToken(token, address) {
        const res = await api.post('/payment/checkout/', { token, product })
        const { status } = res.data;
        if (status === "success") {
            
            alert("Hired Successfully")
            updateUi();
            updateClientInfo();
        }
        else
            console.log("================  Error");
    }


    return (
        <Fragment>
            <h2 className='large text-primary'>Sessions Details</h2>
            <p className='lead'><i className='fab fa-connectdevelop' /> These are available slots by <b>{userData.name}</b></p>
            <br></br>

            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th className="hide-sm">Date</th>
                        <th className="hide-sm">From Time</th>
                        <th className="hide-sm">To Time</th>
                        <th className="hide-sm">Status</th>
                        <th className="hide-sm">Charges</th>
                        <th >Select</th>
                    </tr>
                </thead>

                <tbody>
                    {session.length > 0 ? (
                        session.map((item) => (

                            <tr key={item._id}>
                                <td>{item.title}</td>
                                <td>
                                    {formatDate(item.date)}
                                </td>
                                <td>{item.fromTime}</td>
                                <td>{item.toTime}</td>
                                <td>{item.status} for Hiring</td>
                                <td>{item.price} $</td>
                                <td id="btn-center">
                                    <input
                                        type="radio"
                                        placeholder="Name"
                                        name="name"
                                        value={item._id}
                                        onChange={clickedSession}
                                    />
                                </td>
                            </tr>

                        ))) : (<h4 className="">Counselor has not posted any availble sessions for Hiring.</h4>)}

                </tbody>
            </table>
            <br></br>

            <div className="pay-btn">
                <StripeCheckOut
                    stripeKey="pk_test_51IxblRCgLuW51TZUS6Pl6dcHy99p1iIHl1ahZ0iWI289txZd4anJPOZLtLu69Lpot7VlRUPgLTlkidO3iycsPAgR00krO04jiP"
                    token={handleToken}
                    billingAddress
                    amount={product.price * 100}
                />
            </div>
        </Fragment >
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(HireCounselors);
