async function draw() {
  // Data
  let dataset = await d3.json('data.json')

  // Dimensions
  const dimensions = {
    width: 800,
    height: 800
  }

  // Draw Image
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)
}

draw()