import React from "react";
import { useEffect, useState } from "react";
import { useOutput } from "../nodes";
import { Box } from "@mui/material";
import { useSocketIoChannel } from "../../backend";

export default function StockHistory() {
    const [companyName, setCompanyName] = useState("Input desired Company Ticker");
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
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {outputHndl}
        </Box>
    );
}
