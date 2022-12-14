import { FormControl, Typography, MenuItem, Paper, Select, InputLabel } from "@mui/material";
import { useInput, useOutput, useSetting } from "../nodes";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../../backend";

function AnalysisNode() {
    const [input, inputHndl] = useInput("input", ["string"]);
    const [analysisType, setAnalysisType] = useSetting("analysisType", "sentiment");
    const [, setOutput, outputHndl] = useOutput("output", "object", null);

    useEffect(() => {
        if (input !== null) {
            fetch(`${backendUrl}/${analysisType}/${input}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    response.json().then((json) => {
                        console.debug(json);
                        setOutput(json);
                    });
                })
                .catch(console.error);
        }
    }, [input, analysisType, setOutput]);

    const handleChange = (event) => {
        setAnalysisType(event.target.value);
    };

    return (
        <>
            {inputHndl}
            <Paper sx={{ padding: 2 }}>
                <Typography>Natural Language Analysis</Typography>
                <FormControl sx={{ m: 1 }}>
                    <InputLabel id="select-label">Analysis Type</InputLabel>
                    <Select
                        labelId="select-label"
                        id="select"
                        value={analysisType}
                        label="Analysis Type"
                        className="nowheel nodrag nopan"
                        onChange={handleChange}
                    >
                        <MenuItem value={"sentiment"}>Sentiment</MenuItem>
                        <MenuItem value={"language"}>Language Detection</MenuItem>
                        <MenuItem value={"lemma"}>Lemma</MenuItem>
                    </Select>
                </FormControl>
            </Paper>
            {outputHndl}
        </>
    );
}

export default AnalysisNode;
