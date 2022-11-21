import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect } from "react";
import { useInput, useOutput } from "../nodes";

export default function TextTokenization() {
    var [input, inputHndl] = useInput("input","string");
    const [output, setOutput, outputHndl] = useOutput("output","string[]",input);

    useEffect(() => {

        if(input) {
            // Only allow for string type inputs to tokenize, else do log error
            if(typeof(input) === 'string') { 
                const newData = processData(input);
                setOutput(newData);
            } else {
                console.log("TextTokenizationError: Input must be type string.");
            }
        }
        
    }, [input]);

    // Regex Tokenize Input Data
    const processData = (input) => {
        return(input.split(/[ ,\n]+/));
    }

    return (
        <>
            {inputHndl}
            <Box
                sx={{
                    width: 190,
                    height: 80,
                    backgroundColor:"white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems:"center",
                    alignText:"center",
                }}>
                <Stack direction="column">
                    <Typography variant="h7">Tokenize Text Input</Typography>
                </Stack>
            </Box>
            {outputHndl}
        </>
    );

}