import { useInput } from "../nodes";
import { useEffect, useCallback } from "react";
import { Box, Stack, Typography } from "@mui/material";
import * as d3 from "d3";
import "./correlation.css";

export default function Correlation() {
    const [input, inputHndl] = useInput("input", ["table"]);

    const render = useCallback(
        (inputData) => {
            let data = [];
            const categories = categoriesToCheck(input);
            for (let i = 0; i < categories.length; i++) {
                for (let j = 0; j < categories.length; j++) {
                    data.push({
                        x: categories[i],
                        y: categories[j],
                        value: inputData[categories[i]][categories[j]],
                    });
                }
            }

            let margin = {
                    top: 25,
                    right: 80,
                    bottom: 25,
                    left: 25,
                },
                width = 500 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                domain = d3
                    .set(
                        data.map(function (d) {
                            return d.x;
                        })
                    )
                    .values(),
                num = Math.sqrt(data.length),
                color = d3.scaleLinear().domain([-1, 0, 1]).range(["#B22222", "#fff", "#000080"]);

            let x = d3.scalePoint().range([0, width]).domain(domain),
                y = d3.scalePoint().range([0, height]).domain(domain),
                xSpace = x.range()[1] - x.range()[0],
                ySpace = y.range()[1] - y.range()[0];
            ySpace = y.range()[1] - y.range()[0];

            let svg = d3
                .select("#cor-root")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            let cor = svg
                .selectAll(".cor")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "cor")
                .attr("transform", function (d) {
                    return "translate(" + x(d.x) + "," + y(d.y) + ")";
                });

            cor.append("rect")
                .attr("class", "cor-rect")
                .attr("width", xSpace / 10)
                .attr("height", ySpace / 10)
                .attr("x", -xSpace / 20)
                .attr("y", -ySpace / 20);

            cor.filter(function (d) {
                let ypos = domain.indexOf(d.y);
                let xpos = domain.indexOf(d.x);
                for (let i = ypos + 1; i < num; i++) {
                    if (i === xpos) return false;
                }
                return true;
            })
                .append("text")
                .attr("y", 5)
                .text(function (d) {
                    if (d.x === d.y) {
                        return d.x;
                    } else {
                        return d.value.toFixed(2);
                    }
                })
                .style("fill", function (d) {
                    if (d.value === 1) {
                        return "#000";
                    } else {
                        return color(d.value);
                    }
                });

            cor.filter(function (d) {
                let ypos = domain.indexOf(d.y);
                let xpos = domain.indexOf(d.x);
                for (let i = ypos + 1; i < num; i++) {
                    if (i === xpos) return true;
                }
                return false;
            })
                .append("circle")
                .attr("r", function (d) {
                    return (width / (num * 2)) * (Math.abs(d.value) + 0.1);
                })
                .style("fill", function (d) {
                    if (d.value === 1) {
                        return "#000";
                    } else {
                        return color(d.value);
                    }
                });

            let aS = d3
                .scaleLinear()
                .range([-margin.top + 5, height + margin.bottom - 5])
                .domain([1, -1]);

            let yA = d3.axisRight().scale(aS).tickPadding(7);

            let aG = svg
                .append("g")
                .attr("class", "y axis")
                .call(yA)
                .attr("transform", "translate(" + (width + margin.right / 2) + " ,0)");

            let iR = d3.range(-1, 1.01, 0.01);
            let h = height / iR.length + 3;
            iR.forEach(function (d) {
                aG.append("rect")
                    .attr("class", "cor-rect")
                    .style("fill", color(d))
                    .style("stroke-width", 0)
                    .style("stoke", "none")
                    .attr("height", h)
                    .attr("width", 10)
                    .attr("x", 0)
                    .attr("y", aS(d));
            });
        },
        [input]
    );

    const mean = (arr) => {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }

        return sum / arr.length;
    };

    // Calculates the standard deviance
    const stdDev = useCallback(() => {
        let newObj = structuredClone(input);
        let returnObj = {};
        const categories = categoriesToCheck(newObj);
        for (let i = 0; i < categories.length; i++) {
            let meanSum = 0;
            for (let j = 0; j < newObj.length; j++) {
                meanSum += newObj[j][categories[i]];
            }
            const avg = meanSum / newObj.length;
            let stdDevSum = 0;
            for (let j = 0; j < newObj.length; j++) {
                stdDevSum += Math.pow(newObj[j][categories[i]] - avg, 2);
            }
            returnObj[categories[i]] = Math.sqrt(stdDevSum / newObj.length);
        }

        return returnObj;
    }, [input]);

    // Calculates the covariance array
    const coVar = useCallback(() => {
        let newObj = structuredClone(input); // Create a copy of the input
        let returnObj = {}; // Create an object to return
        const categories = categoriesToCheck(newObj);

        for (let i = 0; i < categories.length; i++) {
            for (let j = i + 1; j < categories.length; j++) {
                let arrayOne = [];
                let arrayTwo = [];

                for (let k = 0; k < newObj.length; k++) {
                    arrayOne.push(newObj[k][categories[i]]);
                    arrayTwo.push(newObj[k][categories[j]]);
                }

                let sum = 0;
                let meanOne = mean(arrayOne);
                let meanTwo = mean(arrayTwo);

                for (let k = 0; k < arrayOne.length; k++) {
                    sum += (arrayOne[k] - meanOne) * (arrayTwo[k] - meanTwo);
                }

                if (!returnObj[categories[i]]) {
                    returnObj[categories[i]] = {};
                }
                if (!returnObj[categories[j]]) {
                    returnObj[categories[j]] = {};
                }
                returnObj[categories[i]][categories[j]] = sum / (arrayOne.length - 1);
                returnObj[categories[j]][categories[i]] = sum / (arrayOne.length - 1);
            }
        }
        return returnObj;
    }, [input]);

    useEffect(() => {
        if (input) {
            let newObj = {};
            const coVarArr = coVar();
            const stdDevArr = stdDev();
            const categories = categoriesToCheck(input);

            for (let i = 0; i < categories.length; i++) {
                for (let j = 0; j < categories.length; j++) {
                    if (!newObj[categories[i]]) {
                        newObj[categories[i]] = {};
                    }
                    if (!newObj[categories[j]]) {
                        newObj[categories[j]] = {};
                    }
                    if (i === j) {
                        newObj[categories[i]][categories[j]] = 1;
                    } else {
                        newObj[categories[i]][categories[j]] =
                            coVarArr[categories[i]][categories[j]] /
                            (stdDevArr[categories[i]] * stdDevArr[categories[j]]);
                        newObj[categories[j]][categories[i]] =
                            coVarArr[categories[i]][categories[j]] /
                            (stdDevArr[categories[i]] * stdDevArr[categories[j]]);
                    }
                }
            }
            render(newObj);
        }
    }, [input, coVar, stdDev, render]);

    const categoriesToCheck = (data) => {
        let categories = [];
        const arr = Object.keys(data[0]);
        for (let i = 0; i < arr.length; i++) {
            if (!isNaN(data[0][arr[i]])) {
                categories.push(arr[i]);
            }
        }

        return categories;
    };

    return (
        <>
            {inputHndl}
            <Box
                sx={{
                    minWidth: 190,
                    minHeight: 80,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems: "center",
                    alignText: "center",
                }}
            >
                <Stack direction="column">
                    <Typography variant="h7">Correlogram Node</Typography>
                    <div id="cor-root" />
                </Stack>
            </Box>
        </>
    );
}
