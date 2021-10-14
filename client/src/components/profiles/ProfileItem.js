import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const ProfileItem = ({ auth,
  profile: { user: { _id, name, profileImg },
    status,
    company,
    location,
    skills
  }
}) => {

  const history = useHistory();

  const handleClick = () => {
    localStorage.setItem('profileId', _id);
    history.push('/singleProfile');
  }

  return (
    <div>
      <div>
        <div className='profile bg-light'>
          <img src={profileImg} alt='Img Not Found' className='round-img' />
          <div>
            <h2>{name}</h2>
            <p>
              {status} {company && <span> at {company}</span>}
            </p>
            <p className='my-1'>{location && <span>{location}</span>}</p>

            <button onClick={handleClick} className='btn btn-primary'>
              View Profile
            </button>
            {(_id !== auth.user._id) ?
              <Link to={`/hire-counselor/${_id}`} className='btn btn-dark'>
                Hire
              </Link>
              : ("")
            }
          </div>
          <ul>
            {skills.slice(0, 4).map((skill, index) => (
              <li key={index} className='text-primary'>
                <i className='fas fa-check' /> {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(ProfileItem);
