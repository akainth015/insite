import React from "react";
import { useEffect, useState } from "react";
import { useOutput, useSetting } from "../nodes";
import { Paper, TextField, Button } from "@mui/material";
import { useSocketIoChannel } from "../../backend";

export default function StockTicker() {
    const [companyName, setCompanyName] = useSetting("ticker", "AAPL");
    const [emitStockPriceSubscription, registerToUpdates] = useSocketIoChannel("get_market_price");
    const [price, setStockPriceOutput, outputHndl] = useOutput("Output", "number", "Input desired Company Ticker");



    const handleSubmit = (value) => {
        const interval = setInterval(() => {
            emitStockPriceSubscription(companyName);
        }, 1000);    
    };



    useEffect(() => {
        return registerToUpdates((data) => {
            setStockPriceOutput(data);
        });
    }, [registerToUpdates, companyName]);


    return (
        <Paper sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    id = "stockTicker"
                    label={"Company Ticker"}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            <input type="submit" value="Submit" />
            </form>
            {outputHndl}
        </Paper>
    );
}
