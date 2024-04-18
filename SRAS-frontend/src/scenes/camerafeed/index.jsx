import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import "./camerafeed.css";
import Cards from "../../components/Cards/Cards"; 
//import reportImg from '../../Img/report.jpg';

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const cards = [
    { title: "Camera One", img: "/assets/img1.jpg" },
    { title: "Camera Two", img: "/assets/img2.jpg" },
    { title: "Camera Three", img: "/assets/img3.jpg" },
    { title: "Camera Four", img: "/assets/img4.jpg" },
    { title: "Camera Five", img: "/assets/img5.jpg" },
    { title: "Camera Six", img: "/assets/img6.jpg" },
  ];

  return (
    <Box>
      <Header />
      <Cards cards={cards} />
    </Box>
  );
};

export default FAQ;
