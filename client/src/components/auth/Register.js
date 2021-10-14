import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phNo: '',
    password: '',
    password2: '',
    userType: '',
    file: null
  });

  const { name, email, phNo, password, password2, userType } = formData;
  var { file } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    formData.file = e.target.files[0];
    file = formData.file;
  }

  const submitForm = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    }
    else {
      register({ name, email, phNo, password, userType, file });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={submitForm} enctype="multipart/form-data" method="POST">
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Contact Number"
            name="phNo"
            value={phNo}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
          />
        </div>

        <p className="lead">
          <i className="fas fa-user" /> Login As :
        </p>

        <div className="form-radio-input">

          <input className='radio-input'
            type="radio"
            name="userType"
            value="counselor"
            onChange={onChange}
          />
          <b> Counselor </b>
          <br></br>

          <input
            type="radio"
            name="userType"
            value="user"
            onChange={onChange}
          />
          <b> User</b>
          <br></br>
          <br></br>

          <p className="lead">
            <i className="fas fa-user" /> Profile Image:
          </p>

          <input
            type="file"
            name="image"
            onChange={handleFile}
          />

        </div>

        <br></br>
        <input type="submit" className="btn btn-primary" value="Register" />

      </form>

      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
