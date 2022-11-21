import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect } from "react";
import { useInput, useOutput } from "../nodes";

const empty_arr = [];

export default function TextTokenization() {
    var [input, inputHndl] = useInput("input","string");
    const [output, setOutput, outputHndl] = useOutput("output","string[]",empty_arr);

    useEffect(() => {

        if(input) {
            // Only allow for string type inputs to tokenize, else do log error
            if(typeof(input) === 'string') { 
                const newData = processData(input);
                setOutput(newData);
                console.log(newData);
            } else {
                console.log("TextTokenizationError: Input must be type string.");
            }
        }
        
    }, [input]);

    // Regex Tokenize Input Data
    const processData = (input) => {
        let split_input = input.split(/[ ,!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]+/);
        // Check if the last character is a newline ( regex wont capture it from the textarea )
        if(split_input[split_input.length-1] === "") {
            split_input.splice(-1);
        }
        return split_input;
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