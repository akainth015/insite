import { Handle, Position } from "reactflow";
import { FormControl, Typography, MenuItem, Paper, Select, InputLabel, OutlinedInput, Chip } from "@mui/material";
import { useInput, useOutput } from "../nodes";
import React, { useEffect, useState } from "react";
import { ContentCopy } from "@mui/icons-material";
import { Stack } from "@mui/system";

function AnalysisNode() {
    const [input, inputHndl] = useInput("input", ["string"]);
    const [analysisType, setAnalysisType] = useState("sentiment");
    const [output, setOutput, outputHndl] = useOutput("output", "object", null);

    useEffect(() => {
        if (input !== null) {
            fetch(`/${analysisType}/${input}`, {
                'method':'POST',
                 headers : {
                    'Content-Type':'application/json'
                },
            })
            .then(response => {
                response.json().then(json => {
                    console.debug(json);
                    setOutput(json);
                });
            }).catch(console.error);
        }
    }, [input, analysisType]);

    const handleChange = (event) => {
        setAnalysisType(event.target.value);
    };

    return (
        <>
            {inputHndl}
            <Paper sx={{padding: 2}}>
                <Typography>Natural Language Analysis</Typography>
                <FormControl sx={{ m: 1 }}>
                    <InputLabel id="select-label">Analysis Type</InputLabel>
                    <Select labelId="select-label" id="select" value={analysisType} label="Analysis Type"
                            className="nowheel nodrag nopan" onChange={handleChange}>
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
