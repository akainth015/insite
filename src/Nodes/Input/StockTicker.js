import React, { useRef, useEffect } from "react";
import { useOutput, useSetting } from "../nodes";
import { Button, FormControl, Paper, TextField } from "@mui/material";
import { useSocketIoChannel } from "../../backend";

export default function StockTicker() {
    const [companyName, setCompanyName] = useSetting("ticker", "AAPL");
    const [emitStockPriceSubscription, registerToUpdates] = useSocketIoChannel("get_market_price");
    const [output, setStockPriceOutput, outputHndl] = useOutput("Output", "number", "Input desired Company Ticker");

    const intervalId = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (intervalId.current) {
            clearInterval(intervalId.current);
        }

        intervalId.current = setInterval(() => {
            emitStockPriceSubscription(companyName, setStockPriceOutput);
        }, 5000);
    };

    
    useEffect(() => {
        return registerToUpdates((data) => {
            setStockPriceOutput(data);
            console.log(data);

        });
    }, [registerToUpdates, companyName]);

    return (
        <Paper sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <TextField
                        id="stockTicker"
                        label={"Company Ticker"}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ pt: 2 }}>
                    <Button type="submit" variant="outlined">
                        Subscribe
                    </Button>
                </FormControl>
            </form>
            {outputHndl}
        </Paper>
    );
}