import { useInput, useOutput, useStrictInput } from "../nodes";
import { useEffect } from "react";
import { Paper, Typography } from "@mui/material";

export default function AggregateNode() {
    const [subscribeToInput, inputHandle] = useStrictInput("Input", ["number", "boolean"]);
    const [reset, resetHandle] = useInput("Reset", ["boolean"]);
    const [sum, setSum, sumHandle] = useOutput("Sum", "number", 0);

    useEffect(() => {
        if (reset) {
            setSum(0);
        }
    }, [reset, setSum]);

    useEffect(() => {
        const unsubscribe = subscribeToInput((input) => {
            if (!reset) {
                setSum((sum) => sum + input);
            }
        });
        return () => {
            unsubscribe();
        };
    }, [reset, setSum, subscribeToInput]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                {reset ? (
                    <Typography>This integrator is being reset.</Typography>
                ) : (
                    <Typography>Accumulation: {sum}</Typography>
                )}
            </Paper>
            {inputHandle}
            {resetHandle}
            {sumHandle}
        </>
    );
}
