import { Autocomplete, Checkbox, TextField } from "@mui/material";

export default function ColumnSelect({
    label = "Select Columns",
    value,
    onChange,
    table,
    multiple = true,
    width = 350,
    sx,
}) {
    const tableColumns = table && table.length > 0 ? table.columns || Object.keys(table[0]) : [];

    return (
        <Autocomplete
            sx={{
                ...sx,
                width,
            }}
            className="nodrag nowheel"
            onChange={(e, values) => onChange(values)}
            value={value}
            multiple={multiple}
            limitTags={1}
            options={tableColumns}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label={label} placeholder="Columns" />}
            renderOption={(props, option, { selected }) => {
                return (
                    <li {...props}>
                        <Checkbox checked={selected} />
                        {option}
                    </li>
                );
            }}
        />
    );
}
