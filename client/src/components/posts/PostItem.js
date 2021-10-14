import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import Post from '../post/Post';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, image, video, name, profileImg, user, likes, comments, date },
  showActions
}) => {

  const [showComm, setComm] = useState(false)
  
  function showComments() {
    setComm(!showComm);
  }

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img-post" src={profileImg} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <b><p>{text}</p></b>
        {image !== '' ? (<img className="post-image" src={image} alt="Not Found" />) : (
          <div>
            <video width="100%" height="400px" controls>
              <source src={video} type="video/mp4"></source>
            </video>
          </div>
        )}
        <p className="post-date">Posted on {formatDate(date)}</p>

        {showActions && (
          <Fragment>
            <button
              onClick={() => addLike(_id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-up" />{' '}
              <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>

            <button
              onClick={() => removeLike(_id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-down" />
            </button>

            <button onClick={showComments} className="btn btn-primary">
              Comments{' '}
            {comments.length !== 0 ?
                <span className="comment-count">{comments.length}</span>
              : ""}
              
            </button>
            
            {!auth.loading && user === auth.user._id && (
              <button
                onClick={() => deletePost(_id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times" />
              </button>
            )}

            <div><br></br>{(showComm ? <Post id={_id} /> : console.log('Nope'))}</div>

          </Fragment>
        )}
      </div>
    </div>
  )
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);
