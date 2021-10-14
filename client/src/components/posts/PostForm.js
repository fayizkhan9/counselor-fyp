import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {

  const [formData, setFormData] = useState({ text: '', file: null })
  const { text } = formData;
  var { file } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    formData.file = e.target.files[0];
    file = formData.file;
  }

  const submitForm = async (e) => {
    e.preventDefault();
    e.preventDefault();
    addPost({ text, file });
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Make A Post</h3>
      </div>
      <form
        className='form my-1'
        encType="multipart/form-data"
        method="POST"
        onSubmit={submitForm}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Post Text Here | You can attach an Image/Video'
          value={text}
          onChange={onChange}
          required
        />

        <table>
          <th>
            <div className="image-upload">
              <label htmlFor="file-input">
                <img src="https://cdn2.iconfinder.com/data/icons/social-productivity-line-art-2/128/photo-512.png" alt="Img Not Found"/>
              </label>
              <input id="file-input" type="file" onChange={handleFile} name='post-file' />
            </div>
          </th>

          <th>
            <div className="image-upload">
              <label htmlFor="file-input">
                <img src="https://cdn4.iconfinder.com/data/icons/48-bubbles/48/23.Videos-512.png" alt="Img Not Found"/>
              </label>
              <input id="file-input" type="file" onChange={handleFile} name='post-file' />
            </div>
          </th>
        </table>



        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div >
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(
  null,
  { addPost }
)(PostForm);
