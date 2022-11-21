import { useOutput } from "../nodes";
import { Paper } from "@mui/material";

export default function TextInputNode() {
    const [output, setOutput, outputHandle] = useOutput("Text", "string", "");

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <input onChange={(e) => setOutput(e.target.value)} value={output} />
                {outputHandle}
            </Paper>
        </>
    );
}
