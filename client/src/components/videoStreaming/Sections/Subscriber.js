import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";


function Subscriber(props) {
    
    const userTo = props.userTo
    const userFrom = props.auth.user._id

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    const onSubscribe = ( ) => {

        let subscribeVariables = {
                userTo : userTo,
                userFrom : userFrom
        }

        if(Subscribed) {
            //when we are already subscribed 
            axios.post('/api/video/unSubscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success){ 
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to unsubscribe')
                    }
                })

        } else {
            // when we are not subscribed yet
            
            axios.post('/api/video/subscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to subscribe')
                    }
                })
        }

    }


    useEffect(() => {

        const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom }
        axios.post('/api/video/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('Failed to get subscriber Number')
                }
            })

        axios.post('/api/video/subscribed', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subcribed)
                } else {
                    alert('Failed to get Subscribed Information')
                }
            })

    }, [userFrom, userTo])


    return (
        <div>
            <button 
            onClick={onSubscribe}
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}>
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}



Subscriber.prototypes = {
    auth: PropTypes.object.isRequired,
  }
  
  const mapStateToProps = (state) => ({
    auth: state.auth
  });
  

export default connect(mapStateToProps) (Subscriber);

