import React, { useEffect, useState } from "react";
import { Box, FormControl, Typography, MenuItem, Select, InputLabel, OutlinedInput, Chip, Button } from "@mui/material";
import { useInput, useOutput } from "../nodes";
import { Stack } from "@mui/system";
import { io } from "socket.io-client";

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

// outside of your component, initialize the socket variable
let socket;

export default function LinearNode() {
    const [input, inputHndl] = useInput("input", ["object[]"]);
    const [output, setOutput, outputHndl] = useOutput("output", "object[]", input);
    const [categories, setCategories] = useState([]);
    const [x_train, setX] = useState([]);
    const [y_train, setY] = useState("");
    const [trainingCompleted, setTrainingCompleted] = useState(false);
    const [train_loss, setTrainLoss] = useState(0);
    const [val_loss, setValLoss] = useState(0);

    // Websockets!
    useEffect(() => {
        socket = io();

        socket.on("linear", (data) => {
            setTrainLoss(data.train_loss);
            setValLoss(data.val_loss);
            setTrainingCompleted(true);
        });

        return () => {
            socket.disconnect();
        };
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
            socket.emit("linear", x, y, x_labels, y_labels);
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
                            <Typography variant="h7">Training Loss: {train_loss}</Typography>
                            <Typography variant="h7">Validation Loss: {val_loss}</Typography>
                        </Stack>
                    )}
                </Stack>
            </Box>
            {outputHndl}
        </>
    );
}
