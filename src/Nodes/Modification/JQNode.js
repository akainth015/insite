import { Paper, TextField } from "@mui/material";
import { useEffect } from "react";
import { useInput, useOutput, useSetting } from "../nodes";
import jq from "./jq.js";

window.jq = jq;

const empty_arr = {};

// Create a text box
// From text box, pass text to jqjs
// Return the results of jqjs query as output

/*
DESIGN:
    Input a JSON File from JSON Node
    Use a textarea to have user input
    Take text and throw it to the compiler from JQ
    ( other stuff here I do not know )
    Return the results of JQ as output
*/

export default function JQNode() {
    const [input, inputHndl] = useInput("input", "any", empty_arr);
    const [, setOutput, outputHndl] = useOutput("output", "any", null);
    const [jqProgram, setJqProgram] = useSetting("Program", ".");

    // Conduct a new JQ Query
    const onTextChange = (e) => {
        setJqProgram(e.target.value);
    };

    useEffect(() => {
        try {
            // The function returned from compile is a generator that produces the zero or more outputs
            // from the jq program for a given single input value, which must be one of the JSON data model types:
            // object, array ,string, number, boolean, or null
            let filter = jq.compile(jqProgram);
            let op = [];
            for (let i of filter(input)) {
                op.push(i);
            }
            setOutput(op.length === 1 ? op[0] : op);
        } catch (e) {}
    }, [input, setOutput, jqProgram]);

    return (
        <>
            {inputHndl}
            <Paper sx={{ padding: 2 }}>
                <TextField
                    className={"nodrag nowheel"}
                    label={"JQ Query"}
                    value={jqProgram}
                    onChange={onTextChange}
                ></TextField>
            </Paper>
            {outputHndl}
        </>
    );
}
