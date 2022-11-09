import { Box, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import React from "react";

const url =
    "https://st2.depositphotos.com/1156144/48074/i/600/depositphotos_480748596-stock-photo-banner-panorama-background-health-care.jpg";

export default function Description() {
    return (
        <>
            <Box
                width="100vw"
                maxWidth="100%"
                height="80vh"
                sx={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack direction="column" alignItems="center" justifyContent="center" spacing={8}>
                    <Typography variant="h3">Features:</Typography>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={10}>
                        <Card
                            elevation={3}
                            sx={{
                                padding: 3,
                                maxWidth: 245,
                                height: 250,
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image="https://victorzhou.com/media/nn-series/network.svg"
                                alt="Neural Network"
                                sx={{
                                    mb: 1,
                                }}
                            />
                            <CardContent
                                sx={{
                                    textAlign: "center",
                                }}
                            >
                                <Typography>Abstracting and Visualizing Data for Machine Learning Tasks</Typography>
                            </CardContent>
                        </Card>
                        <Card
                            elevation={3}
                            sx={{
                                padding: 3,
                                maxWidth: 245,
                                height: 250,
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image="https://a.slack-edge.com/80588/img/services/outgoing-webhook_512.png"
                                alt="Webhooks"
                                sx={{
                                    mb: 1,
                                }}
                            />
                            <CardContent
                                sx={{
                                    textAlign: "center",
                                }}
                            >
                                <Typography>Transferring Data Through the use of Webhooks</Typography>
                            </CardContent>
                        </Card>
                        <Card
                            elevation={3}
                            sx={{
                                padding: 3,
                                maxWidth: 245,
                                height: 250,
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image="https://cdn.technologyadvice.com/wp-content/uploads/2022/06/Data-Cleaning-700x408.jpeg"
                                alt="Data Cleaning"
                                sx={{
                                    mb: 1,
                                }}
                            />
                            <CardContent
                                sx={{
                                    textAlign: "center",
                                }}
                            >
                                <Typography>Cleaning and Preparing Data</Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}
