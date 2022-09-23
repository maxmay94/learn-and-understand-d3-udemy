async function draw() {
  // Data
  let dataset = await d3.json('data.json')

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
  
  // Draw Circle
  ctr.append('circle')
    .attr('r', 15)
}

draw()