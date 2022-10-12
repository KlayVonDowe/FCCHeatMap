const h  = 500
const w = 900
const p = 60

const svg = d3.selectAll('body').append('svg').attr('height',h).attr('width',w).style('margin',150)

//var threshold = d3.quantize().domain([]).range(['blue','lightblue', 'aquamarine', 'white','beige', 'yellow','orange','red'])

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then(response => response.json())
.then(data =>{
    var temp = data.baseTemperature
    var Data = data.monthlyVariance.map(function(items){
        return items
    })
    var Year = data.monthlyVariance.map(function(items){
        return new Date(items.year)
    })
    console.log(Data)

    const xScale = d3.scaleBand().domain(Data.map((d) => d.year)).range([60,w-p])
    const yScale = d3.scaleBand().domain(Data.map((d) => d.month)).range([60,h-p])

    svg.selectAll('rect').data(Data).enter().append('rect')
    .attr('x',(d) => xScale(d.year))
    .attr('y',(d) => yScale(d.month))
    .attr('width',(d) => xScale.bandwidth(d.year))
    .attr('height', (d) => yScale.bandwidth(d.month))
    .attr('data-year',(d) => d.year)
    .attr('data-month',(d) => d.month)
    .attr('data-temp',(d) => (temp - (d.variance)))
    .attr('class','cell')
    .attr('fill', (item) => {
        let variance = item['variance']
        if(variance <= -1){
            return 'SteelBlue'
        }else if(variance <= 0){
            return 'LightSteelBlue'
        }else if(variance <= 1){
            return 'Orange'
        }else{
            return 'Crimson'
        }
    })

    const xAxis = d3.scaleTime().domain(d3.extent(Data, (d) => d.year)).range([60, w-p])
    const bottomAxis = d3.axisBottom(xAxis)
    svg.append('g').attr('id','x-axis').attr('transform' , 'translate(0,' + (h- 60) + ')').call(bottomAxis)

    const yAxis = d3.scaleTime().domain(d3.extent(Data, (d) => d.month)).range([60, h-p])
    const leftAxis = d3.axisLeft(yAxis)
    svg.append('g').attr('id','y-axis').attr('transform','translate(60,0)').call(leftAxis)

})