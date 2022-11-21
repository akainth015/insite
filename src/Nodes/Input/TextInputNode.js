import React from "react"
import { useState } from "react"
import { useOutput } from "../nodes";
import { Box, Typography } from "@mui/material"

export default function TextInputNode() {
    const [output, setOutput, outputHndl] = useOutput("Output","string",null);

    const fileReader = new FileReader();
    const onFileChange = (e) => {
        const file = e.target.files[0];
        fileReader.onload = function (e) {
            let txt = fileReader.result;
            txt = txt.replaceAll("\r\n", "\n");
            txt = txt.replaceAll("\r","\n");
            setOutput(txt);
            console.log(outputHndl);
        };
        fileReader.readAsText(file);
    };

    const onTextChange = (e) => {
        setOutput(e.target.value);
    }

    return (
        <>
            <Box
                sx={{
                    width: 200,
                    height: 120,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems: "center",
                    alignText: "center",
                }}
                >
                <Typography varient = "h7">Text Input Node</Typography>
                <form>
                    <input type="file" id="txtFile" name="txtFile" accept=".txt" onChange={onFileChange}/>
                </form>
                <textarea id="Text" name="Text" value={output} onChange={onTextChange}/>
            </Box>
            {outputHndl}
        </>
    )
}
