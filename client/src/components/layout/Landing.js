import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const userType = localStorage.getItem('userType');

const Landing = ({ isAuthenticated }) => {

  const history = useHistory();
  if (isAuthenticated && userType === 'counselor') {
    history.push("/dashboard")
  }
  else if (isAuthenticated && userType === 'user') {
    history.push("/posts")
  }


  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Counselor</h1>
          <p className='lead'>
            Create A Profile To Get Connect With Counselors Nation-wide.
          </p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
