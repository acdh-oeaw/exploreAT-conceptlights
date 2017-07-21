import * as d3 from 'd3';

export default function() {
  let data = {},
      size = [1, 1],
      nodes = [];

  function strata() {
    // console.log('Hello');
    // console.log(data);
    // const levels = Object.keys(data).length,
    //       floorHeight = Math.ceil(size[1] / levels);


    for (let key in data) {
      if (key == 1) continue;
      for (let nestedKey in data[key]) {
        data[key][nestedKey].forEach((d) => {
          nodes.push({
            occurrences : parseInt(nestedKey),
            length: parseInt(key),
            name : d.join('-')
          });
        });
      }
    }

    console.log('Size is ' + size);

    const lenghts = Object.keys(data);
    const numberOfLengths = lenghts.length;
    const floorSize = size[1] / numberOfLengths;

    // console.log(lenghts)

    let floor = 0;
    lenghts.forEach(function(bla) {
      const numberOfNodesForLength = nodes.filter(function(d) {
        // console.log(d.length, typeof(d.length))
        // console.log(bla, typeof(parseInt(bla)));
        if (d.length == parseInt(bla)) {
          return true;
        } else {
          return false;
        }
      });

      // console.log(numberOfNodesForLength);
      const boxWidth = size[0] / numberOfNodesForLength.length;
      let indent = 0;
      nodes = nodes.map(function(d) {
        if (d.length == parseInt(bla)) {
          d.x = boxWidth * indent + boxWidth /2;
          d.y = floor * floorSize + floorSize / 2;
          indent++;
        }
        return d;
      });
      floor++;
    });

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
