import { useInput, useOutput } from "../nodes";
import { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

export default function FilterNode() {
    const [input, inputHandl] = useInput("input", "object[]");
    const [output, setOutput, outputHandl] = useOutput("output", "object[]", input);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);
    const [greater, setGreater] = useState(false);
    const [number, setNumber] = useState(0);

    useEffect(() => {
        if (input) {
            setOutput(input);
            getCategories();
        }
    }, [input, setOutput]);

    useEffect(() => {
        if (input && selected) {
            processData();
        }
    }, [input, selected, greater, number]);

    const processData = () => {
        let newObj = [];

        for (let i = 0; i < input.length; i++) {
            let row = input[i];
            if (greater) {
                if (row[selected] > number) {
                    newObj.push(row);
                }
            } else {
                if (row[selected] < number) {
                    newObj.push(row);
                }
            }
        }
        setOutput(newObj);
    };

    const getCategories = () => {
        let cat = [];
        const keys = Object.keys(input[0]);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = input[0][key];
            if (typeof value === "number") {
                cat.push(key);
            }
        }

        setCategories(cat);
    };

    const handleSelect = (event) => {
        setSelected(event.target.value);
    };

    const handleGreater = (event) => {
        setGreater(event.target.value);
    };

    const handleNumber = (event) => {
        setNumber(event.target.value);
    };

    return (
        <>
            <Box
                sx={{
                    minWidth: 190,
                    minHeight: 80,
                    backgroundColor: "white",
                    borderRadius: 2,
                    padding: 2,
                    alignItems: "center",
                    alignText: "center",
                }}
            >
                {inputHandl}
                <Stack direction="column">
                    <Typography variant="h7">Filter Node</Typography>
                    {categories.length > 0 && (
                        <Stack direction="column" spacing={2}>
                            <FormControl>
                                <InputLabel id="category">Category</InputLabel>
                                <Select
                                    labelId="category"
                                    id="category"
                                    label="Category"
                                    value={selected}
                                    onChange={handleSelect}
                                    className="nowheel nodrag nopan"
                                >
                                    {categories.map((category) => (
                                        <MenuItem value={category} key={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <InputLabel id="greater">Operation</InputLabel>
                                <Select
                                    labelId="greater"
                                    id="greater"
                                    label="Operation"
                                    value={greater}
                                    onChange={handleGreater}
                                    className="nowheel nodrag nopan"
                                >
                                    <MenuItem value={true}>Greater Than</MenuItem>
                                    <MenuItem value={false}>Less Than</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                id="outlined-number"
                                label="Number"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={number}
                                onChange={handleNumber}
                            />
                        </Stack>
                    )}
                </Stack>
                {outputHandl}
            </Box>
        </>
    );
}
