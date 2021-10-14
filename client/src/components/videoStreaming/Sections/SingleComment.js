import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LikeDislikes from './LikeDislikes';
const { TextArea } = Input;




function SingleComment(props) {

    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            user: props.auth.user._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }


        Axios.post('/api/video/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }

    const actions = [
        <LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
        <span onClick={openReply} key="comment-basic-reply-to">Reply to </span>
    ]

    return (
        <div>

            <Comment
                actions={actions}
                author={props.comment.user.name}
                avatar={
                    <Avatar
                        src={props.auth.user.profileImg}
                        alt="image"
                    />
                }
                content={
                    <p>
                        {props.comment.content}
                    </p>
                }
            ></Comment>


            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder="write some comments"
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
                </form>
            }

        </div>
    )
}


SingleComment.protoTypes = {
    auth: PropTypes.object.isRequired,
  }

const mapStateToProps = (state) => ({
    auth: state.auth
});


export default connect (mapStateToProps) (SingleComment);
