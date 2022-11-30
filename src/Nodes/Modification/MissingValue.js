import { useInput, useOutput, useSetting } from "../nodes";
import { FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import ColumnSelect from "../../Components/ColumnSelect";
import { useEffect } from "react";

export default function MissingValuesNode() {
    const [input, inputHandle, inputType] = useInput("input", ["table", "number"]);
    const [, setOutput, outputHandle] = useOutput("output", "table", input);

    const [colsSelected, setColsSelected] = useSetting("column", []);
    const [operation, setOperation] = useSetting("operation", "drop");

    useEffect(() => {
        switch (inputType) {
            case "table":
                if (input) {
                    let output;
                    switch (operation) {
                        case "drop":
                            output = input.filter((row) =>
                                colsSelected.every((col) => row[col] !== undefined && row[col] !== null)
                            );
                            break;
                        case "avg":
                            output = structuredClone(input);
                            colsSelected.forEach((colSelect) => {
                                const avg = input
                                    .map((row) => row[colSelect])
                                    .filter((it) => it !== undefined && it !== null && !isNaN(it))
                                    .reduce((avg, val) => avg + val / input.length, 0);
                                output = output.map((row) => {
                                    const rowElement = row[colSelect];
                                    if (rowElement === undefined || rowElement === null || isNaN(rowElement)) {
                                        row[colSelect] = avg;
                                    }
                                    return row;
                                });
                            });
                            break;
                        case "zero":
                            output = structuredClone(input);
                            colsSelected.forEach((colSelect) => {
                                output = input.map((row) => {
                                    const rowElement = row[colSelect];
                                    if (rowElement === undefined || rowElement === null || isNaN(rowElement)) {
                                        row[colSelect] = 0;
                                    }
                                    return row;
                                });
                            });
                            break;
                        default:
                            console.error("WTF is happening");
                            break;
                    }
                    output.columns = input.columns;
                    setOutput(output);
                }
                break;
            default:
                if (!input || isNaN(input)) {
                    switch (operation) {
                        case "zero":
                            setOutput(0);
                            break;
                        default:
                            break;
                    }
                }
                break;
        }
    }, [colsSelected, operation, input, setOutput, inputType]);

    return (
        <>
            {inputHandle}
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography mb={1} align="center">
                    Handle Missing Values
                </Typography>
                {inputType === "table" ? (
                    <ColumnSelect
                        sx={{ mb: 2 }}
                        multiple={true}
                        value={colsSelected}
                        onChange={setColsSelected}
                        table={input}
                    />
                ) : null}

                <FormControl fullWidth className={"nodrag nowheel"}>
                    <InputLabel id={"operation"}>Operation</InputLabel>
                    <Select
                        label={"Operation"}
                        labelId={"operation"}
                        onChange={(e) => setOperation(e.target.value)}
                        value={operation}
                    >
                        <MenuItem value={"drop"}>Drop Missing Values</MenuItem>
                        {inputType === "table" ? <MenuItem value={"avg"}>Replace with Average</MenuItem> : null}
                        <MenuItem value={"zero"}>Replace with Zero</MenuItem>
                    </Select>
                </FormControl>
            </Paper>
            {outputHandle}
        </>
    );
}
