import { Box, Typography, Stack, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

export default function Topbar() {
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
                    <IconButton title="Menu">
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
}
