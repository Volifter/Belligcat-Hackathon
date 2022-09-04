# Graphinator - User Manual

## Overview
Graphinator is a network generation and visualisation tool available in the form
of a web app.

Its main functionalities include:
* Adding, editing and removing nodes and edges
* Navigating the graph by moving and scaling
* Expanding the graph via different scraping modules
* Exporting the graph in `SVG` format

## Interface
The Graphinator interface is composed of 3 parts: one visualization window and
two side panels that can be unfolded by clicking the little arrows on the left
and right sides of the page or by hitting the `[` and `]` keys.

The left side panel is in charge of the global graph operations, whereas the
right one acts as an inspector of the currently selected node.

## Navigation
The nodes and the graph can be navigated by dragging them with the mouse, and
the scrolling controls the scale.

Nodes can be selected either by clicking on a single node, or holding Shift and
selecting multiple nodes at once.

## Components
In Graphinator, every node has a list of components that can be attached to it.
Except for the position component, any component can be added or removed from
the node by selecting it from the `New component` menu or by clicking the delete
icon on it.

Each component defines a number of attributes of its node.\
For example, the
`Position` component accounts for the `x` and `y` coordinates of the node on the
graph, the `Edges` component defines the edges (or "arrows") that will point
from its node to other nodes, the `Twitter` component defines the Twitter
account that is linked to its node, etc.

*If you are familiar with the Unreal Engine or Unity editors, this is a very
similar principle.*

This approach allows the nodes to hold as much or as few data as needed, while
remaining extensible by different modules.

## Modules
A module corresponds to a family of components linked by a common purpose.
Each module can have its own action menu on the global (left) sidebar and any
number of components that can be used by nodes.
