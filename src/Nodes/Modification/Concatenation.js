import { useInput, useOutput } from "../nodes";
import { Paper, Typography } from "@mui/material";
import { useEffect } from "react";

export default function ConcatenationNode() {
    const [inputA, handleA] = useInput("Input A", ["text", "boolean"]);
    const [inputB, handleB] = useInput("Input B", ["text", "boolean"]);

    const [, setOutput, outputHandle] = useOutput("Concatenated", "text");
    const [sum, setSum, sumHandle] = useOutput("Sum", "A");

    useEffect(() => {
        setOutput(`${inputA}${inputB}`);
        setSum(inputA + inputB);
    }, [inputA, inputB, setOutput, setSum]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography>
                    {`${inputA}`} + {`${inputB}`} = {`${sum}`}
                </Typography>
            </Paper>
            {handleA}
            {handleB}
            {outputHandle}
            {sumHandle}
        </>
    );
}
