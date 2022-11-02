import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useInput, useOutput } from "../nodes";
import { Stack } from "@mui/system";

export default function ConvertFloat({ data }) {
    const [input, inputHndl] = useInput("input", ["object[]"]);
    const [output, setOutput, outputHndl] = useOutput("output", "object[]", input);

    //console.log(data);

    useEffect(() => {
        if (input) {
            const newData = processData();
            setOutput(newData);
        }
    }, [input]);

    // Drops the column from the data
    const processData = () => {
        //Create a copy of the input
        let newObj = structuredClone(input);

        // Converts all values to ints when possible
        let newData = newObj.map((item) => {
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const element = item[key];
                    if (element != null && element !== undefined) {
                        if (element === "") {
                            item[key] = null;
                        } else if (isNaN(parseFloat(element))) {
                            item[key] = element;
                        } else {
                            item[key] = parseFloat(element);
                        }
                    }
                }
            }
            return item;
        });

        return newData;
    };

    return (
        <>
            {inputHndl}
            <Box
                sx={{
                    width: 190,
                    height: 80,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems: "center",
                    alignText: "center",
                }}
            >
                <Stack direction="column">
                    <Typography variant="h7">Convert To Int Node</Typography>
                </Stack>
            </Box>
            {outputHndl}
        </>
    );
}
