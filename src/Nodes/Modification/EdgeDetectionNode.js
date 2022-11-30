import { useInput, useOutput } from "../nodes";
import { Paper, Typography } from "@mui/material";
import { useEffect } from "react";

export default function EdgeDetectionNode() {
    const [input, inputHandle] = useInput("Input", "any");
    const [, setOutput, outputHandle] = useOutput("Changed Input", "number", 0);

    useEffect(() => {
        setOutput(1);
        setTimeout(() => setOutput(0), 10);
    }, [input, setOutput]);

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
