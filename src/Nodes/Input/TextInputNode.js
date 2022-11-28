import React from "react";
import { useOutput } from "../nodes";
import { Paper, Typography } from "@mui/material";

export default function TextInputNode() {
    const [output, setOutput, outputHndl] = useOutput("Output", "string", "");

    const fileReader = new FileReader();
    const onFileChange = (e) => {
        const file = e.target.files[0];
        fileReader.onload = function () {
            let txt = fileReader.result;
            txt = txt.replaceAll("\r\n", "\n");
            txt = txt.replaceAll("\r", "\n");
            setOutput(txt);
            console.log(outputHndl);
        };
        fileReader.readAsText(file);
    };

    const onTextChange = (e) => {
        setOutput(e.target.value);
    };

    return (
        <>
            <Paper sx={{ padding: 2 }}>
                <Typography varient="h7">Text Input Node</Typography>
                <form>
                    <input type="file" id="txtFile" name="txtFile" accept=".txt" onChange={onFileChange} />
                </form>
                <textarea className={"nodrag nowheel"} id="Text" name="Text" value={output} onChange={onTextChange} />
            </Paper>
            {outputHndl}
        </>
    );
}
