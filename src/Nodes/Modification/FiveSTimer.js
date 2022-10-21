import { useInput, useOutput } from "../nodes";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";

export default function FiveSTimer() {
    const [input, inputHndl] = useInput("input", ["T"]);
    const [output, setOutput, outputHndl] = useOutput("Tick", "T", input);
    const [shouldSet, setShouldSet] = useState(true);

    useEffect(() => {
        if (shouldSet) {
            setTimeout(() => {
                setShouldSet(true);
                setOutput(input);
            }, 5000);
            setShouldSet(false);
        }
    }, [input, setOutput, shouldSet]);

    return (
        <Card>
            {inputHndl}
            <CardContent>The 5 second tick output is {output}</CardContent>
            {outputHndl}
        </Card>
    );
}
