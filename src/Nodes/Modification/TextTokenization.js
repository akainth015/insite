import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect } from "react";
import { useInput, useOutput } from "../nodes";

// Need to check for weird inputs ( non arrays / array of objects / etc.)
export default function TextTokenization() {
    var [input, inputHndl] = useInput("input",["object[]"]);
    const [output, setOutput, outputHndl] = useOutput("output","object[]",input);

    useEffect(() => {
        if(input) {
            const newData = processData(input);
            console.log(newData);
            setOutput(newData);
        }
    }, [input]);

    const processData = (input) => {
        if(typeof(input) === 'object') {
        } else {
            return(input.split(/[ ,\n]+/));
        }
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