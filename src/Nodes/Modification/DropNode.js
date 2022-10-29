import React, { useEffect, useState } from "react";
import { Box, FormControl, Typography, MenuItem, Select, InputLabel, OutlinedInput, Chip } from "@mui/material";
import { useInput, useOutput } from "../nodes";
import { Stack } from "@mui/system";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function TableDisplayNode({ data }) {
    const [selected, setSelected] = useState([]);
    const [columns, setColumns] = useState([]);
    const [input, inputHndl] = useInput("input", ["T"]);
    const [output, setOutput, outputHndl] = useOutput("output", "T", input);

    //console.log(data);

    useEffect(() => {
        if (input) {
            setColumns(Object.keys(input[0]));
            setOutput(input);
        }
    }, [input]);

    useEffect(() => {
        //const thisNode = flowInstance.getNode(data.id);
        if (input && selected) {
            setOutput(processData());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    // Drops the column from the data
    const processData = () => {
        const newObj = structuredClone(input);
        let newData = newObj.map((item) => {
            for (let i = 0; i < selected.length; i++) {
                delete item[selected[i]];
            }
            return item;
        });
        return newData;
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelected(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    return (
        <>
            {inputHndl}
            <Box
                sx={{
                    width: 190,
                    minHeight: 80,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems: "center",
                    alignText: "center",
                }}
            >
                <Stack direction="column" sx={{ mb: 1 }}>
                    <Typography variant="h7">Drop Node</Typography>
                    {columns.length > 0 && (
                        <FormControl sx={{ m: 1 }}>
                            <InputLabel id="select-label">Columns</InputLabel>
                            <Select
                                labelId="select-label"
                                id="select"
                                multiple
                                value={selected}
                                onChange={handleChange}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                className="nowheel nodrag nopan"
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {columns.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Stack>
            </Box>
            {outputHndl}
        </>
    );
}
