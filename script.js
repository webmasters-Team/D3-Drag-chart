let w = 800,
		h = 400,
		padding = 25,
		dataset = [
				[10, 10],
				[20, 50],
				[30, 40],
				[40, 80],
				[50, 90],
				[60, 50],
				[70, 70],
				[80, 60],
				[90, 10],
				[100, 50],
				[110, 40],
				[120, 70],
				[130, 20],
				[140, 40],
				[150, 30]
		]

/*create svg element*/
let svg = d3.select('body')
		.append('svg')
		.attr('width', w)
		.attr('height', h)
		.attr('id', 'chart')

let drag = d3.behavior.drag()
		.on("dragstart", dragstarted)
		.on("drag", dragged)
		.on("dragend", dragended)

/*x scale*/
let xScale = d3.scale.linear()
		.domain([0, d3.max(dataset, d => d[0])])
		.range([padding, w - padding]);

/*y scale*/
let yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, d => d[1])])
		.range([h - padding, padding]);

/*x axis*/
let xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom');

/*append x axis*/
svg.append('g')
		.attr({
				'class': 'xaxis',
				'transform': `translate(0, ${h - padding})`
		})
		.call(xAxis)

/*y axis*/
let yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')

/*append y axis*/
svg.append('g')
		.attr({
				'class': 'yaxis',
				'transform': `translate(${padding}, 0)`
		})
		.call(yAxis)

/*define line*/
let lines = d3.svg.line()
		.x(d => xScale(d[0]))
		.y(d => yScale(d[1]))
		.interpolate('monotone')

/*append line*/
let path = svg.append('path')
		.attr({
				'd': lines(dataset),
				'class': 'lineChart'
		});

svg.select('.lineChart')
		.style('opacity', 0)
		.transition()
		.duration(2500)
		.delay(1000)
		.style('opacity', 1)

/*add points*/
let points = svg.selectAll('circle')
		.data(dataset)
		.enter()
		.append('circle')
		.call(drag)

/*point attributes*/
points.attr('cy', 0)
		.transition()
		.duration(1500)
		.delay((d, i) => (i * 100) + 500)
		.ease('elastic')
		.attr({
				'cx': d => xScale(d[0]),
				'cy': d => yScale(d[1]),
				'r': 7,
				'class': 'datapoint',
				'id': (d, i) => i
		})
		.style('opacity', 1)

let xMax = d3.max(dataset, d => d[0]),
		yMax = d3.max(dataset, d => d[1])

function dragstarted() {
		d3.event.sourceEvent.stopPropagation()
		d3.select(this).classed("dragging datapoint", true)
}

function dragged() {
		d3.select(this)
				.attr({
						'cx': Math.max(padding, Math.min(d3.event.x, w - padding)),
						'cy': Math.max(padding, Math.min(d3.event.y, h - padding))
				})
}

function dragended() {
		d3.select(this).classed("datapoint", true)
				// get id of dragged point 		
		let id = d3.select(this).attr('id'),
				// get new absolute position coordinates of the point 				
				xPos = d3.select(this).attr('cx'),
				yPos = h - d3.select(this).attr('cy')

		// convert absolute position coordinates relative to scales
		xPos = (xPos - padding) * (xMax / (w - (padding * 2)))
		yPos = (yPos - padding) * (yMax / (h - (padding * 2)))
		dataset[id][0] = xPos
		dataset[id][1] = yPos

		// update line
		svg.select('.lineChart')
				.transition()
				.duration(500)
				.attr('d', lines(dataset))
}