import * as d3 from 'd3';

import createAdjacencyMatrix from './chart';

import '../index.html';

d3.json('./data/fragebogen10-graph.json', createAdjacencyMatrix);
