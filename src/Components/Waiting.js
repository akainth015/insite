import { CircularProgress, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

export default function Waiting() {
    return (
        <>
            <Box
                component="section"
                sx={{
                    height: "100px",
                    width: "100px",
                    alignItems: "center",
                    alignText: "center",
                    justifyContent: "center",
                    mt: 2,
                    mb: 2,
                }}
            >
                <Stack direction="column" alignItems="center" justifyContent="center" alignText="center">
                    <CircularProgress sx={{ color: "black", mt: 2   , mb: 2 }} />
                    <Typography variant="h7">Waiting for</Typography>
                    <Typography variant="h7">input data...</Typography>
                </Stack>
            </Box>
        </>
    );
}
