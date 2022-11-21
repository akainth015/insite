import { useInput, useOutput, useStrictInput } from "../nodes";
import { useEffect } from "react";
import { Paper, Typography } from "@mui/material";

export default function IntegratorNode() {
    const [subscribeToInput, inputHandle] = useStrictInput("Input", ["any"]);
    const [reset, resetHandle] = useInput("Reset", ["boolean"]);
    const [sum, setSum, sumHandle] = useOutput("Sum", "number", 0);

    useEffect(() => {
        if (reset) {
            setSum(0);
        }
    }, [reset, setSum]);

    useEffect(() => {
        return subscribeToInput((input) => {
            if (!reset) {
                setSum(sum + input);
            }
        });
    }, [reset, setSum, subscribeToInput, sum]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                {reset ? <Typography>This integrator is being reset.</Typography> : <Typography>Sum: {sum}</Typography>}
            </Paper>
            {inputHandle}
            {resetHandle}
            {sumHandle}
        </>
    );
}
