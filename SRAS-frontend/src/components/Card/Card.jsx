import React, { useEffect, useState } from "react";
import "./Card.css";
import { FaTimes } from "react-icons/fa";
import PolygonDrawer from "../Polygon";

const Card = ({ cameraName, videoURL, imagePreview, isSetting }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const width = 1000;
  const height = 600;

  return (
    <>
      {!expanded ? (
        <div
          className={`Card ${expanded ? "ExpandedCard" : ""}`}
          onClick={toggleExpanded}
        >
          <img src={imagePreview} alt={cameraName} className="expanded-img" />
          <div className="title">{cameraName}</div>
        </div>
      ) : (
        <div className="ExpandedCard">
          <div className="close-icon">
            <FaTimes
              onClick={() => {
                toggleExpanded();
                window.location.reload();
              }}
            />
          </div>

          {isSetting ? (
            <PolygonDrawer
              height={height}
              width={width}
              onClick={setExpanded}
            />
          ) : (
            <img
              src={videoURL}
              alt={cameraName}
              className="expanded-img"
              style={{
                width: "1000px",
                height: "600px",
              }}
            />
          )}
          <div
            style={{
              width: "100%",
            }}
          >
            <div className="title">{cameraName}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
