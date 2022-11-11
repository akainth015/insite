import { useOutput } from "../nodes";
import { Button, Paper } from "@mui/material";

export function ButtonNode() {
    const [, setOutput, outputHandle] = useOutput("Is Pressed", "boolean", false);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Button className={"nodrag"} onMouseDown={() => setOutput(true)} onMouseUp={() => setOutput(false)}>
                    Press to Activate
                </Button>
            </Paper>
            {outputHandle}
        </>
    );
}
