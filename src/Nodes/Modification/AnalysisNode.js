import { Handle, Position } from "reactflow";
import { Box, FormControl, Typography, MenuItem, Select, InputLabel, OutlinedInput, Chip } from "@mui/material";
import { useInput, useOutput } from "../nodes";
import React, { useEffect, useState } from "react";
import { ContentCopy } from "@mui/icons-material";
import { Stack } from "@mui/system";

function AnalysisNode() {
    const [selected, setSelected] = useState([]);
    const [input, inputHndl] = useInput("input", "");
    const [analysisType, setAnalysisType] = useState("", "");
    const [analysisDetails, setAnalysisDetails] = useState("", "");
    const [output, setOutput, outputHndl] = useOutput("output", "T", input);

    useEffect(() => {
        if (input) {
            setOutput(input);
        }
    }, [input]);

    useEffect(() => {
        if (input && analysisType) {
            setOutput(analysisDetails);
        }
    }, [analysisDetails]);

    const fetchAnanlysis = () => {
        fetch(`/${analysisType}/${input.toString()}` ,{
                'method':'POST',
                 headers : {
                'Content-Type':'application/json'
          },
        })
        .then(response => {
            response.json().then(json => {
                console.log(JSON.stringify(json, null, 2));
              setAnalysisDetails(JSON.stringify(json, null, 2));
            });
      }).catch(error => console.log(error))
    };

    const handleChange = (event) => {
    setAnalysisType(event.target.value);
    fetchAnanlysis();
        setOutput(analysisDetails);
    console.log(analysisType);
  };

    return (
        <>
            {inputHndl}
            <Box sx={{ width: 190, minHeight: 80, backgroundColor: "white", padding: 2, borderRadius: 2, alignItems: "center", alignText: "center", }}>
            	<Stack direction="column" sx={{ mb: 1 }}>
            		<Typography variant="h7">Ananlysis for</Typography> {
            		<FormControl sx={{ m: 1 }}>
            			<InputLabel id="select-label">{input}</InputLabel>
            			<Select labelId="select-label" id="select" value={analysisType} label="Analysis Type"
                        className="nowheel nodrag nopan" onChange={handleChange}>
            				<MenuItem value={"sentiment"}>Sentiment</MenuItem>
            				<MenuItem value={"language"}>Language Detection</MenuItem>
            				<MenuItem value={"lemma"}>Lemma</MenuItem>
            			</Select>
            		</FormControl> }
                    </Stack>
            </Box>
            {outputHndl}
        </>
    );
}

export default AnalysisNode;
