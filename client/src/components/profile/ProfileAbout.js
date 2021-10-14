import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';

const ProfileAbout = () => {

  var [profile, setProfile] = useState('');
  var [skills, setSkills] = useState([])


  useEffect(() => {
    const userId = localStorage.getItem('profileId')
    api.get(`/profile/user/${userId}`)
      .then(res => {
        setSkills(res.data.skills);
        setProfile(res.data);

        console.log(profile);
      })
      .catch(err => {
        console.log(err)
      });
  }, [profile]);



  return (
    <div className='profile-about bg-light p-2'>
      {profile.bio && (
        <Fragment>
          <h2 className='text-primary'>{profile.user.name.trim().split(' ')[0]}'s Bio</h2>
          <p>{profile.bio}</p>
          <div className='line' />
        </Fragment>
      )}
      <h2 className='text-primary'>Skill Set</h2>
      <div className='skills'>
        {skills.map((skill, index) => (
          <div key={index} className='p-1'>
            <i className='fas fa-check' /> {skill}
          </div>
        ))}
      </div>
    </div>
  )
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
