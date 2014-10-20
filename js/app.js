function drawPieChart(id,data){
  
  var color = d3.scale.category20c();
  var width = 250;
  var height = 250;
  var r = width/2;
  
  var vis = d3.select('#'+id)
    .append("svg:svg")
    .data([data])
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("transform", "translate(" + r + "," + r + ")");
    
    var pie = d3.layout.pie()
                .value(function(d){return d.value;});

    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
    arcs.append("svg:path")
        .attr("fill", function(d, i){
            return color(i);
        })
        .attr("d", function (d) {
            // log the result of the arc generator to show how cool it is :)
            //console.log(arc(d));
            return arc(d);
        });

    // add the text
    arcs.append("svg:text").attr("transform", function(d){
          d.innerRadius = 0;
          d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
        return data[i].label;}
        );

}


function showData(id){
  
  var humanInfo = $("#human-info");
  var techInfo = $("#tech-info");
  
  humanInfo.empty();
  techInfo.empty();
  
  $("#human-info").append("<h2> Social/Human info on " + $("#"+id).attr("path-name") + "</h2>");
  d3.json("res/test_data_hs.json",function(data) {
    
    drawPieChart("human-info",data[0].data);
    
  });
  
  techInfo.append("<h2> Technical info on " + $("#"+id).attr("path-name") + "</h2>");
  d3.json("res/test_data_tech.json",function(data) {
    
    drawPieChart("tech-info",data[0].data);
  
  });
  
}

function highlightGroup(id){

  var cl = $("#"+id).attr("class");
  d3.selectAll("."+cl)
    .attr("stroke","blue");

}

function highlightSegment(id){
    
  d3.select("#"+id)
    .attr("stroke","red")
    .attr("opacity",1)
    .attr("stroke-width",5)
    .append("svg:title");   
    
      
}

function clearAllHighlights(id){
  
  
  d3.select("#"+id)
    .attr("stroke","black")
    .attr("opacity",0)
    .attr("stroke-width",15); 
}

function drawPath(start, points){
  var path = start + " ";
      for (var i = 0; i < points.length; i++) {
        path += points[i].x + "," + points[i].y + " ";
      }
    return path;
}

var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>"+d.boundary+"</strong>";
            });


function buildMap(){
  
  var width = 1600;
  var height = 1500; 
  

   
  var lineFunction = d3.svg.line()
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; })
                         .interpolate("linear");
                         
    
  var scaleX = d3.scale.linear()
                       .domain([-600,600])
                       .range([0,width]);
  
  var scaleY = d3.scale.linear()
                        .domain([-600,600])
                        .range([0,height]);
                                      

        
  var canvas = d3.select("#map")
                     .append("svg")
                     .attr("width",width)
                     .attr("height",height);
                     
  canvas.append("svg:image")
   .attr('x',-90)
   .attr('y',70)
   .attr('width', 1545)
   .attr('height', 845)
   .attr("xlink:href","res/bg.png");
  
  canvas.call(tip);
  
  d3.json("res/data.json",function(data) {
            
       

    canvas.selectAll("path") //get an empty selector (as there are no polygons)
          .data(data) //join an array of data with the current selection
          .enter() //selection is split up into enter(), update(), exit()
            .append("path")
            .attr("d", function(d) { return drawPath(d["type"],d["data"]) + ' Z'} )
            .attr("id", function(d) { return d["tag"]; } )
            .attr("class", function(d) { return d["group"];} )
            .on('click', function(d) { showData(d["tag"]); })
            .on('mouseenter', function(d) { tip.show(d); highlightSegment(d["tag"]); } )  
            .on('mouseleave', function(d) { tip.hide(d); clearAllHighlights(d["tag"]); })
            .attr("stroke","black")
            .attr("path-name", function(d) { return d["boundary"]; } )
            .attr("fill","none")
            .attr("opacity",0)
            .attr("stroke-width",15); 
        
        
  });


}