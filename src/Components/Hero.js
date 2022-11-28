import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../Firebase/Auth";

const url =
    "https://images.unsplash.com/photo-1634117622592-114e3024ff27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80";

export default function Hero() {
    const nav = useNavigate();
    const auth = useAuthUser();
    return (
        <>
            <Box
                width="100vw"
                maxWidth="100%"
                height="85vh"
                sx={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack spacing={4} direction="column" alignItems="center">
                    <Typography variant="h2">Make your data come to life!</Typography>
                    <Typography variant="h5">Live or static data</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => nav("/canvas")}
                        sx={{
                            backgroundColor: "white",
                            color: "black",

                            "&:hover": {
                                backgroundColor: "black",
                                color: "white",
                            },
                        }}
                    >
                        {auth ? "Create a new flow" : "Try it out!"}
                    </Button>
                </Stack>
            </Box>
        </>
    );
}
