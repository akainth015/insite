import React, { useContext, useEffect, useState } from "react";
import { Box, FormControl, Typography, MenuItem, Select, InputLabel, OutlinedInput, Chip, Button } from "@mui/material";
import { useInput, useOutput, NodeIdContext } from "../nodes";
import { Stack } from "@mui/system";
import { NodeIdContext } from "../nodes";
import socket from "../SocketProvider";

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

export default function LinearNode() {
    const [input, inputHndl] = useInput("input", ["object[]"]);
    const [output, setOutput, outputHndl] = useOutput("output", "object[]", input);
    const [categories, setCategories] = useState([]);
    const [x_train, setX] = useState([]);
    const [y_train, setY] = useState("");
    const [trainingCompleted, setTrainingCompleted] = useState(false);
    const [result, setResult] = useState(null);

    const nodeId = useContext(NodeIdContext);

    // Websockets!
    useEffect(() => {
        socket.on("linear", (data) => {
            console.log("linear response", data);
            if (data.nodeId === nodeId) {
                setResult(data);
                setTrainingCompleted(true);
            }
        });
    }, []);

    useEffect(() => {
        if (input) {
            processData();
        }
    }, [input]);

    const processData = () => {
        // Gets the categories to one hot encode
        const temp = categoriesToSelect(input);
        setCategories(temp);
    };

    const categoriesToSelect = (data) => {
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
        const {
            target: { value },
        } = event;
        setX(value);
    };

    const handleSelect = (event) => {
        setY(event.target.value);
    };

    const handleTrain = (e) => {
        e.preventDefault();
        if (input) {
            setTrainingCompleted(false);
            let x = [];
            let y = [];
            let x_labels = x_train;
            let y_labels = y_train;
            for (let i = 0; i < input.length; i++) {
                let temp = [];
                for (let j = 0; j < x_train.length; j++) {
                    temp.push(input[i][x_train[j]]);
                }
                x.push(temp);
                y.push(input[i][y_train]);
            }
            socket.emit("linear", nodeId, x, y, x_labels, y_labels);
        }
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
                    <Typography variant="h7">Linear Regression Node</Typography>
                    {categories.length > 0 && (
                        <Stack direction="column">
                            <FormControl sx={{ m: 1 }}>
                                <InputLabel id="select-label">Features</InputLabel>
                                <Select
                                    labelId="select-label"
                                    id="select"
                                    multiple
                                    value={x_train}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                    className="nowheel nodrag nopan"
                                    renderValue={(x_train) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {x_train.map((value) => (
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
                            <FormControl>
                                <InputLabel id="category">Label</InputLabel>
                                <Select
                                    labelId="category"
                                    id="category"
                                    label="Category"
                                    value={y_train}
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
                            <Button onClick={handleTrain}>Train!</Button>
                        </Stack>
                    )}
                    {trainingCompleted && (
                        <Stack direction="column">
                            <Typography variant="h7">Training Completed!</Typography>
                            {
                                // Output each element in the result object
                                Object.keys(result).map((key) => {
                                    return (
                                        <Typography variant="h7" key={key}>
                                            {key}: {result[key]}
                                        </Typography>
                                    );
                                })
                            }
                        </Stack>
                    )}
                </Stack>
            </Box>
            {outputHndl}
        </>
    );
}
