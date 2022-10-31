import { useInput, useOutput } from "../nodes";
import { useEffect } from "react";
import { Stack, Typography, Box } from "@mui/material";

export default function FillMissing() {
    const [input, inputHndl] = useInput("input", ["object[]"]);
    const [output, setOutput, outputHndl] = useOutput("output", "object[]", input);

    useEffect(() => {
        if (input) {
            const newData = processData();
            setOutput(newData);
        }
    }, [input]);

    const processData = () => {
        //Create a copy of the input
        let newObj = structuredClone(input);
        const categories = categoriesToCheck(newObj);

        for (let i = 0; i < categories.length; i++) {
            let total = 0;
            let count = 0;
            for (let j = 0; j < newObj.length; j++) {
                if (
                    newObj[j][categories[i]] === null ||
                    newObj[j][categories[i]] === undefined ||
                    isNaN(newObj[j][categories[i]])
                ) {
                    continue;
                }
                total += newObj[j][categories[i]];
                count++;
            }
            const average = total / count;

            for (let j = 0; j < newObj.length; j++) {
                if (
                    newObj[j][categories[i]] === null ||
                    newObj[j][categories[i]] === undefined ||
                    isNaN(newObj[j][categories[i]])
                ) {
                    newObj[j][categories[i]] = average;
                }
            }
        }
        // Converts all values to ints when possible

        return newObj;
    };

    const categoriesToCheck = (data) => {
        let categories = [];
        const arr = Object.keys(data[0]);
        for (let i = 0; i < arr.length; i++) {
            if (typeof data[0][arr[i]] === "number") {
                categories.push(arr[i]);
            }
        }
        return categories;
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
                    <Typography variant="h7">Fill Missing Values Node</Typography>
                </Stack>
            </Box>
            {outputHndl}
        </>
    );
}
