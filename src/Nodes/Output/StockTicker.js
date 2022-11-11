import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import {Card, CardContent} from "@mui/material";
import { useState, useEffect} from "react";
import { useOutput, useInput, socket } from "../nodes";
import io from 'socket.io-client';


export default function Create_Stock_Node(){
    const [stock_price, set_stock_price] = useState(null);

      const socket = io("localhost:5000/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
      });

    socket.emit("get_market_price", (response) => {
        set_stock_price(response); 
      });
    

    return(
        <Card>
            <CardContent>
                <div>
                    {stock_price}
                </div>
            </CardContent>
            

        </Card>
    )

}

