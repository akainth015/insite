import {Translate} from '@mui/icons-material';
import {Box, Stack, Typography} from '@mui/material';
import * as d3 from 'd3';
import {rgb} from 'd3';
import {useEffect, useState} from 'react';

import {useInput, useOutput} from '../nodes';

export default function Histogram() {
  const [input, inputHndl] = useInput('input', ['object[]']);
  const [loading, setLoading] = useState(true);

  const handle_data =
      (input) => {
        let new_obj = input.map(a => {
          return {
            ...a
          }
        });
        let new_data = new_obj.map((item) => {
          for (const key in item) {
            const element = item[key];
            if (element != null && element !== undefined) {
              if (element === '') {
                item[key] = null;
              } else if (isNaN(parseFloat(element))) {
                item[key] = element;
              } else {
                item[key] = parseFloat(element);
              }
            }
          }
          return item;
        });
        console.log(new_data);
        return new_data;
      }

  const initialize_plot =
      (input) => {
        const x_accessor = (d) => d.y;
        const y_accessor = (d) => d.length;

        var margin = {
          top: 25,
          bottom: 40,
          left: 40,
          right: 25,
          margins: 20,
        };
        var width = 500 - margin.left - margin.right;
        var height = 300 - margin.bottom - margin.top;
        margin.container_width = width - margin.margins * 2;
        margin.container_height = height - margin.margins * 2;

        var histogram_svg =
            d3.select('#histogram-root')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr(
                    'transform',
                    'translate(' + margin.left + ',' + margin.top + ')');

        var container =
            histogram_svg.append('g')
                .classed('container', true)
                .attr('transform', `translate(` + 0 + `,` + 0 + `)`);

        var x_scale = d3.scaleLinear()
                          .domain(d3.extent(
                              input,
                              function(d) {
                                return d.x
                              }))
                          .range([0, width])
                          .nice();

        var histogram = d3.bin()
                            .value(x_accessor)
                            .domain(x_scale.domain())
                            .thresholds(input.length);

        const bin_set = histogram(input);
        console.log(bin_set);

        var y_scale =
            d3.scaleLinear()
                .domain(
                    [d3.min(bin_set, y_accessor), d3.max(bin_set, y_accessor)])
                .range([height, 0])
                .nice();

        container.append('g')
            .classed('bars', true)
            .selectAll('rect')
            .data(bin_set)
            .join('rect')
            .attr('width', (d) => d3.max([0, x_scale(d.x1) - x_scale(d.x0)]))
            .attr('height', (d) => height - y_scale(y_accessor(d)))
            .attr('y', (d) => y_scale(y_accessor(d)))
            .attr('x', (d) => x_scale(d.x0))
            .attr('fill', 'rgb(165,140,100)');

        container.append('g')
            .selectAll('text')
            .data(bin_set)
            .join('text')
            .attr(
                'x', (d) => x_scale(d.x0) + (x_scale(d.x1) - x_scale(d.x0)) / 2)
            .attr('y', (d) => y_scale(y_accessor(d)) - 10)
            .text(y_accessor);

        // var x_axis =
        // histogram_svg.append("g").attr("class","x_axis").attr("transform","translate(0,"+height+")").call(d3.axisBottom(x_scale).tickSizeOuter(0));
        var x_axis = d3.axisBottom(x_scale);
        var x_axis_group = container.append('g').style(
            'transform', 'translateY(' + height + 'px)');
        x_axis_group.call(x_axis);
        var y_axis = histogram_svg.append('g')
                         .attr('class', 'y_axis')
                         .call(d3.axisLeft(y_scale).tickSizeOuter(0));
      }

  useEffect(() => {
    setLoading(true);
    if (input) {
      initialize_plot(handle_data(input));
    }
  }, [input]);

  // Render the svg
    return ( 
        <>
            {inputHndl}
            <Box
                sx={{
    minWidth: 200, minHeight: 100, backgroundColor: 'white', padding: 2,
        borderRadius: 2, alignItems: 'center', alignTest: 'center',
                }}
            >
                <Typography variant='h7'>Histogram Node</Typography>
                <div id="histogram-root"/>
            </Box>
        </>
    );
}