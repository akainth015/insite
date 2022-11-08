import React from "react";
import { useInput, useOutput } from "../nodes";
import { Box, Typography } from "@mui/material";

export default function TableDisplayNode(data) {
    const [input, inputHndl] = useInput("input", ["object[]", "object"]);
    const [output, setOutput, outputHndl] = useOutput("output", "object", input);
    const [processedInput, setProcessedInput] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        if (input) {
            setProcessedInput(input.slice(0, 5));
            setLoading(false);
            setOutput(input);
        }
    }, [input]);

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                sx={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h7">Table Node</Typography>
                {loading !== true && (
                    <table>
                        <tbody>
                            <tr key={"header"}>
                                {Object.keys(processedInput[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                            {processedInput.map((item, index) => (
                                <tr key={index}>
                                    {Object.keys(item).map((key) => (
                                        <td key={key}>{item[key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Box>
            {inputHndl}
            {outputHndl}
        </>
    );
}
