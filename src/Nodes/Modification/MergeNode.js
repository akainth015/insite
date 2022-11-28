import { useInput, useOutput } from "../nodes";
import { Paper, Typography } from "@mui/material";
import { useEffect } from "react";

export default function MergeNode() {
    const [inputA, handleA, aType, aName] = useInput("Input A", "any");
    const [inputB, handleB, bType, bName] = useInput("Input B", "any");

    const [, setOutput, outputHandle] = useOutput("Merged", "object", {});

    const safeNameA = aName === bName ? `${aName} 1` : aName;
    const safeNameB = aName === bName ? `${aName} 2` : bName;

    useEffect(() => {
        const output = {};
        if (aType) {
            output[safeNameA] = inputA;
        }
        if (bType) {
            output[safeNameB] = inputB;
        }
        setOutput(output);
    }, [inputA, inputB, setOutput, aType, bType, safeNameA, safeNameB]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography>A: {JSON.stringify(inputA)}</Typography>
                <Typography>B: {JSON.stringify(inputB)}</Typography>
            </Paper>
            {handleA}
            {handleB}
            {outputHandle}
        </>
    );
}
