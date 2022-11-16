import React from "react";

import { Avatar, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signUp } from "./Auth";
import { getErrorMessage } from "./getErrorMessage";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="white"
            align="center"
            {...props}
            sx={{
                mt: 2,
            }}
        >
            {"Copyright © Insite"}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const url = "https://wallpaperaccess.com/full/417640.jpg";

export default function SignUp() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (data.get("password") !== data.get("password2")) {
            alert("Error: Passwords do not match.");
            return;
        }

        signUp(data.get("email"), data.get("password"))
            .then(() => {
                // do something after signing in. For example, router.push("/");
                navigate("/");
            })
            .catch((error) => {
                let { title, description } = getErrorMessage(error);
                // do something with error title and description here
                alert(title + ": " + description);
            });
    };

    return (
        <>
            <Box
                width="100vw"
                height="100vh"
                sx={{
                    backgroundImage: `url(${url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    width="20vw"
                    height="50vh"
                    sx={{
                        marginTop: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0px 0px 10px #000000",
                        padding: "5%",
                        backgroundColor: "rgba(255, 255, 255, 0.475)",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "lightblue" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password2"
                                    label="Confirm Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "lightblue",
                                "&:hover": {
                                    backgroundColor: "white",
                                    color: "blue",
                                },
                            }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Typography
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                    variant="h8"
                                >
                                    Already have an account? Sign in
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright />
            </Box>
        </>
    );
}
