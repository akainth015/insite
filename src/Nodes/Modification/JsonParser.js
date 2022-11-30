import { Paper, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { useInput, useOutput } from "../nodes";

export default function JSONParser() {
    const [input, inputHndl] = useInput("input", "any");
    const [, setOutput, outputHndl] = useOutput("output", "any", null);
    const [collapse, setCollapse] = useState({});

    useEffect(() => {
        if (input) {
            let collapseDict = {};
            iterate(input, collapseDict);
            setCollapse(collapseDict);
            setOutput(input);
        }
    }, [input]);

    const iterate = (inObj, dic) => {
        Object.keys(inObj).forEach((key) => {
            dic[key] = false;
            if (typeof inObj[key] === "object" && inObj[key] !== null) {
                iterate(inObj[key], dic);
            }
        });
    };

    const handleClick = (key, par) => {
        const output_arr = structuredClone(par.concat([key]));
        let new_output = structuredClone(input);
        while (output_arr.length) {
            let key = output_arr.shift();
            new_output = new_output[key];
        }
        setOutput(new_output);
    };

    const handleClickCollapse = (key) => {
        const newDic = structuredClone(collapse);
        newDic[key] = !newDic[key];
        setCollapse(newDic);
    };

    function listMapping(arr, par) {
        return Object.entries(arr).map(([key, value]) => (
            <ListItemButton>
                <ListItemText primary={key} onClick={() => handleClick(key, par)} />
                {typeof value == "object" &&
                    (collapse[key] ? (
                        <ExpandLess className="nodrag" onClick={() => handleClickCollapse(key)} />
                    ) : (
                        <ExpandMore className="nodrag" onClick={() => handleClickCollapse(key)} />
                    ))}
                {typeof value == "object" && (
                    <Collapse in={collapse[key]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {listMapping(value, par.concat([key]))}
                        </List>
                    </Collapse>
                )}
            </ListItemButton>
        ));
    }

    return (
        <>
            {inputHndl}
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography varient="h7">JSON Parser Node</Typography>

                {input && (
                    <nav aria-label="secondary mailbox folders">
                        <List>{listMapping(input, [])}</List>
                    </nav>
                )}
            </Paper>
            {outputHndl}
        </>
    );
}
