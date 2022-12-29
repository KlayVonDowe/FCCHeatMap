const h = 500
const w = 900
const p = 60
const colors = ['lightblue','aquamarine','blue',   'violet',  'yellow', 'orange', 'red','maroon']
const svg = d3.selectAll('body').append('svg').attr('height', h).attr('width', w).style('margin', 150)

//var threshold = d3.quantize().domain([]).range(['blue','lightblue', 'aquamarine', 'white','beige', 'yellow','orange','red'])

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
    var temp = data.baseTemperature
    var Data = data.monthlyVariance.map(function (items) {
      return items
    })
    var Year = data.monthlyVariance.map(function (items) {
      return new Date(items.year)
    })
    console.log(Data)

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
        tooltip.transition()
          .style('visibility', 'visible')
          .attr('data-year', d.year)
        let monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

        tooltip.html("Year: " + d.year + '<br>' + "Month: " + monthNames[d.month - 1] + ' : ' + d.variance)
      })
      .on('mouseout', (d) => {
        tooltip.transition()
          .style('visibility', 'hidden')
      });

      const legend = d3
      .select("body")
      .append("svg")
      .attr("id", "legend")
      .attr("width", 800)
      .attr("height", 50);

      legend.selectAll('rect').data(colors).enter().append('rect').attr("x", (_, i) => i * 50)
      .attr("y", 0)
      .attr("width", 50)
      .attr("height", 50)
      .attr("fill", (c) => c);


    var tooltip = d3.select("body").data(Data)
      .append("div")
      .attr("class", "toolTip")
      .attr("id", "tooltip")
      .attr('data-year', (d) => d.year);


    const xAxis = d3.scaleLinear().domain([d3.min(Data.map((d) => d.year)), d3.max(Data.map((d) => d.year))]).range([60, w - p])
    const bottomAxis = d3.axisBottom(xAxis).tickFormat(d3.format('d'))
    svg.append('g').attr('id', 'x-axis').attr('transform', 'translate(0,' + (h - 60) + ')').call(bottomAxis)

    const yAxis = d3.scaleBand().domain(Data.map((d) => d.month)).range([60, h - p])
    const leftAxis = d3.axisLeft(yAxis).tickFormat(function (month) {
      var date = new Date(0);
      date.setUTCMonth(month);
      var format = d3.timeFormat('%B');
      return format(date);
    })
    svg.append('g').attr('id', 'y-axis').attr('transform', 'translate(60,0)').call(leftAxis)

  })