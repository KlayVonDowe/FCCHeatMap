const h = 700
const w = 1600
const p = 60
const colors = ['blue','lightblue', 'aquamarine', 'violet', 'yellow', 'orange', 'red', 'maroon', "black"]
const svg = d3.selectAll('body').append('svg').attr('height', h).attr('width', w).attr('id','svg')
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"]

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
    var temp = data.baseTemperature
    var Data = data.monthlyVariance.map(function (items) {
      return items
    })

    const xScale = d3.scaleBand().domain(Data.map((d) => d.year)).range([60, w - p])
    const yScale = d3.scaleBand().domain(Data.map((d) => d.month)).range([60, h - p])
    const colorScale = d3.scaleQuantize().domain(d3.extent(Data.map((d) => d.variance)))
      .range(colors)

    svg.selectAll('rect').data(Data).enter().append('rect')
      .attr('x', (d) => xScale(d.year))
      .attr('y', (d) => yScale(d.month))
      .attr('width', (d) => xScale.bandwidth(d.year))
      .attr('height', (d) => yScale.bandwidth(d.month))
      .attr('data-year', (d) => d.year)
      .attr('data-month', (d) => d.month - 1)
      .attr('data-temp', (d) => (temp - (d.variance)))
      .attr('fill', (d) => colorScale(d.variance))
      .attr('class', 'cell')
      .on('mouseover', (d) => {
        tooltip
          .style('visibility', 'visible')
          .attr('data-year', d.year)
          .style("left", d3.event.pageX - 60 + "px")
          .style("top", d3.event.pageY - 100 + "px")

        .html("Year: " + d.year + '<br>' + "Month: " + monthNames[d.month - 1] + ' : ' + d.variance + '<br>' + 'Temp:' + (temp + d.variance))
      })
      .on('mouseout', (d) => {
        tooltip
          .style('visibility', 'hidden')
      })
      ;

    const legend = d3
      .select("body")
      .append("svg")
      .attr("id", "legend")
      .attr("width", w)
      .attr("height", 60);

    legend.selectAll('rect').data(colors).enter().append('rect')
    .attr("x", (i,d) => d *60)
      .attr("y", 0)
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", (d) => d)
      .attr('transform', 'translate(' + (w / 3) + ',' + (0) + ')');


    var tooltip = d3.select("body")
    .append('div')
      .attr("class", "tooltip")
      .attr("id", "tooltip");

    const legendxAxis = d3.scaleLinear().domain([d3.min(Data.map((d) => d.variance + temp)), d3.max(Data.map((d) => d.variance + temp))]).range([0,60*9])
    const legendAxis = d3.axisBottom().scale(legendxAxis).tickSize(10, 0)
    .tickValues(d3.range(1.684, 13.888,(13.888 - 1.684) / 9))
    .tickFormat(d3.format('.1f'));

    const xAxis = d3.scaleLinear().domain([d3.min(Data.map((d) => d.year)), d3.max(Data.map((d) => d.year))]).range([60, w - p])
    const bottomAxis = d3.axisBottom(xAxis).tickFormat(d3.format('d'))
    

    const yAxis = d3.scaleBand().domain(Data.map((d) => d.month)).range([60, h - p])
    const leftAxis = d3.axisLeft(yAxis).tickFormat(function (month) {
      var date = new Date(0);
      date.setUTCMonth(month);
      var format = d3.timeFormat('%B');
      return format(date);
    })

    svg.append('g').attr('id', 'y-axis').attr('transform', 'translate(60,0)').call(leftAxis)
    .append('text').text('Months').style('text-anchor', 'left').attr('transform', 'translate(-50,' + (h/2) + ')' + 'rotate(-90)').attr('fill','black')
    svg.append('g').attr('id', 'x-axis').attr('transform', 'translate(0,' + (h - 60) + ')').call(bottomAxis).append('text').text('Years').style('text-anchor', 'middle')
    .attr('transform', 'translate(' +(w/2) + ',' + 30 + ')').attr('fill','black')
    legend.append('g').attr('transform', 'translate(' + (w/3) + ',' + (20) + ')').call(legendAxis)
  })