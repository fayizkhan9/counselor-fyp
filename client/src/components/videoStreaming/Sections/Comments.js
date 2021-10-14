import React, { useState } from 'react'
import { Button, Input } from 'antd';
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
const { TextArea } = Input;

function Comments(props) {

    const [Comment, setComment] = useState("")

    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: Comment,
            user: props.auth.user._id,
            postId: props.postId
        }

        axios.post('/api/video/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setComment("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }

    
    return (
        <div>
            <br />
            <p> Comments </p>
            <hr />

             {/* Root Comment Form */}

             <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="write some comments"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>

            
            {/* Comment Lists  */}
        
            {props.CommentLists && props.CommentLists.map((comment, index) => (
                <React.Fragment>
                    <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                    <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                </React.Fragment>
                
            ))}
     
        </div>
    )
}


Comments.protoTypes = {
    auth: PropTypes.object.isRequired,
  }

const mapStateToProps = (state) => ({
    auth: state.auth
});


export default connect (mapStateToProps) (Comments);
