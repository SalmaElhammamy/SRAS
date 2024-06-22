import React from "react";
import "./Cards.css";
import Card from "../Card/Card";

const Cards = ({ cards, isSetting, setReloadFlag }) => {
  return (
    <div className="CardContainer">
      {cards.map((card, index) => (
        <Card
          key={index}
          cameraName={card.cameraName}
          videoURL={card.videoURL}
          imagePreview={card.imagePreview}
          isSetting={isSetting}
          polygons={card.polygons}
          _id={card._id}
        />
      ))}
    </div>
  );
};

export default Cards;
