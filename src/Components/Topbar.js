import { Box, Typography, Stack, IconButton, Menu, MenuItem, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { logOut, useAuthUser } from "../Firebase/Auth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const user = useAuthUser();
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Box
                width="100vw"
                height="15vh"
                maxWidth="100%"
                sx={{
                    backgroundColor: "lightblue",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack direction="column" alignItems="center">
                    <Typography variant="h3">Insite</Typography>
                    <Typography variant="h6">A visual data processing tool</Typography>
                </Stack>
                <Box
                    width="10vw"
                    height="15vh"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        right: 0,
                        top: 0,
                    }}
                >
                    {user === null && (
                        <>
                            <IconButton title="Menu" onClick={handleClick}>
                                <MenuIcon />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                >
                                    Login
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/signup");
                                    }}
                                >
                                    Sign Up
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                    {user !== null && <Button onClick={logOut}>Log Out</Button>}
                </Box>
            </Box>
        </>
    );
}
