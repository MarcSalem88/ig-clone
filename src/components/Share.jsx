import { useContext, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MdPermMedia } from "react-icons/md";
import Intercept from "../Tools/refrech";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import { NotificationManager } from "react-notifications";

function Share(props) {
  const navigate = useNavigate();
  const desc = useRef();
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const axiosJWT = axios.create();
  Intercept(axiosJWT);

  const userDataString = localStorage.getItem("user"); // Replace with the actual user ID
  const userData = JSON.parse(userDataString);
  const userId = userData.data._id;

  console.log(userId);
  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      if (!file) {
        throw new Error("Photo is required");
      }
  
      if (e.currentTarget) {
        e.currentTarget.disabled = true;
      } else {
        throw new Error("Button element is not available");
      }
  
      const formDataInfo = {
        description: desc.current.value,
        imgurl: null,
      };
  
      const formDataFile = new FormData();
      formDataFile.append("file", file); // Append the actual file, not a string
  
      const img = await axios.post(
        "http://localhost:8000/api/upload",
        formDataFile,
      
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-id": user.data._id
          },
        }
      );
  
      formDataInfo.imgurl = img.data.imageUrl;
  
      await axiosJWT.post("http://localhost:8000/api/article", formDataInfo );
  
      NotificationManager.success(
        "Success",
        "Post has been created",
        3000
      );
  
      props.hideAddPostHandler();
      navigate(`/home`);
    } catch (error) {
      NotificationManager.warning(
        "Warning",
        error.message || "Something went wrong",
        3000
      );
    } finally {
      if (e.currentTarget) {
        e.currentTarget.disabled = false;
      }
    }
  };
  
  return (
    <ShareContainer>
      <div className="shareWrapper">
        <div className="shareTop">
          <input
            placeholder={"What's in your mind ?"}
            className="shareInput"
            ref={desc}
            required
          />
        </div>
        <hr className="shareHr" />
        <form className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <MdPermMedia className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <button className="shareButton" onClick={submitHandler} type="submit">
            Share
          </button>
        </form>
      </div>
    </ShareContainer>
  );
}

const ShareContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  .shareWrapper {
    padding: 10px;
    /* border: solid #5b6dcd 1px; */
    margin: 10px;
  }
  .shareTop {
    display: flex;
    align-items: center;
  }
  .shareInput {
    border: none;
    width: 100%;
  }
  .shareInput:focus {
    outline: none;
  }
  .shareHr {
    margin: 20px;
  }
  .shareBottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .shareOptions {
    display: flex;
    margin-left: 20px;
  }
  .shareOption {
    display: flex;
    align-items: center;
    margin-right: 15px;
    cursor: pointer;
  }
  .shareIcon {
    font-size: 18px;
    margin-right: 3px;
  }
  .shareOptionText {
    font-size: 14px;
    font-weight: 500;
  }
  .shareButton {
    border: none;
    padding: 7px;
    border-radius: 5px;
    background-color: #1872f2;
    font-weight: 500;
    margin-right: 20px;
    cursor: pointer;
    color: white;
  }
`;

export default Share;
