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
      .range([0, dimensions.ctrWidth])

  const yScale = d3.scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([0, dimensions.ctrHeight])
  
  // Draw Circles
  ctr.selectAll('circle')
      .data(dataset)
      .join('circle')
      .attr('cx', d => xScale(xAccessor(d)))
      .attr('cy', d => yScale(yAccessor(d)))
      .attr('r', 5)
      .attr('fill', 'red')
}

draw()