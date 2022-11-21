import { useOutput, useStrictInput } from "../nodes";
import { Paper, Typography } from "@mui/material";
import { useEffect } from "react";

export default function EdgeDetectionNode() {
    const [registerChangeHandler, inputHandle] = useStrictInput("Input", ["any"]);
    const [, setOutput, outputHandle] = useOutput("Edge Detected?", "boolean", false);

    useEffect(() => {
        return registerChangeHandler(() => {
            setOutput(true);
        });
    }, [registerChangeHandler, setOutput]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography>This node will notify downstream nodes whenever a new output is published.</Typography>
            </Paper>
            {inputHandle}
            {outputHandle}
        </>
    );
}
