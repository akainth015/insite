import React from "react";
import { useEffect, useState } from "react";
import { useOutput, useSetting } from "../nodes";
import { Paper, TextField, Button } from "@mui/material";
import { useSocketIoChannel } from "../../backend";

export default function StockHistory() {
    const [companyName, setCompanyName] = useState("AAPL", "AAPL");
    const [emitStockPriceSubscription, registerToUpdates] = useSocketIoChannel("get_historical_prices");
    const [historical_prices, setStockPriceOutput, outputHndl] = useOutput("Output", "table");

    const handleSubmit = () => {
        emitStockPriceSubscription(companyName);
    };

    useEffect(() => {
        return registerToUpdates((data) => {
            convertCSV(data);
            setStockPriceOutput(data);
        });
    }, [registerToUpdates, companyName]);

    function convertCSV(hashMap) {
        Object.keys(hashMap)
            .map(function (k) {
                return hashMap[k];
            })
            .join(",");
    }

    return (
        <Paper sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit}>
                <TextField
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
