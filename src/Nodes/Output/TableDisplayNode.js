import React from "react";
import { useInput, useOutput } from "../nodes";
import { Box, Typography, Button } from "@mui/material";

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

    const downloadFile = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(input))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "data.json";

        link.click();
    };

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
                {input && <Button onClick={downloadFile}>Download JSON</Button>}
            </Box>
            {inputHndl}
            {outputHndl}
        </>
    );
}
