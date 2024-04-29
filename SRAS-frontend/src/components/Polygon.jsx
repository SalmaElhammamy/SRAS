import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPolygonDrawer from "react-polygon-drawer";
import {
  Grid,
  Button,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import cameraImg from "../Img/camera.jpg";

const CustomButton = ({ text, onClick, sx }) => {
  return (
    <Button
      variant="contained"
      size="large"
      sx={{
        height: "3rem",
        ...sx,
      }}
      onClick={onClick}
    >
      <Typography variant="h4">{text}</Typography>
    </Button>
  );
};

export default function PolygonDrawer(props) {
  const height = props.height;
  const width = props.width;
  const existingCoordinates = props.existingCoordinates;
  const image = props.image;
  const onClick = props.onClick;

  const navigate = useNavigate();

  const [mouseClicked, setMouseClicked] = useState(
    !(existingCoordinates && existingCoordinates.length > 0)
  );

  const [globalDisableButton, setGlobalDisableButton] = useState(true);

  const [polygons, setPolygons] = useState([]);

  useEffect(() => {
    setPolygons([
      {
        id: 1,
        isActive: false,
        coordinates: [
          {
            x: 155,
            y: 185,
          },
          {
            x: 617,
            y: 177,
          },
          {
            x: 600,
            y: 421,
          },
          {
            x: 182,
            y: 432,
          },
          {
            x: 155,
            y: 185,
          },
        ],
      },
      {
        id: 2,
        isActive: false,
        coordinates: [
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
        ],
      },
    ]);
  }, []);

  const SetActivePolygon = (id) => {
    setMouseClicked(false);
    if (id === -1) {
      setGlobalDisableButton(true);
      setPolygons(
        polygons.map((polygon) => {
          polygon.isActive = true;
          return polygon;
        })
      );
    } else {
      setGlobalDisableButton(false);
      setPolygons(
        polygons.map((polygon) => {
          if (polygon.id === id) {
            polygon.isActive = true;
          } else {
            polygon.isActive = false;
          }
          return polygon;
        })
      );
    }
  };

  const AddNewPolygon = () => {
    setPolygons([
      ...polygons,
      {
        id: Date.now(),
        isActive: false,
        coordinates: [],
      },
    ]);
  };

  const ChangePolygonCoordinates = (id, coordinates) => {
    setPolygons(
      polygons.map((polygon) => {
        if (polygon.id === id) {
          polygon.coordinates = coordinates;
        }
        return polygon;
      })
    );
  };

  const DeletePolygon = (id) => {
    if (polygons.length === 1) {
      return;
    }
    setPolygons(polygons.filter((polygon) => polygon.id !== id));
  };

  const SavePolygons = () => {
    console.log(polygons);
  };

  if (polygons.length === 0) return null;

  return (
    <Grid
      container
      spacing={4}
      sx={{
        padding: "2rem",
        paddingLeft: "12% !important",
        marginTop: "2.5rem !important",
        zIndex: 100,
      }}
    >
      <Grid
        item
        xs={9}
        sx={{
          padding: "0 !important",
        }}
        onMouseDown={() => setMouseClicked(true)}
      >
        <Grid
          sx={{
            width: width,
            height: height,
            padding: "0 !important",
            pointerEvents: globalDisableButton
              ? "none"
              : mouseClicked
              ? "auto"
              : "none",

            position: "relative",
            backgroundImage: `url(${cameraImg})`,
          }}
        >
          {polygons.map(
            (polygon) =>
              polygon.isActive && (
                <ReactPolygonDrawer
                  key={polygon.id}
                  width={width}
                  height={height}
                  existingCoordinates={polygon.coordinates}
                  onFinish={(coordinates) => {
                    ChangePolygonCoordinates(polygon.id, coordinates);
                  }}
                  lineWidth={1}
                />
              )
          )}
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Stack direction="column" spacing={4}>
          {polygons.map((polygon, index) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <CustomButton
                text={`Area #${index + 1}`}
                key={polygon.id}
                onClick={() => {
                  SetActivePolygon(polygon.id);
                }}
                sx={{
                  width: "95%",
                }}
              />
              <Tooltip title="Delete">
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => {
                    DeletePolygon(polygon.id);
                  }}
                >
                  <DeleteIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}

          <CustomButton
            text="Add new Area"
            onClick={() => {
              AddNewPolygon();
            }}
          />
          <CustomButton
            text={`All Areas`}
            onClick={() => {
              SetActivePolygon(-1);
            }}
          />
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <CustomButton text="Save" onClick={SavePolygons} />
            <CustomButton
              text="Cancel"
              onClick={() => {
                onClick(false);
              }}
            />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
