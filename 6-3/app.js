async function draw() {
  // Data
  const dataset = await d3.json('data.json')

  const xAccessor = d => d.currently.humidity

  // Dimensions
  let dimensions = {
    width: 800,
    height: 400,
    margins: 50
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  // Scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.ctrWidth])
    .nice()
  
  const bin = d3.bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(10)
  
  const newDataset = bin(dataset)
  const padding = 1

  // console.log({original: dataset, new: newDataset})
  
  // Draw Bars
  ctr.selectAll('rect')
    .data(newDataset)
    .join('rect')
    .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0)]) - padding)
    .attr('height', 100)
    .attr('x', d => xScale(d.x0))
    .attr('y', 0)
}

draw()