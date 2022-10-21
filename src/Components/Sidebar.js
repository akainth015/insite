import { Stack, Box, InputLabel, Select, FormControl, MenuItem } from "@mui/material";
import Panel from "./Panel";
import { inputNodeTypes, modificationNodeTypes, outputNodeTypes } from "../Nodes/nodes";
import React, { useState } from "react";

export default function Sidebar() {
    const [page, setPage] = useState("input");

    const onChange = (event) => {
        setPage(event.target.value);
    };
    return (
        <aside>
            <Stack direction="column" spacing={2} alignItems="center" justifyContent="flex-start">
                <div className="description">You can drag the nodes between the pane.</div>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="label">Node</InputLabel>
                        <Select labelId="label" id="select" value={page} label="Page" onChange={onChange}>
                            <MenuItem value={"input"}>Input Nodes</MenuItem>
                            <MenuItem value={"modify"}>Modification Nodes</MenuItem>
                            <MenuItem value={"output"}>Ouput Nodes</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {page === "input" ? <Panel nodeTypes={inputNodeTypes} /> : null}
                {page === "modify" ? <Panel nodeTypes={modificationNodeTypes} /> : null}
                {page === "output" ? <Panel nodeTypes={outputNodeTypes} /> : null}
            </Stack>
        </aside>
    );
}
