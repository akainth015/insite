import React from "react";
import {useEffect, useState} from "react";
import { useOutput, useInput } from "../nodes";
import { Box} from "@mui/material";
import { useSocketIoChannel } from "../../backend";


export default function Stock_Ticker(){
    const [companyName, setCompanyName] = useState("Input desired Company Ticker");
    const [emitStockPriceSubscription, registerToUpdates] = useSocketIoChannel("get_market_price");
    const [price, setStockPriceOutput, outputHndl] = useOutput("Output", "string", "Input desired Company Ticker");

    

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
            width: 300,
            height: 90,
            padding: 2,
            borderRadius: 2,
        }}
        >
        <form onSubmit={handleSubmit}>
        <label>
            Company Ticker:
            <input
            type="text"
            value= {companyName}
            onChange={e => setCompanyName(e.target.value)}
            />
        </label>
        <input type="submit" value="Submit" />
        </form>
        {outputHndl}
        
        </Box>
        
        
    )

}

