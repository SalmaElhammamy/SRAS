import React from 'react';
import { Box, Button, TextField } from "@mui/material";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import axios from 'axios';

const ProfileTabPanel = ({ value, index, profile, handleProfileChange, handleSaveProfile }) => {
    
    const sendEmail = () => {
        const { email } = profile; 
        axios.get("http://localhost:5000/", {
            params: {
                email,
                subject: "SRAS", 
                message: "Hellooooo", 
            },
        })
        .then(response => {
            console.log("Email sent successfully");
        })
        .catch(error => {
            console.error("Error sending email:", error);
        });
    };

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={profile.name}
                        onChange={handleProfileChange('name')}
                        sx={{ mb: 4 }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={profile.email}
                        onChange={handleProfileChange('email')}
                        sx={{ mb: 4 }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSaveProfile}
                        sx={{ mr: 2 }} 
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={sendEmail} 
                    >
                       <MailOutlineIcon sx={{ mr: "10px" }} />
                            Send Email
                    </Button>
                </Box>
            )}
        </div>
    );
};

export default ProfileTabPanel;
