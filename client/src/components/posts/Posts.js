import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import { getPosts } from "../../actions/post";
import api from "../../utils/api";

var searchAction = "";

export const searchPost = (formData) => {
  searchAction(formData);
};

const Posts = ({ getPosts, post: { posts } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const [searchedPosts, setSearchedPosts] = useState([]);
  const [showAllPosts, toggleShowAllPosts] = useState(true);

  searchAction = (formData) => {
    api
      .post("/posts/search", formData)
      .then((res) => {
        posts = res.data;
        console.log(res.data);
        toggleShowAllPosts(false);
        setSearchedPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      {showAllPosts ? (
        <div>
          <h1 className='large text-primary'>Posts</h1>
          <p className='lead'>
            <i className='fas fa-user' /> Posts - Posted By Users
          </p>
          <PostForm />
          <div className='posts'>
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <div className='posts'>
            {searchedPosts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
      )}
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
