import React, { useEffect, useState } from "react";
import { Box, FormControl, Typography, MenuItem, Select, InputLabel, OutlinedInput, Chip, Button } from "@mui/material";
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

export default function OneHot() {
    const [input, inputHndl] = useInput("input", ["object[]"]);
    const [output, setOutput, outputHndl] = useOutput("output", "object[]", input);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);

    //console.log(data);

    useEffect(() => {
        if (input) {
            processData();
        }
    }, [input]);

    // Drops the column from the data
    const processData = () => {
        // Gets the categories to one hot encode
        const temp = categoriesToEncode(input);
        setCategories(temp);
    };

    const encodeData = () => {
        let newObj = structuredClone(input);

        // One hot encodes each category to encode
        for (let i = 0; i < selected.length; i++) {
            const values = getAllUniqueValues(newObj, selected[i]);
            encodeCategory(newObj, selected[i], values);
        }

        setOutput(newObj);
    };

    const categoriesToEncode = (data) => {
        let categories = [];
        const arr = Object.keys(data[0]);
        for (let i = 0; i < arr.length; i++) {
            if (typeof data[0][arr[i]] === "string") {
                categories.push(arr[i]);
            }
        }
        return categories;
    };

    const getAllUniqueValues = (data, k) => {
        let unique = new Set();
        for (let i = 0; i < data.length; i++) {
            if(data[i][k] !== undefined && data[i][k] !== null) {
            unique.add(data[i][k]);
            }
        }
        unique = Array.from(unique);
        return unique;
    };

    const encodeCategory = (data, category, values) => {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < values.length; j++) {
                if (values[j] === undefined) {
                    continue;
                }
                if (data[i][category] === values[j]) {
                    data[i][values[j]] = 1;
                } else {
                    data[i][values[j]] = 0;
                }
            }
            delete data[i][category];
        }
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
                <Stack direction="column">
                    <Typography variant="h7">OneHot Encoding Node</Typography>
                    {categories.length > 0 && (
                        <FormControl sx={{ m: 1 }}>
                            <InputLabel id="select-label">Categories</InputLabel>
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
                                {categories.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button onClick={encodeData}>Encode</Button>
                        </FormControl>
                    )}
                </Stack>
            </Box>
            {outputHndl}
        </>
    );
}
