import { useInput, useOutput, useSetting } from "../nodes";
import { Paper } from "@mui/material";
import ColumnSelect from "../../Components/ColumnSelect";
import { useEffect } from "react";

const emptyArray = [];

export default function FilterColumnsNode() {
    const [input, inputHandle] = useInput("input", ["table"]);
    const [, setOutput, outputHandle] = useOutput("output", "table", emptyArray);

    const [filterColumns, setFilterColumns] = useSetting("filterColumns", emptyArray);

    useEffect(() => {
        const output = input
            ? input.map((row) => {
                  const newRow = {};
                  filterColumns.forEach((column) => {
                      newRow[column] = row[column];
                  });
                  return newRow;
              })
            : emptyArray;
        output.columns = filterColumns;
        setOutput(output);
    }, [filterColumns, input, setOutput]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                {inputHandle}
                <ColumnSelect value={filterColumns} onChange={setFilterColumns} table={input} />
                {outputHandle}
            </Paper>
        </>
    );
}
