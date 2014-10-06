// create module for custom directives
var d3DemoApp = angular.module('d3DemoApp', []);

// controller business logic
d3DemoApp.controller('MiniMap', function AppCtrl ($scope) {

});


function test(x){

  alert(x);
  
}


function buildMapNew(){

  var WIDTH = 1920;
  var HEIGHT = 1057;

  //pull svg elemnts out of svg file
  //create svg groups to represent layers
  //find out how to bind data to groups
  //find out hwo to bind data to elements
  //possibly have each group in a single json file
  
  d3.select("body")
    .append("object")
      .attr("data", "test_nobg.svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .on("click", function(d,i) { alert("Hello world"); }) 
      .attr("type", "image/svg+xml");
      
    
}

function drawPath(start, points){
  var path = start + " ";
      for (var i = 0; i < points.length; i++) {
        path += points[i].x + "," + points[i].y + " ";
      }
    return path;
}

function buildMap(){

  
  var width = 1920;
  var height = 1424;
    
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
                                      

        
  var canvas = d3.select("body")
                     .append("svg")
                     .attr("width",width)
                     .attr("height",height);
                     
  d3.json("plan.json",function(data) {
            
        

    canvas.selectAll("path") //get an empty selector (as there are no polygons)
          .data(data) //join an array of data with the current selection
          .enter() //selection is split up into enter(), update(), exit()
            .append("path")
            .attr("d", function(d) { return drawPath(d["type"],d["data"]) + ' Z'} )
            .on('click', function(d) { test(d["boundary"]); })
            .attr("stroke","black")
            .attr("fill","none")
            .attr("stroke-width",1); 
        
        
  });


}