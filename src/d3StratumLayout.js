import * as d3 from 'd3';
import * as _  from 'underscore';

export default function() {
  let data = {},
      size = [1, 1],
      nodes = [];

  function strata() {
    // console.log('Hello');
    // console.log(data);
    // const levels = Object.keys(data).length,
    //       floorHeight = Math.ceil(size[1] / levels);

    // console.log(data);
    // console.log('Size is ' + size);

    let rows = 0;
    const minSeparation = 1;
    const minElementSize = 1;


    const sortedKeys = Object.keys(data).sort(function (keyA, keyB) {
        return data[keyA].length < data[keyB].length;
    });

    const maxElements = sortedKeys[0].length;
    const maxColumns = Math.floor(size[0] / ((minElementSize * sortedKeys.length) + minSeparation * (sortedKeys.length - 1)));

    // console.log(maxColumns);

    const gridXScale = d3.scaleLinear().domain([0, maxColumns]).range([0, size[0]]);

    let elementCounter = 0;
    let row = 0;

    sortedKeys.forEach(key => {
        data[key].forEach(element => {
            nodes.push({
                x: gridXScale(elementCounter),
                y: row,
                level: key 
            });
            elementCounter++;
            if (elementCounter % maxColumns == 0) {elementCounter = 0; row++;}
        });
        row+=2;
        elementCounter = 0;
    });

    const gridYScale = d3.scaleLinear().domain([1, row]).range([0, size[1]]);

    nodes = nodes.map(d => {
        d.y = gridYScale(d.y);
        return d;
    });


    // let mainDim, secDim = 0;
    // if (size[0] >= size[1]) {
    //     mainDim = size[0];
    //     secDim = size[1];
    // } else {
    //     mainDim = size[1];
    //     secDim = size[0];
    // }


    // gridXScale = d3.scaleLinear().domain([1, columns]).range([0, mainDim]);
    // gridYScale = d3.scaleLinear().domain([1, rows]).range([0, secDim]);

    

    // console.log(rows);


    // const numberOfElements = nodes.length;

    // console.log('There are ' + nodes.length);
    
    // rows = Math.ceil(Math.sqrt(numberOfElements)) + Object.keys(data).length;
    // const columns = Math.ceil(Math.sqrt(numberOfElements));

    

    // let cell = 0;
    // console.log(rows, columns);
    // let levelCounter = "1";
    // let isSkipping = false;
    // for (let i = 1; i <= rows; i++) {
    //     for (let j = 1; j <= columns; j++) {
    //         if (nodes[cell]) {
    //                 if (nodes[cell].level !== levelCounter){
    //                 isSkipping = true;
    //                 levelCounter = nodes[cell].level;
    //                 break;
    //             }
    //             nodes[cell].x = gridXScale(j);
    //             nodes[cell].y = gridYScale(i);
    //             levelCounter = nodes[cell].level;
    //             cell++;
    //         } else break;
    //     }
    //     if (isSkipping) {
    //         isSkipping = false;
    //         continue;
    //     }
    // }

    // data["1"].forEach(array => {
    //   nodes.push({
    //     concept: 
    //   })
    // });


    // const xScale = d3.scaleLinear().domain([0, numberOfGroups -1]).range([0, sizeLength]);


    // for (let key in data) {
    //   if (key == 1) continue;
    //   data[key].forEach((d, i) => {
    //     nodes.push({

    //     })
    //   });
    //   for (let nestedKey in data[key]) {
    //     data[key][nestedKey].forEach((d) => {
    //       nodes.push({
    //         occurrences : parseInt(nestedKey),
    //         length: parseInt(key),
    //         name : d.join('-')
    //       });
    //     });
    //   }
    // }

    

    // const lenghts = Object.keys(data);
    // const numberOfLengths = lenghts.length;
    // const floorSize = size[1] / numberOfLengths;

    // console.log(lenghts)

    // let floor = 0;
    // lenghts.forEach(function(bla) {
    //   const numberOfNodesForLength = nodes.filter(function(d) {
    //     // console.log(d.length, typeof(d.length))
    //     // console.log(bla, typeof(parseInt(bla)));
    //     if (d.length == parseInt(bla)) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });

    //   // console.log(numberOfNodesForLength);
    //   const boxWidth = size[0] / numberOfNodesForLength.length;
    //   let indent = 0;
    //   nodes = nodes.map(function(d) {
    //     if (d.length == parseInt(bla)) {
    //       d.x = boxWidth * indent + boxWidth /2;
    //       d.y = floor * floorSize + floorSize / 2;
    //       indent++;
    //     }
    //     return d;
    //   });
    //   floor++;
    // });

    // const keys = Object.keys(data).sort((a,b) => parseInt(a) - parseInt(b))
    // for (let i = keys.length - 1; i > 1; i--) {
    //   const nestedKeys = Object.keys(data[keys[i]]).sort((a,b) => parseInt(a) - parseInt(b))
    //   for (let j = nestedKeys.length -1; i > 0; i--) {
    //     data[keys[i]][nestedKeys[j]].
    //     });
    //   }
    // }
    // console.log('Hello');
    // console.log(data)
    // console.log(nodes);
    // console.log(nodes);
    return nodes;
}

  strata.data = function (x) {
    if (!arguments.length) return data;
    data = x;
    return strata;
  };

  strata.size = function (x) {
    if (!arguments.length) return size;
    size = x;
    return strata;
  };

  return strata;
}
