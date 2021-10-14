import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function VideosHome() {
  return (
    <div>
      <table className='videoNavBarTable'>
        <tbody>
          <tr>
            <td id='homeButton'>
              <Link to='/videos'>
                <i className='fas fa-home' />{" "}
                <span className='hide-sm'>Home</span>
              </Link>
            </td>
                
            <td id='subsButton'>
              <Link to='/subscriptions'>
                <i className='fa fa-tasks' />{" "}
                <span className='hide-sm'>Subscriptions</span>
              </Link>
            </td>

            <td id='uploadButton'>
              <Link to='/uploadVideo'  >
                <i className='fa fa-video' />{" "}
                <span className='hide-sm'>Upload</span>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VideosHome;
