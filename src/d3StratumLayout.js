import * as d3 from 'd3';

export default function() {
  let data = {},
      size = [1, 1],
      nodes = [];

  function strata() {
    // console.log('Hello');
    console.log(data);
    const levels = Object.keys(data).length,
          floorHeight = Math.ceil(size[1] / levels);

    const keys = Object.keys(data).sort((a,b) => parseInt(a) - parseInt(b))
    for (var i = keys.length - 1; i >= 0; i--) {
      nodes.push({
        x : size[0] / 2,
        y : floorHeight * (keys.length - i) + floorHeight / 2,
        level : i,
        name : data[keys[i]][0]
      });
    }
    // console.log('Hello');
    // console.log(data)
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
