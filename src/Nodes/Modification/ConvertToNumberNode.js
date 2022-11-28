import React, { useEffect } from "react";
import { Paper, Typography } from "@mui/material";
import { useInput, useOutput, useSetting } from "../nodes";
import ColumnSelect from "../../Components/ColumnSelect";

export default function ConvertToNumberNode() {
    const [input, inputHandle, inputType] = useInput("input", ["table", "string", "boolean"]);
    const [, setOutput, outputHandle] = useOutput("output", inputType === "table" ? "table" : "number", 0);

    const [columns, setColumns] = useSetting("columns", []);

    useEffect(() => {
        if (inputType) {
            let output;
            switch (inputType) {
                case "table":
                    output = input
                        ? input.map((row) => {
                              columns.forEach((column) => {
                                  row[column] = parseFloat(row[column]);
                              });
                              return row;
                          })
                        : [];
                    output.columns = input ? input.columns : [];
                    break;
                case "boolean":
                    output = input ? 1 : 0;
                    break;
                default:
                    output = parseFloat(input);
            }
            setOutput(output);
        }
    }, [columns, input, inputType, setOutput]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                {inputHandle}
                <Typography align="center" mb={1}>
                    Convert to Numbers
                </Typography>
                {inputType === "table" ? <ColumnSelect value={columns} onChange={setColumns} table={input} /> : null}
                {outputHandle}
            </Paper>
        </>
    );
}
