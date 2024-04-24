import React, { useState } from "react";
import "./Card.css";
import { FaTimes } from "react-icons/fa";
import PolygonDrawer from "../Polygon";

const images = [
  "/assets/img1.jpg",
  "/assets/img2.jpg",
  "/assets/img3.jpg",
  "/assets/img4.jpg",
  "/assets/img5.jpg",
  "/assets/img6.jpg",
];

const Card = ({ title, imageIndex }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const width = 1000;
  const height = 600;
  const existingCoordinates = [
    {
      x: 328,
      y: 71,
    },
    {
      x: 58,
      y: 63,
    },
    {
      x: 61,
      y: 509,
    },
    {
      x: 669,
      y: 78,
    },
    {
      x: 669,
      y: 78,
    },
    {
      x: 328,
      y: 71,
    },
  ];

  return (
    <>
      {!expanded ? (
        <div
          className={`Card ${expanded ? "ExpandedCard" : ""}`}
          onClick={toggleExpanded}
        >
          <img src={images[imageIndex]} alt={title} className="expanded-img" />
          <div className="title">{title}</div>
        </div>
      ) : (
        <div className="ExpandedCard">
          <div className="close-icon">
            <FaTimes
              onClick={() => {
                console.log("hi");
                toggleExpanded();
              }}
            />
          </div>

          <PolygonDrawer
            height={height}
            width={width}
            existingCoordinates={existingCoordinates}
          />
          <div
            style={{
              width: "100%",
            }}
          >
            <div className="title">{title}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
