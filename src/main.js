import * as d3 from 'd3';

import createChart from './chart';

import '../index.html';

d3.json('./data/fragebogen10-graph.json', createChart);
