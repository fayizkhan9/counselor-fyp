import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { searchPost } from "../posts/Posts";


const Navbar = ({ auth: { isAuthenticated }, logout }) => {

  
  const [formData, setFormData] = useState({
    text: "",
  });
  const onChange = (e) => setFormData ({[e.target.name]: e.target.value});
  const onSubmit = (e) => {
    e.preventDefault();
    searchPost (formData);
  }


  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>
          <i className='fas fa-lg fa-user' /> <br />
          <span  id="propLi" className='hide-sm'>Profiles</span>
        </Link>
      </li>

      <li>
        <Link to='/posts'>
          <i className='fa fa-lg fa-tasks' /> <br />
          <span className='hide-sm'>Posts</span>
        </Link>
      </li>

      <li>
        <a href='http://localhost:3001'>
          <i className='fa fa-lg fa-video' /> <br />
          <span className='hide-sm'>Room</span>
        </a>
      </li>

      <li>
        <a href='http://localhost:3002'>
          <i className='fas fa-lg fa-comment-dots' /> <br />
          <span className='hide-sm'>Chat</span>
        </a>
      </li>

      <li>
        <a href='http://localhost:3003'>
          
          <i className='fas fa-lg fa-users' /> <br />
          <span className='hide-sm'>Class</span>
        </a>
      </li>

      <li>
        <Link to='/videos'>
          <i className='fas fa-lg fa-play-circle' /> <br />
          <span className='hide-sm'>Videos</span>
        </Link>
      </li>

      <li>
        <Link to='/dashboard'>
          <i className='fas fa-lg fa-tachometer-alt' /> <br />
          <span className='hide-sm'>Dash</span>
        </Link>
      </li>

      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-lg fa-sign-out-alt' /> <br />
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <div>
      <div>
        <table className='navbarTopTable'>
          <tbody>
            <tr>
              <td id='topLogo'>
                  <Link to='/'>
                    <i id="homeIcon" className='fas fa-lg fa-home'/>
                    <span className='hide-sm'>Counselor</span>
                  </Link>
              </td>
              <td id='topSearch'>
              {isAuthenticated ?
              
                <form className='navTop' onSubmit={onSubmit}>
                  <input type='text' placeholder='search posts ...' name='text' onChange={onChange} />
                  <button type='submit' onSubmit={onSubmit}>
                    <i className='fa fa-search'></i>
                  </button>
                </form>
              :
              <div></div>
            }
            </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='navbar navbar-expand-sm bg-dark navbar-dark'>
        <Fragment>
          {isAuthenticated ? authLinks : guestLinks}
        </Fragment>
      </div>
      
    </div>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
