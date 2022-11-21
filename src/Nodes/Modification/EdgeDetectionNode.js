import { useInput, useOutput } from "../nodes";
import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function EdgeDetectionNode() {
    const [lastInput, setLastInput] = useState(null);
    const [input, inputHandle] = useInput("Input", "any");
    const [, setOutput, outputHandle] = useOutput("Changed Input", "number", 0);

    useEffect(() => {
        const old = lastInput;
        const newValue = JSON.stringify(input);

        if (old !== newValue) {
            setOutput(input);
        }
        setLastInput(newValue);
    }, [input, lastInput, setOutput]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography>Emit input only if it changes</Typography>
            </Paper>
            {inputHandle}
            {outputHandle}
        </>
    );
}
