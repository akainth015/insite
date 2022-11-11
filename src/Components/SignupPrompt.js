import { Box, Stack, Typography, Button } from "@mui/material";
import React from "react";

const url =
    "https://www.singlestore.com/images/cms/blog-posts/img_blog_post_hero_refactoring-singlestores-visual-explain-to-use-react-flow.png";

export default function SignupPrompt() {
    return (
        <>
            <Box
                height="50vh"
                maxWidth="100%"
                width="100vw"
                sx={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    width="100%"
                    height="100%"
                    sx={{
                        backdropFilter: "blur(10px)",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Stack direction="column" alignItems="center" justifyContent="center" spacing={5}>
                        <Typography variant="h4" color="white">
                            Sign up to save your work!
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                width: "10vw",
                                backgroundColor: "white",
                                color: "black",

                                "&:hover": {
                                    backgroundColor: "black",
                                    color: "white",
                                },
                            }}
                        >
                            Sign up
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </>
    );
}
