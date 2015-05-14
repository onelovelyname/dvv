// Progress Circle

// general style for progress circle
var color = '#E1499A';
var radius = 100;
var border = 5;
var padding = 30;
var twoPi = Math.PI * 2;
var formatPercent = d3.format('.0%');
var boxSize = (radius + padding) * 2;

// set up arc
var arc = d3.svg.arc()
    .startAngle(0)
    .innerRadius(radius)
    .outerRadius(radius - border);

// get reference to parent container 
var parent = d3.select('div#progressBox');

// append svg to parent container
var svg = parent.append('svg')
    .attr('width', boxSize)
    .attr('height', boxSize);

// set up blur effect
var defs = svg.append('defs');

var filter = defs.append('filter')
    .attr('id', 'blur');

filter.append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', '7');

// append group to svg
var g = svg.append('g')
    .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');

// append progress meter to group
var meter = g.append('g')
    .attr('class', 'progress-meter');

// append circle path
meter.append('path')
    .attr('class', 'background')
    .attr('fill', '#ccc')
    .attr('fill-opacity', 0.5)
    .attr('d', arc.endAngle(twoPi));

// append outer blur effect
var foreground = meter.append('path')
    .attr('class', 'foreground')
    .attr('fill', color)
    .attr('fill-opacity', 1)
    .attr('stroke', color)
    .attr('stroke-width', 5)
    .attr('stroke-opacity', 1)
    .attr('filter', 'url(#blur)');

// append inner meter
var front = meter.append('path')
    .attr('class', 'foreground')
    .attr('fill', color)
    .attr('fill-opacity', 1);

// Percentage complete display
var numberText = meter.append('text')
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em');


// update progress display 
function updateProgress(data) {
    //console.log(data);
    foreground.attr('d', arc.endAngle(twoPi * data.progress));
    front.attr('d', arc.endAngle(twoPi * data.progress));
    numberText.text(formatPercent(data.progress));
    displayProgress(data.redGrayCounter);
}

var displayProgress = function(counter) {
  var data = [
    { label: 'red', count: counter[0] },
    { label: 'non-red', count: counter[1] }
  ];
  console.log(data);
  var width = 200;
  var height = 200;
  var radius = Math.min(width, height) / 2;
  var donutWidth = 20;
  var legendRectSize = 20;
  var legendSpacing = 5;
  var color = d3.scale.ordinal().range(['#d62728', '#7f7f7f']);

   d3.select('div#semicircleResults svg').remove();
   d3.select('.progress-heading').remove();

d3.select('div#semicircleResults')
  .append('div')
  .attr('class', 'progress-heading')
  .text('Thanks for helping us process our image!');

  var svg = d3.select('div#semicircleResults')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('display', 'block')
    .style('margin', '0 auto')
    .style('position', 'absolute')
    .style('top', '400px')
    .style('right', '50px')
    .append('g')
    .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');



  var arc = d3.svg.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  var pie = d3.layout.pie()
    .value(function(d) {
      return d.count;
    })
    .sort(null);

  var path = svg.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i){
      // 'd' here refers to an object with data, value, startAngle, endAngle, and padAngle properties
      return color(d.data.label);
    });

  path.on('mouseover', function(d) {
    var total = counter[0] + counter[1];
    var percent = Math.round(1000 * (d.data.count / total) / 10);
    tooltip.select('.toolTipLabel').html(d.data.label);
    tooltip.select('.count').html(d.data.count);
    tooltip.select('.percent').html(percent + "%");
    tooltip.style('display', 'block');
  });

  path.on('mousemove', function() {
    tooltip.style({
      top: (d3.event.pageY-10)+'px',
      left: (d3.event.pageX+10)+'px'
    });
  });

  path.on('mouseout', function(d) {
    tooltip.style('display', 'none');
  });

  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i){
      var height = legendRectSize + legendSpacing;
      var offset = height * color.domain().length / 2;
      var horz = -2 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; })
    .attr('fill', '#fff');

  var tooltip = d3.select('div#semicircleResults')
    .append('div')
    .attr('class', 'tooltip');

  tooltip.append('div')
    .attr('class', 'toolTipLabel');

  tooltip.append('div')
    .attr('class', 'count');

  tooltip.append('div')
    .attr('class', 'percent');



};



















