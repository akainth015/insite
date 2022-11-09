# Nodes

This directory contains the index of all the implemented nodes (`nodes.js`),
as well as the actual implementations themselves (enclosed within the
`Input`, `Modification`, and `Output` folders).

## Input Nodes

Input nodes provide data without requiring any input themselves. Examples include:

-   CSV input node
-   Web-hook node
-   JSON input node

## Modification Nodes

Modification nodes modify the provided input and create new output.
Examples include:

-   Drop columns
-   Normalize columns
-   Fill missing values
-   Filter rows

## Output nodes

Output nodes can be considered the end-goal of a flow
(there can be multiple output nodes). Examples include:

-   Line graph
-   Histogram
-   Pie chart
