import { useInput, useOutput, useSetting } from "../nodes";
import { Paper, Typography } from "@mui/material";
import ColumnSelect from "../../Components/ColumnSelect";
import { useEffect } from "react";

const normalize = (data, category) => {
    let min = data[0][category];
    let max = data[0][category];

    for (let i = 0; i < data.length; i++) {
        if (data[i][category] < min) {
            min = data[i][category];
        }
        if (data[i][category] > max) {
            max = data[i][category];
        }
    }

    let range = max - min;

    for (let i = 0; i < data.length; i++) {
        data[i][category] = (data[i][category] - min) / range;
    }
};

export default function MinMaxNormalizationNode() {
    const [input, inputHandle] = useInput("Input", ["table"]);
    const [, setOutput, outputHandle] = useOutput("Normalized Data", "table", input);

    const [colsSelected, setColsSelected] = useSetting("column", []);

    useEffect(() => {
        if (input) {
            let output = input;
            if (output.length > 0) {
                colsSelected.forEach((col) => {
                    normalize(output, col);
                });
            }
            output.columns = input ? input.columns : [];
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
                    Min-Max Normalization
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
