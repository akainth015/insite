import { useEffect, useState } from "react";
import { useInput } from "../nodes";
import { Chart } from "chart.js";
import { Box, Typography } from "@mui/material";

export default function WordCloudChart() {
    // Place keys into bins and scale by recurrence
    const process_data = (input) => {
        const bins = {};
        for (const i of input) {
            bins[Object.values(i)] = bins[Object.values(i)] ? bins[Object.values(i)] + 1 : 1;
        }

        return bins;
    };

    const [input, inputHndl] = useInput("object", "object[]");
    const [data, setData] = useState({
        datasets: [
            {
                data: [],
            },
        ],
    });

    const options = {
        type: "wordCloud",
        data: data,
        options: {},
    };

    useEffect(() => {
        if (input) {
            const input_data = process_data(input);
            init_cloud(input_data);
        }
    }, [input]);

    function init_cloud(input) {
        setData({
            labels: input.map((d) => d.key),
            datasets: [
                {
                    data: input.map((d) => 10 + d.value * 10),
                },
            ],
        });
    }

    return (
        <>
            <Box
                display="flex"
                sx={{
                    backgroundcolor: "white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems: "center",
                    minWidth: 500,
                    minHeight: 300,
                }}
            >
                <Typography varient="h7">Word Cloud Node</Typography>
                <wordCloud data={data} options={options}></wordCloud>
            </Box>
        </>
    );
}
