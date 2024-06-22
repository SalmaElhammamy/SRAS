import React, { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { saveCameraCoordinates } from "../services/settingsServices";

const CustomButton = ({ text, onClick, sx, color }) => {
  return (
    <Button
      variant="contained"
      size="large"
      sx={{
        height: "3rem",
        ...sx,
      }}
      onClick={onClick}
      color={color}
    >
      <Typography variant="h4">{text}</Typography>
    </Button>
  );
};

export default function PolygonDrawer(props) {
  const height = props.height;
  const width = props.width;
  const image = props.image;
  const onClick = props.onClick;
  const incomingPolygons = props.polygons;
  const setReloadFlag = props.setReloadFlag;
  const _id = props._id;

  const [mouseClicked, setMouseClicked] = useState(false);

  const [globalDisableButton, setGlobalDisableButton] = useState(true);

  const [polygons, setPolygons] = useState([]);
  const [isAllActive, setIsAllActive] = useState(true);

  useEffect(() => {
    setPolygons(incomingPolygons);
    // eslint-disable-next-line
  }, []);

  const DisableAllPolygons = () => {
    setPolygons(
      polygons.map((polygon) => {
        polygon.isActive = false;
        return polygon;
      })
    );
  };
  const SetActivePolygon = (id) => {
    setMouseClicked(false);
    if (id === -1) {
      setGlobalDisableButton(true);
      setIsAllActive(true);
      DisableAllPolygons();
    } else {
      setIsAllActive(false);
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
    if (polygons.length === 3) {
      toast.warning("You can only add 3 areas");
      return;
    }
    DisableAllPolygons();
    setIsAllActive(false);
    setPolygons([
      ...polygons,
      {
        id: Date.now(),
        isActive: true,
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
      toast.warning("You must have at least 1 area");
      return;
    }
    SetActivePolygon(-1);
    setPolygons(polygons.filter((polygon) => polygon.id !== id));
  };

  const SavePolygons = async () => {
    try {
      await saveCameraCoordinates(polygons, _id);
      toast.success("Areas saved successfully");
      setReloadFlag((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to save areas");
    }
  };

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
            backgroundImage: `url(${image})`,
            borderRadius: "10px",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 1)",
          }}
        >
          {polygons.map(
            (polygon) =>
              (polygon.isActive || isAllActive) && (
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
                color={polygon.isActive ? "secondary" : "primary"}
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
            color={isAllActive ? "secondary" : "primary"}
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
