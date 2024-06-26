import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import BarChart from "./BarChart";


const Comp = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box>
            
            <Box>
                <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{ padding: "30px 30px 0 30px" }}
                >
                    Today
                    hi<BarChart/>hi
                </Typography>
                
            </Box>
            <Box>
                <BarChart  />
            </Box>
        </Box>
    );
};

export default Comp;
