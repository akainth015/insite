import { useOutput } from "../nodes";
import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import FileInput from "../../Components/FileInput";

const FILE_INDEX = 0;

export default function JsonNode() {
    const [, setOutput, outputHandle] = useOutput("JSON", "object", null);
    const [jsonFile, setJsonFile] = useState(null);

    const parseAndOutput = (files) => {
        const file = files[FILE_INDEX] || null;
        setJsonFile(file);
    };

    useEffect(() => {
        if (jsonFile !== null) {
            const fileReader = new FileReader();
            fileReader.addEventListener("load", () => {
                const data = JSON.parse(fileReader.result);
                setOutput(data);
            });
            fileReader.readAsText(jsonFile);
        }
    }, [jsonFile, setOutput]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography align="center" mb={1}>
                    JSON File Input
                </Typography>
                <FileInput accept="text/json,application/json,.json" onChange={parseAndOutput} />
            </Paper>
            {outputHandle}
        </>
    );
}
