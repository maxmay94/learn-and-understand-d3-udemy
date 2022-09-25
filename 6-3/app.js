async function draw() {
  // Data
  const dataset = await d3.json('data.json')

  // Dimensions
  let dimensions = {
    width: 800,
    height: 400,
    margins: 50
  }

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

  // console.log({original: dataset, new: newDataset})
  
  const labelsGroup = ctr.append('g')
    .classed('bar-labels', true)

  const xAxisGroup = ctr.append('g')
    .style('transform', `translateY(${dimensions.ctrHeight}px)`)

  function histogram(metric) {

    const xAccessor = d => d.currently[metric]
    const yAccessor = d => d.length

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

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(newDataset, yAccessor)])
      .range([dimensions.ctrHeight, 0])
      .nice()

    // Draw Bars
    ctr.selectAll('rect')
      .data(newDataset)
      .join('rect')
      .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0)]) - padding)
      .attr('height', d => dimensions.ctrHeight - yScale(yAccessor(d)))
      .attr('x', d => xScale(d.x0))
      .attr('y', d => yScale(yAccessor(d)))
      .attr('fill', '#01c5c4')

    labelsGroup.selectAll('text')
      .data(newDataset)
      .join('text')
      .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr('y', d => yScale(yAccessor(d)) - 10)
      .text(yAccessor)

    // Draw Axis
    const xAxis = d3.axisBottom(xScale)
    
    xAxisGroup.call(xAxis)
  }
  
  // Event Listener
  d3.select('#metric').on('change', function(e) {
    e.preventDefault()

    histogram(this.value)
  })

  histogram('humidity')
}

draw()