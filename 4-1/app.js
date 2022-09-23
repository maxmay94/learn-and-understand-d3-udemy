async function draw() {
  // Data
  let dataset = await d3.json('data.json')

  const xAccessor = (d) => d.currently.humidity
  const yAccessor = (d) => d.currently.apparentTemperature

  // Dimensions
  const dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    }
  }

  dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right

  dimensions.ctrHeight = dimensions.width - dimensions.margin.top - dimensions.margin.bottom

  // Draw Image
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  // Add Margin To Container
  const ctr = svg.append('g')
    .attr(
      'transform', 
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
      )
  
  //Scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .rangeRound([0, dimensions.ctrWidth])
    .clamp(true)

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .rangeRound([0, dimensions.ctrHeight])
    .nice()
    .clamp(true)
  
  // Draw Circles
  ctr.selectAll('circle')
    .data(dataset)
    .join('circle')
    .attr('cx', d => xScale(xAccessor(d)))
    .attr('cy', d => yScale(yAccessor(d)))
    .attr('r', 5)
    .attr('fill', 'red')

  // Axes
  const xAxis = d3.axisBottom(xScale)
  
  const xAxisGroup = ctr.append('g')
    .call(xAxis)
    .style('transform', `translateY(${dimensions.ctrHeight}px)`)
    .classed('axis', true)
  
  xAxisGroup.append('text')
    .attr('x', dimensions.ctrWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .text('Humidity')
  
  const yAxis = d3.axisLeft(yScale)

  const yAxisGroup = ctr.append('g')
    .call(yAxis)
    .classed('axis', true)

  yAxisGroup.append('text')
    .attr('x', -dimensions.ctrHeight / 2)
    .attr('y', -dimensions.margin.left + 15)
    .attr('fill', 'black')
    .html('Temperature &deg; F')
    .style('transform', 'rotate(270deg)')
    .style('text-anchor', 'middle')
}

draw()