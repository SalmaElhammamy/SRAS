import React, { useState } from "react";
import ReactPolygonDrawer from "react-polygon-drawer";

export default function PolygonDrawer(props) {
  const height = props.height;
  const width = props.width;
  const existingCoordinates = props.existingCoordinates;
  const image = props.image;

  const [mouseClicked, setMouseClicked] = useState(
    !(existingCoordinates && existingCoordinates.length > 0)
  );

  const [coordinates, setCoordinates] = useState(existingCoordinates);
  console.log("coordinates", coordinates);
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        // backgroundImage: `url(${image})`,
      }}
      onMouseDown={() => setMouseClicked(true)}
    >
      <div
        style={{
          width,
          height,
          border: "1px solid red",
          pointerEvents: mouseClicked ? "auto" : "none",
        }}
      >
        <ReactPolygonDrawer
          width={width}
          height={height}
          existingCoordinates={coordinates}
          onFinish={(coordinates) => {
            setCoordinates(coordinates);
          }}
          lineWidth={1}
        />
      </div>
    </div>
  );
}
