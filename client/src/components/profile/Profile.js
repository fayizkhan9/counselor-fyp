import React, { Fragment, useEffect, useState } from 'react';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import api from '../../utils/api';

const Profile = () => {

  var [profile, setProfile] = useState({});
  var [experience, setExp] = useState([]);
  var [education, setEdu] = useState([]);


  useEffect(() => {
    const userId = localStorage.getItem('profileId')
    api.get(`/profile/user/${userId}`)
      .then(res => {
        setProfile(res.data);
        setExp(res.data.experience);
        setEdu(res.data.education);
      })
      .catch(err => {
        console.log(err)
      })
  }, []);

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <Fragment>

          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {experience.length > 0 ? (
                <Fragment>
                  {experience.map((experience) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {education.length > 0 ? (
                <Fragment>
                  {education.map((education) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>

          </div>
        </Fragment>
      )}
    </Fragment>
  );
};


export default Profile;
