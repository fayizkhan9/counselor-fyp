import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = () => {
  return (
    <div className='dash-buttons'>
      <Link to='/edit-profile' className='btn btn-dark' style={{borderRadius:"5px"}}>
        <i className='fas fa-user-circle' /> Edit Profile
      </Link>
      <Link to='/add-experience' className='btn btn-dark' style={{borderRadius:"5px"}}>
        <i className='fab fa-black-tie' /> Add Experience
      </Link>
      <Link to='/add-education' className='btn btn-dark' style={{borderRadius:"5px"}}>
        <i className='fas fa-graduation-cap' /> Add Education
      </Link>
      <Link to='/add-session' className='btn btn-dark' style={{borderRadius:"5px"}}>
        <i className='fab fa-black-tie ' /> Add Session
      </Link>
    </div>
  );
};

export default DashboardActions;
