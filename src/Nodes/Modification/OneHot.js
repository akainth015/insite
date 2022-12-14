import { useInput, useOutput, useSetting } from "../nodes";
import { Paper, Typography } from "@mui/material";
import ColumnSelect from "../../Components/ColumnSelect";
import { useEffect } from "react";

const getAllUniqueValues = (data, k) => {
    let unique = new Set();
    for (let i = 0; i < data.length; i++) {
        if (data[i][k] !== undefined && data[i][k] !== null && data[i][k] !== "") {
            unique.add(data[i][k]);
        }
    }
    unique = Array.from(unique);
    return unique;
};

const encodeCategory = (data, category, values) => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < values.length; j++) {
            if (values[j] === undefined) {
                continue;
            }
            if (data[i][category] === values[j]) {
                data[i][values[j]] = 1;
            } else {
                data[i][values[j]] = 0;
            }
        }
        delete data[i][category];
    }
};

export default function OneHotEncodingNode() {
    const [input, inputHandle] = useInput("Input", ["table"]);
    const [, setOutput, outputHandle] = useOutput("Normalized Data", "table", input);

    const [colsSelected, setColsSelected] = useSetting("column", []);

    useEffect(() => {
        if (input) {
            let output = structuredClone(input);
            colsSelected.forEach((col) => {
                const uniqueValues = getAllUniqueValues(output, col);
                output.columns = output.columns.concat(uniqueValues).filter((it) => it !== col);
                encodeCategory(output, col, uniqueValues);
            });
            setOutput(output);
        }
    }, [colsSelected, input, setOutput]);

    return (
        <>
            {inputHandle}
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography mb={1} align="center">
                    OneHot Encoding
                </Typography>
                <ColumnSelect
                    sx={{ mb: 2 }}
                    multiple={true}
                    value={colsSelected}
                    onChange={setColsSelected}
                    table={input}
                />
            </Paper>
            {outputHandle}
        </>
    );
}
