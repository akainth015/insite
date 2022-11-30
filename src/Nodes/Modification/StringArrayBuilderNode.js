import { useInput, useOutput } from "../nodes";
import { Button, Paper } from "@mui/material";
import { useEffect } from "react";

const initialOutput = [];

export default function StringArrayBuilderNode() {
    const [input, inputHandle] = useInput("Input", ["string"]);
    const [array, setArray, arrayHandle] = useOutput("Output", "string[]", initialOutput);

    useEffect(() => {
        setArray((array) => [...array, input]);
    }, [input, setArray]);

    return (
        <>
            {inputHandle}
            <Paper sx={{ padding: 2 }}>
                There are {array.length} elements in this array
                <Button onClick={() => setArray([])}>Reset</Button>
            </Paper>
            {arrayHandle}
        </>
    );
}
