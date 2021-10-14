import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostItem from './PostItem';
import Spinner from '../layout/Spinner';
import api from '../../utils/api';


const SearchProfile = ({ profile: { loading } }) => {

    const [profiles, setProfiles] = useState([])

    const [formData, setFormData] = useState({
        text: ''
    });

    const { text } = formData;

    const onChange = e =>
        setFormData({ [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        api.post('/profile/search', formData)
            .then(res => {
                setProfiles(res.data);
            })
            .catch(err => {
                console.log(err)
            })
    };


    return (
        <Fragment>

            {loading ? (
                <Spinner />
            ) : (
                <Fragment>

                    <form className="example" onSubmit={onSubmit}>
                        <input type="text" value={text} placeholder="Search Profiles ..." name="text" onChange={onChange} />
                        <button type="submit" onSubmit={onSubmit}><i className="fa fa-search"></i></button>
                    </form>

                    <br></br>

                    <div className='profiles'>

                        {profiles.length > 0 ? (
                            profiles.map(profile => (
                                <ProfileItem key={profile._id} profile={profile} />
                            ))
                        ) : (
                            <h4>No profiles found...</h4>
                        )}
                    </div>

                </Fragment>
            )}
        </Fragment>
    );
};

SearchProfile.propTypes = {
    searchProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(
    mapStateToProps
)(SearchProfile);

