import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
import { getProfiles } from "../../actions/profile";
import api from "../../utils/api";

const Profiles = ({
  isAuthenticated,
  getProfiles,
  profile: { profiles, loading },
}) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const [searchPofiles, setSearchProfiles] = useState([]);

  const [showAllProfiles, toggleShowAllProfiles] = useState(true);

  const [formData, setFormData] = useState({
    text: "",
  });

  const { text } = formData;

  const onChange = (e) => setFormData({ [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    api.post("/profile/search", formData)
      .then((res) => {
        toggleShowAllProfiles(false);
        setSearchProfiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      {!isAuthenticated ? (
        <Redirect to='/login' />
      ) : loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {/* Search Profiles */}

          <form className='example' onSubmit={onSubmit}>
            <input
              type='text'
              value={text}
              placeholder='Search Profiles ...'
              name='text'
              onChange={onChange}
            />
            <button type='submit' onSubmit={onSubmit}>
              <i className='fa fa-search'></i>
            </button>
          </form>

          <br></br>
          <div className='profiles'>
            {searchPofiles.length > 0 ? (
              searchPofiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : !showAllProfiles ? (
              <h4>No Profiles Found !</h4>
            ) : <div> </div>}
          </div>

          {/* Show All Profiles */}

          {showAllProfiles ? (
            <div>

              <h1 className='large text-primary'>Counselors</h1>
              <p className='lead'>
                <i className='fab fa-connectdevelop' /> Browse and connect with
                Counselors
              </p>

              <div className='profiles'>
                {profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <ProfileItem key={profile._id} profile={profile} />
                  ))
                ) 
                : (
                  <h4>No profiles found...</h4>
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
