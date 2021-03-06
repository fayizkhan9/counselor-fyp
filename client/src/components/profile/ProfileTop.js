import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';

const ProfileTop = () => {

  var [profile, setProfile] = useState('')
  var [profileImg, setImg] = useState('')
  var [name, setName] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('profileId')
    api.get(`/profile/user/${userId}`)
      .then(res => {
        setImg(res.data.user.profileImg)
        setName(res.data.user.name)
        setProfile(res.data);
        console.log(profile);
      })
      .catch(err => {
        console.log(err)
      })
  }, [profile])

  return (
    <div className="profile-top bg-primary p-2">
      <img className='round-img-singleProfile' src={profileImg} alt="Not Found" />
      <br></br>
      <h1 className="large">{name}</h1>
      <p className="lead">
        {profile.status} {profile.company ? <span> at {profile.charCodeAtcompany}</span> : null}
      </p>
      <p>{profile.location ? <span>{profile.location}</span> : null}</p>
      <div className="icons my-1">
        {profile.website ? (
          <a href={profile.website} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-globe fa-2x" />
          </a>
        ) : null}
        {profile.social
          ? Object.entries(profile.social)
            .filter(([_, value]) => value)
            .map(([key, value]) => (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={`fab fa-${key} fa-2x`}></i>
              </a>
            ))
          : null}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
