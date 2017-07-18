
import * as d3 from 'd3';
import * as adjacencyMatrixLayout from 'd3-ajacency-matrix-layout'
import * as _ from 'underscore';
import Grid from 'd3-v4-grid';

export default function (data) {
          
            const svg = d3.select("svg"),
              size = canvasSize('svg'),
              width = size[0],
              height = size[1];

            const adjacencyMatrix = adjacencyMatrixLayout.adjacencyMatrixLayout();

            const matrixSize = [.6 * size[1], .6 * size[1]];
            const conceptsSize = [0.5 * size[1], size[1]]

            console.log(size, matrixSize, conceptsSize); 

                
            adjacencyMatrix
                .size(matrixSize)
                .nodes(data.nodes)
                .links(data.links)
                .directed(false)
                .nodeID(d => d.id);

            const matrixData = adjacencyMatrix();


            // const someColors = d3.scaleOrdinal()
            //     .range(d3.schemeCategory20b);

            const someColors = d3.scaleThreshold()
                                .domain([0, 1, 2])
                                .range(["white", "blue", "red"]);

            const defaultOpacity = (d) => {
                return 0.15 + 0.2 * d.weight;
            };


            d3.select('svg')
                .append('g')
                  .attr('transform', 'translate(80, 360)rotate(-45)')
                  .attr('id', 'adjacencyG')
                  .selectAll('rect')
                  .data(matrixData)
                  .enter()
                  .append('rect')
                    .attr('width', d => d.width)
                    .attr('height', d => d.height)
                    .attr('x', d => d.x)
                    .attr('y', d => d.y)
                    .style('stroke', 'black')
                    .style('stroke-width', '1px')
                    .style('stroke-opacity', .1)
                    .style('fill', d => someColors(d.weight))
                    .style('fill-opacity', defaultOpacity)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout);

            d3.select('#adjacencyG')
                .call(adjacencyMatrix.xAxis);

            // d3.select('g.am-xAxis.am-axis')
            //   .selectAll('text')
            //     .attr('transform', 'translate(10, -20)rotate(-90)');

            d3.select('#adjacencyG')
                .call(adjacencyMatrix.yAxis);

            const extractedConcepts = data.nodes.map((d) => d.concepts).reduce((a, b) => a.concat(b))

            const conceptsMap = {};
            extractedConcepts.forEach((d) => {
              if (conceptsMap.hasOwnProperty(d))
                conceptsMap[d] += 1;
              else
                conceptsMap[d] = 1
            })

            console.log(reverseMapFromMap(conceptsMap));

            const concepts = Array.from(new Set(extractedConcepts));
            
            const conceptsData = concepts.map(function (d) { return {concept : d}});

            console.log(conceptsData);
            const grid = Grid()
                          .data(conceptsData)
                          .size(conceptsSize);
            grid.layout();

            const nodeSize = grid.nodeSize();

            d3.select('svg')
                .append('g')
                    .attr('transform', `translate(${matrixSize[0] + 350}, 80)`)
                    .attr('id', 'conceptsG')
                    .selectAll('g')
                    .data(grid.nodes())
                    .enter()
                    .append('g')
                      // .append('rect')
                      //   .attr('x', (d) => d.x)
                      //   .attr('y', (d) => d.y)
                      //   .style('stroke', 'black')
                      //   .style('stroke-width', '1px')
                      //   .style('stroke-opacity', .9)
                      //   .attr('width', d => nodeSize[0])
                      //   .attr('height', d => nodeSize[1])
                      .append("text")
                          .attr("x", (d) => d.x)
                          .attr("y", (d) => (d.y + nodeSize[1]) / 2) 
                          .attr("dy", ".35em")
                          .text(function(d) { console.log(d); return d.concept; });

            function mouseover(p) {
                d3.selectAll("rect")
                    .classed("active", (d, i) => { return d.y == p.y || d.x == p.x; })
                    .style('fill-opacity', (d, i) => { 
                        return d.y == p.y || d.x == p.x ? 0.20 + 0.3 * d.weight : defaultOpacity(d)
                });
            }

            function mouseout() {
                d3.selectAll("rect")
                    .classed("active", false)
                    .style('fill-opacity', defaultOpacity);
            }

            function id(x) {return x;};

            function reverseMapFromMap(map, f) {
              return Object.keys(map).reduce(function(acc, k) {
                acc[map[k]] = (acc[map[k]] || []).concat((f || id)(k))
                return acc
              },{})
            }

            function mapFromReverseMap(rMap, f) {
              return Object.keys(rMap).reduce(function(acc, k) {
                rMap[k].forEach(function(x){acc[x] = (f || id)(k)})
                return acc
              },{})
            }
};


const canvasSize = (targetElement) => {
                var height = parseFloat(d3.select(targetElement)
                .node().clientHeight);
                var width = parseFloat(d3.select(targetElement).node().clientWidth);
                return [width,height];
          };