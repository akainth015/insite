import { Paper, Stack, Typography, Grid, TextField } from "@mui/material";
import { inputNodeTypes, modificationNodeTypes, outputNodeTypes, machineLearningNodes } from "../Nodes/nodes";
import React, { useState, useRef } from "react";
import Node from "./Node";

export default function Sidebar() {
    const [search, setSearch] = useState("");
    const filterNodes = useRef(null);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClick = () => {
        filterNodes.current.focus();
    }

    const renderNodeTypes = (nodeTypes) => {
        return Object.keys(nodeTypes).filter(key => key.toLowerCase().includes(search.toLowerCase())).map(nodeType => (
            <Grid item xs={6} key={nodeType}>
                <Node nodeType={nodeType} ></Node>
            </Grid>
        ))
    }

    return (
        <Stack direction="column" sx = {{
            height: "100vh",
        }}>
            <Paper elevation={1} sx={{
                padding: 2,
                background: "white",
                position: "sticky",
            }}>
                <TextField fullWidth label="Filter Nodes" onChange={handleSearch} inputRef={filterNodes}  />
            </Paper>
            <Stack direction="column" alignContent="flex-start" onClick={handleClick} sx={{
                padding: 3,
                width: "20vw",
                overflowY: "scroll",
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">Input Nodes</Typography>
                    </Grid>
                    {renderNodeTypes(inputNodeTypes)}
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">Modification Nodes</Typography>
                    </Grid>
                    {renderNodeTypes(modificationNodeTypes)}
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">Output Nodes</Typography>
                    </Grid>
                    {renderNodeTypes(outputNodeTypes)}
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">Machine Learning Nodes</Typography>
                    </Grid>
                    {renderNodeTypes(machineLearningNodes)}
                </Grid>
            </Stack>
        </Stack>
    );
}