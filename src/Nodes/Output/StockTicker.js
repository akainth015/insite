import React from "react";
import Chart from "chart.js/auto";
import {Card, CardContent} from "@mui/material";
import {useEffect, useState} from "react";
import { useOutput, useInput } from "../nodes";
import { Box, Typography} from "@mui/material";
import { useSocketIoChannel } from "../../backend";
import { FilePresent } from "@mui/icons-material";


export default function Stock_Ticker(){
    const [companyName, setCompanyName] = useState("AAPL");
    const [price, setStockPriceOutput] = useState(0);
    const [emitStockPriceSubscription, registerToUpdates] = useSocketIoChannel("get_market_price");

    const intervalID = null
    const handleSubmit = () => {
        clearInterval(intervalID);
        intervalID = setInterval(emitStockPriceSubscription(companyName), 1000);
    }


    useEffect(() => {
        return registerToUpdates((data) => {
            setStockPriceOutput(data);
        });
    }, [registerToUpdates]);


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
        <form onSubmit={handleSubmit}>
        <label>
            Company Ticker:
            <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            />
        </label>
        <input type="submit" value="Submit" />
        </form>

        {price}
        
        </Box>
        
        
    )

}

