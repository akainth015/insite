import { useOutput } from "../nodes";
import React from "react";
import { Box, Typography } from "@mui/material";

export default function JsonNode() {
    const [, setOutput, outputHandle] = useOutput("Output", "object", {});
    const fileReader = new FileReader();
    const onFileChange = (e) => {
        const file = e.target.files[0];
        fileReader.onload = function () {
            let result = JSON.parse(fileReader.result);
            setOutput(result);
        };
        fileReader.readAsText(file);
    };

    return (
        <>
            <Box
                sx={{
                    width: 190,
                    height: 80,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems: "center",
                    alignText: "center",
                }}
            >
                <Typography variant="h7">JSON Node</Typography>
                <form>
                    <input type="file" id="csvFile" name="csvFile" accept=".json" onChange={onFileChange} />
                </form>
            </Box>
            {outputHandle}
        </>
    );
}
