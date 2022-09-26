async function draw() {
  // Data
  const dataset = await d3.csv('data.csv', (d) => {
    d3.autoType(d)
    return d
  })

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 600,
    margins: 20,
  }

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g")
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  // Scales
  const stackGenerator = d3.stack()
    .keys(dataset.columns.slice(1))

  const stackData = stackGenerator(dataset).map((ageGroup) => {
    ageGroup.forEach(state => {
      state.key = ageGroup.key
    })
    return ageGroup
  })

  const yScale = d3.scaleLinear()
    .domain([
      0, d3.max(stackData, (ag) => {
        return d3.max(ag, (state) => state[1])
      })
    ])
    .rangeRound([dimensions.ctrHeight, dimensions.margins])
  
  const xScale = d3.scaleBand()
    .domain(dataset.map(state => state.name))
    .range([dimensions.margins, dimensions.ctrWidth])

  const colorScale = d3.scaleOrdinal()
    .domain(stackData.map(d => d.key))
    .range(d3.schemeSpectral[stackData.length])
    .unknown('#ccc')
  
  // Draw Bars
  const ageGroups = ctr.append('g')
    .classed('age-groups', true)
    .selectAll('g')
    .data(stackData)
    .join('g')
    .attr('fill', d => colorScale(d.key))

  ageGroups.selectAll('rect')
    .data((d) => d)
    .join('rect')
    .attr('x', d => xScale(d.data.name))
    .attr('y', d => yScale(d[1]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => yScale(d[0]) - yScale(d[1]))

  // Axis
  const xAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale)
    .ticks(null, 's')
  
  ctr.append('g')
    .attr('transform', `translate(0, ${dimensions.ctrHeight})`)
    .call(xAxis)

  ctr.append('g')
    .attr('transform', `translate(${dimensions.margins}, 0)`)
    .call(yAxis)

  // Chart Title
  d3.select('#chart-title')
    .text('Populations Of States By Age Range')
    .style('font-family', 'sans-serif')
    .style('text-decoration', 'underline')
    .style('text-align', 'center')
}

draw()