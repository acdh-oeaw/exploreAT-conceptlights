
import * as d3 from 'd3';
import * as adjacencyMatrixLayout from 'd3-adjacency-matrix-layout';
import stratumLayout from './d3StratumLayout';
import * as scaleChromatic from 'd3-scale-chromatic';
// import Grid from 'd3-v4-grid';

export default function (data) {
            // console.log(`There are ${} associations`, )
            console.log(scaleChromatic);
            const svg = d3.select("svg"),
              size = canvasSize('svg'),
              width = size[0],
              height = size[1];

            const mside = (0.9 * size[1]) / Math.sqrt(2);
            //hyp = sqrt(2)*c
            const matrixSize = [mside, mside]

            const adjacencyMatrix = adjacencyMatrixLayout.adjacencyMatrixLayout();

            const conceptsSize = [size[0] - 250 - 0.9 * size[1], 0.9 * size[1]]

            // console.log(size, matrixSize, conceptsSize); 

            adjacencyMatrix
                .size(matrixSize)
                .nodes(data.nodes)
                .links(data.links)
                .edgeWeight(d => d.weight)
                .directed(false)
                .nodeID(d => d.id);

            const matrixData = adjacencyMatrix();


            // const someColors = d3.scaleOrdinal()
            //     .range(d3.schemeCategory20b);
            // const someColors = d3.scaleThreshold()
            //                     .domain(d3.extent(data.links, (d) => d.weight))
            //                     .range(["white", "blue", "red"]);

            const someColors = d3.scaleSequential(scaleChromatic.interpolateReds).domain([0, d3.max(data.links, (d) => d.weight)]);

            // console.log(someColors(0), someColors(1),someColors(2),someColors(3),someColors(4));

            // const defaultOpacity = (d) => {
            //     return 0.3 + 0.2 * d.weight;
            // };



            d3.select('svg')
                .append('g')
                  .attr('transform', `translate(20, ${size[1] / 2})rotate(-45)`)
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
                    .style('fill-opacity', 0.5)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("click", function(p) {
                      const data = d3.select(this).data()[0];
                      console.log(data);
                      const setA = new Set(data.source.concepts),
                            setB = new Set(data.target.concepts);
                      var intersection = new Set([...setA].filter(x => setB.has(x)));
                      console.log(setA, setB, Array.from(intersection));
                    });

            d3.select('#adjacencyG')
                .call(adjacencyMatrix.xAxis);

            // d3.select('g.am-xAxis.am-axis')
            //   .selectAll('text')
            //     .attr('transform', 'translate(10, -20)rotate(-90)');

            d3.select('#adjacencyG')
                .call(adjacencyMatrix.yAxis);

             function mouseover(p) {
                d3.selectAll("rect")
                    .classed("active", (d, i) => { return d.y == p.y || d.x == p.x; })
                    .style('fill-opacity', (d, i) => { 
                        return d.y == p.y || d.x == p.x ? 1 : 0.5;
                });
            }

            function mouseout() {
                d3.selectAll("rect")
                    .classed("active", false)
                    .style('fill-opacity', 0.5);
            }

            const extractedConcepts = data.nodes.map((d) => d.concepts).reduce((a, b) => a.concat(b))

            const conceptsMap = {};
            extractedConcepts.forEach((d) => {
              if (conceptsMap.hasOwnProperty(d))
                conceptsMap[d] += 1;
              else
                conceptsMap[d] = 1
            })

            const reversedConceptsMap = reverseMapFromMap(conceptsMap);

            console.log(reversedConceptsMap, conceptsMap);



            const concepts = Array.from(new Set(extractedConcepts));
            
            // const conceptsData = concepts.map(function (d) { return {concept : d}});

            // console.log(conceptsData);
            // const grid = Grid()
            //               .data(conceptsData)
            //               .size(conceptsSize);
            // grid.layout();

            // const nodeSize = grid.nodeSize();

            const stratum = stratumLayout()
                              .data(data.coincident_groups)
                              .size([size[1] / 2, 1300]);


            const stratumData = stratum();

            console.log(stratumData);
            d3.select('svg')
                .append('g')
                    .attr('transform', `translate(${1300 + 0.9 * size[1]}, 650)rotate(90)`)
                    .attr('id', 'conceptsG')
                    .selectAll('g')
                    .data(stratumData)
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
                      .append("circle")
                          .attr("cx", (d) => d.x)
                          .attr("cy", (d) => d.y) 
                          .attr("r", d => 1.5*d.length)
                          .style("fill", d=> someColors(d.length))
                          // .text((d) =>  d.name)
                          .on("mouseover", (c) => {
                            console.log(c.name);
                            const selection = d3.selectAll('rect').filter((d, i) => {
                              return d.weight > 0 && 
                                (d.source.concepts.includes(c.name) || 
                                  d.target.concepts.includes(c.name))
                            });
                            selection.transition()
                              .duration(250)
                              .on("start", function repeat () {
                                d3.active(this)
                                    .style("fill-opacity", 1)
                                  .transition()
                                    .style("fill-opacity", .5)
                                  .transition()
                                    .on("start", repeat);
                              })
                          })
                          .on("mouseout", (d) => {
                            console.log('out')
                            d3.selectAll("*").interrupt();
                          })
                          .on("click", function(d) {
                            console.log(`click ${d.name}`)
                            d3.selectAll("*").interrupt();
                            d3.select(this)
                              .style('fill', 'blue');
                          });

            drawLinks();

           

            function drawLinks() {

            };

            function id(x) {return x;};

            function reverseMapFromMap(map, f) {
              return Object.keys(map).reduce(function(acc, k) {
                acc[map[k]] = (acc[map[k]] || []).concat((f || id)(k))
                return acc
              },{})
            };

            function mapFromReverseMap(rMap, f) {
              return Object.keys(rMap).reduce(function(acc, k) {
                rMap[k].forEach(function(x){acc[x] = (f || id)(k)})
                return acc
              },{})
            };
};

// const makeHierarchy = (nodes) => {
//   const keys = Object.keys(nodes).sort((a,b) => parseInt(a) - parseInt(b)),
//         hierarchy = {};
//   let rootNode;

//   const rootLevel = nodes[keys[keys.length - 1]];

//   const rootObject = {
//     name : rootLevel[0]
//     level : keys.length - 1
//     children : []
//   };

//   if (rootLevel.length > 1) {
//     //Just pick one
    
//     for (let i = 1; i < rootLevel.length; i++) {
//         rootObject.children.push({
//           name : rootLevel[0]
//           level : keys.length - 1
//           children : []
//         });
//     }
//   } else {
//     rootNode = rootLevel[0]
//   }

//   keys.forEach((key, i) => {
//     const concepts = nodes[key];
//     concepts.forEach((d) => {
//       const conceptObject = {};
//       conceptObject.name = d;
//       conceptObject.level = i;
//       conceptObject.children = keys[i+1]
//     })
//   });
// };


const canvasSize = (targetElement) => {
                var height = parseFloat(d3.select(targetElement)
                .node().clientHeight);
                var width = parseFloat(d3.select(targetElement).node().clientWidth);
                return [width,height];
          };