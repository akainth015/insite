import React from "react";
import {useEffect, useState} from "react";
import { useOutput, useInput } from "../nodes";
import { Box} from "@mui/material";
import { useSocketIoChannel } from "../../backend";


export default function Stock_Ticker(){
    const [companyName, setCompanyName] = useState("Input desired Company Ticker");
    const [emitStockPriceSubscription, registerToUpdates] = useSocketIoChannel("get_market_price");
    const [price, setStockPriceOutput, outputHndl] = useOutput("Output", "number", "Input desired Company Ticker");
    var intervalID = null; 

    const handleSubmit = () => {
        emitStockPriceSubscription(companyName);
    }

    useEffect(() => {
        return registerToUpdates((data) => {
            var new_price = companyName + ' current market price: ' +  + data + " USD"; 
            setStockPriceOutput(new_price);
        });
    }, [registerToUpdates, companyName]);


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

