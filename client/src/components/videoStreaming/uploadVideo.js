import React, { useState } from "react";
import { Typography, Button, Form, Input} from "antd";
import Dropzone from "react-dropzone";
import api from '../../utils/api';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import VideosNavBar from './VideoNavBar'

import { useHistory  } from "react-router-dom";



const { Title } = Typography;
const { TextArea } = Input;

const Private = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const Catogory = [
  { value: 0, label: "Education" },
  { value: 0, label: "Motivation" },
  { value: 0, label: "Achievemnts" },
  { value: 0, label: "Experience" },
  { value: 0, label: "Technology" },
];

function UploadVideo({auth}) {

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [Categories, setCategories] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState("");

  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value);
  };

  const handleChangeDecsription = (event) => {
    setDescription(event.currentTarget.value);
  };
  

  const handleChangeOne = (event) => {
    setPrivacy(event.currentTarget.value);
  };

  const handleChangeTwo = (event) => {
    setCategories(event.currentTarget.value);
  };

  //For Redirecting
  let history = useHistory();

  const onSubmit = (event) => {

    event.preventDefault();
    if (
      title === "" ||
      Description === "" ||
      Categories === "" ||
      FilePath === "" ||
      Duration === "" ||
      Thumbnail === ""
    ) {
      return alert("Please first fill all the fields");
    }

    const variables = {
      user: auth.user._id,
      title: title,
      description: Description,
      privacy: privacy,
      filePath: FilePath,
      category: Categories,
      duration: Duration,
      thumbnail: Thumbnail,
    };

    api.post("/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        alert("video Uploaded Successfully");
        history.push("/Videos");
      } else {
        alert("Failed to upload video");
      }
    });
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    console.log(files);
    formData.append("file", files[0]);

    api.post("/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };
        setFilePath(response.data.filePath);

        //gerenate thumbnail with this filepath !

        api.post("/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnail(response.data.thumbsFilePath);
          } else {
            alert("Failed to make the thumbnails");
          }
        });
      } else {
        alert("failed to save the video in server");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <VideosNavBar/>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/plus-512.png"
                alt="Img not found"
                style = {{
                  height: "100px",
                  width: "100px"
                }}
                />
              </div>
            )}
          </Dropzone>

          {Thumbnail !== "" && (
            <div>
              <img src={`http://localhost:5000/${Thumbnail}`} alt="not found" />
            </div>
          )}
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input onChange={handleChangeTitle} value={title} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={handleChangeDecsription} value={Description} />
        <br />
        <br />

        <select onChange={handleChangeOne}>
          {Private.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <select onChange={handleChangeTwo}>
          {Catogory.map((item, index) => (
            <option key={index} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}


UploadVideo.prototypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect (mapStateToProps)(UploadVideo);
