import { useInput, useOutput } from "../nodes";
import { useEffect, useState } from "react";
import {
    Stack,
    Box,
    FormControl,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    OutlinedInput,
    Chip,
    Button,
} from "@mui/material";

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

export default function Normalization() {
    const [input, inputHndl] = useInput("input", ["object[]"]);
    const [output, setOutput, outputHndl] = useOutput("output", "object[]", input);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (input) {
            setCategories(categoriesToNormalize(input));
        }
    }, [input]);

    useEffect(() => {
        if (input) {
            processData();
        }
    }, [selected]);

    const processData = () => {
        //Create a copy of the input
        let newObj = structuredClone(input);

        for (let i = 0; i < selected.length; i++) {
            normalize(newObj, selected[i]);
        }

        setOutput(newObj);
    };

    const normalize = (data, category) => {
        let min = data[0][category];
        let max = data[0][category];

        for (let i = 0; i < data.length; i++) {
            if (data[i][category] < min) {
                min = data[i][category];
            }
            if (data[i][category] > max) {
                max = data[i][category];
            }
        }

        let range = max - min;

        for (let i = 0; i < data.length; i++) {
            data[i][category] = (data[i][category] - min) / range;
        }
    };

    const categoriesToNormalize = (data) => {
        let categories = [];
        const arr = Object.keys(data[0]);
        for (let i = 0; i < arr.length; i++) {
            if (typeof data[0][arr[i]] === "number") {
                categories.push(arr[i]);
            }
        }
        return categories;
    };

    const handleChange = (event) => {
        setSelected(event.target.value);
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
                    <Typography variant="h7">Normalization Node</Typography>
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
                        </FormControl>
                    )}
                </Stack>
            </Box>
            {outputHndl}
        </>
    );
}
