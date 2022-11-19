import React from "react";
import Chart from "chart.js/auto";
import {Card, CardContent} from "@mui/material";
import {useEffect} from "react";
import { useOutput, useInput } from "../nodes";
import { Box, Typography} from "@mui/material";
import { useSocketIoChannel } from "../../backend";


export default function Stock_Ticker(){
    const [input, inputHandl] = useInput("piechart", "object[]");
    const [data, setOutput, outputHandle] = useOutput("Output", "object[], object", null);

    const [emitStockPriceSubscription, registerToUpdates] = useSocketIoChannel("stock-price");

    useEffect(() => {
        return registerToUpdates(({price}) => setStockPriceOutput(price));
    });
    

    

    return(
        <Box
        display="flex"
        flexDirection="column"
        sx={{
            backgroundColor: "white",
            padding: 2,
            borderRadius: 2,
        }}
        >
        <Typography variant="h7"> Stock Ticker</Typography>

            {inputHandl}
            <CardContent>
            </CardContent>
            {outputHandle}
            


        </Box>
        
    )

}

