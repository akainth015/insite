import { useInput, useOutput, useSetting } from "../nodes";
import { FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import ColumnSelect from "../../Components/ColumnSelect";
import { useEffect } from "react";

export default function FilterValuesNode() {
    const [input, inputHandle, inputType] = useInput("input", ["table", "number", "boolean"]);
    const [, setOutput, outputHandle] = useOutput("output", inputType, null);

    const [colSelect, setColSelect] = useSetting("column", null);
    const [operation, setOperation] = useSetting("operation", "gt");
    const [value, setValue] = useSetting("value", "0");

    useEffect(() => {
        if (value) {
            let filterFn;
            switch (operation) {
                case "gt":
                    filterFn = (val) => val > value;
                    break;
                case "gte":
                    filterFn = (val) => val >= value;
                    break;
                case "eq":
                    // eslint-disable-next-line eqeqeq
                    filterFn = (val) => val == value;
                    break;
                case "lt":
                    filterFn = (val) => val < value;
                    break;
                case "lte":
                    filterFn = (val) => val <= value;
                    break;
                default:
                    console.error("WTF is happening");
                    break;
            }

            switch (inputType) {
                case "table":
                    if (colSelect) {
                        const output = input ? input.filter((row) => filterFn(row[colSelect])) : [];
                        output.columns = input ? input.columns : [];
                        setOutput(output);
                    }
                    break;
                default:
                    if (filterFn(input)) {
                        setOutput(input);
                    }
                    break;
            }
        }
    }, [colSelect, operation, value, input, setOutput, inputType]);

    return (
        <>
            {inputHandle}
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography mb={1} align="center">
                    Filter Rows
                </Typography>
                {inputType === "table" ? (
                    <ColumnSelect
                        sx={{ mb: 2 }}
                        multiple={false}
                        value={colSelect}
                        onChange={setColSelect}
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
                        <MenuItem value={"gt"}>Greater Than</MenuItem>
                        <MenuItem value={"gte"}>Greater Than Equal To</MenuItem>
                        <MenuItem value={"eq"}>Equal To</MenuItem>
                        <MenuItem value={"lt"}>Less Than</MenuItem>
                        <MenuItem value={"lte"}>Less Than Equal To</MenuItem>
                    </Select>
                </FormControl>

                <FormControl
                    fullWidth
                    sx={{
                        mb: 2,
                        mt: 2,
                    }}
                >
                    <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} />
                </FormControl>
            </Paper>
            {outputHandle}
        </>
    );
}
