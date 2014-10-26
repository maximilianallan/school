var currentSocial = "";
var currentTech = "";
var mapWidth = 400;
var mapHeight = 100;

function hideData(id,d){
  
  if(currentSocial == id || currentTech == id){
    var humanInfo = $("#human-info");
    var techInfo = $("#tech-info");
    humanInfo.empty();
    techInfo.empty();
    currentSocial = "";
    currentTech = "";
    tip.hide(d);
  }else{
  
    
  }

}

function showData(id, coords, d){
  
  if(currentSocial == id || currentTech == id){
    return;
  }else{
    currentSocial = id;
    currentTech = id;
  }
  
  tip.show(d);
          
  
  var humanInfo = $("#human-info");
  var techInfo = $("#tech-info");
  
  humanInfo.empty();
  techInfo.empty();
 
  d3.json("res/" + id + "_social.json",function(data) {
    
    if(data.length > 0){
      $("#human-info").append("<h2 class='data-title'> Social/Human Info </h2>");
      $("#human-info").append("<h3 class='data-subtitle'>" + $("#"+id).attr("path-name") + "</h3>");
      var socal_list = d3.select("#human-info").append("ul");
      
      socal_list.selectAll("li")
          .data(data)
          .enter()
          .append("li")
          .text(function(d){ return d; })    
      }
  });
  
  d3.json("res/" + id + "_tech.json",function(data) {
    
    if(data.length > 0){
      
      $("#tech-info").append("<h2 class='data-title'> Technical Info </h2>");
      $("#tech-info").append("<h3 class='data-subtitle'>" + $("#"+id).attr("path-name") + "</h3>");
      
      var tech_list = d3.select("#tech-info").append("ul");
  
      tech_list.selectAll("li")
          .data(data)
          .enter()
          .append("li")
          .text(function(d){ return d; })    
      }
      
  });
  
}

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}   

function verticesFromRelativeNoLines(d){

  var vertices = [];
  
  var start = [d["data"][0].x,d["data"][0].y];
  
  vertices.push(start);
  for(var i = 1; i < d["data"].length; i++){  
    var x = vertices[i-1][0] + d["data"][i].x;
    var y = vertices[i-1][1] + d["data"][i].y;
    vertices.push([x,y]);
  }
 
  return vertices;

}

function verticesFromRelativeWithLines(d){

  var vertices = [];
  
  var start = [d["data"][0].x,d["data"][0].y];
  
  var relative = true;
  
  vertices.push(start);
  for(var i = 1; i < d["data"].length; i++){  
    var x = d["data"][i].x;
    var y = d["data"][i].y;
    if(x.toString().indexOf("L") > -1){
      relative = false;
      x = x.replace("L","");
      x = parseFloat(x);
    }
    if(relative){
      x = vertices[i-1][0] + x;
      y = vertices[i-1][1] + y;
      vertices.push([x,y]);
    }else{
      vertices.push([x,y]);
    }
  }
 
  return vertices;

}

function verticesFromAbsoluteNoLines(d){
  
  var vertices = [];
  
  for(var i = 0; i < d["data"].length; i++){  
    var x = d["data"][i].x;
    var y = d["data"][i].y;
    vertices.push([x,y]);
  }
 
  return vertices;

}

function verticesFromAbsoluteWithLines(d){
  
  var vertices = [];
 
  var absolute = true;
  
  for(var i = 0; i < d["data"].length; i++){  
    var x = d["data"][i].x;
    var y = d["data"][i].y;
    if(x.toString().indexOf("l") > -1){
      absolute = false;
      x = x.replace("l","");
      x = parseFloat(x);
    }
    if(absolute){
      vertices.push([x,y]);
    }else{
      x = vertices[i-1][0] + x;
      y = vertices[i-1][1] + y;
      vertices.push([x,y]);
    }
  }
 
  return vertices;

}

function hasLine(verts){

  for(var i = 0; i < verts.length; i++){
    
    if(verts[i].x.toString().indexOf("l") > -1 || verts[i].x.toString().indexOf("L") > -1){
      return true;
    }
    if(verts[i].y.toString().indexOf("l") > -1 || verts[i].y.toString().indexOf("L") > -1){
      return true;
    }
  
  }

  return false;
}


function testAndShow(coords){
  
  d3.selectAll("path")
      .each(function(d) { 
        if(d["type"] == "m"){
          if(!hasLine(d["data"])){
            var verts = verticesFromRelativeNoLines(d);
          }else{
            var verts = verticesFromRelativeWithLines(d);
          }
        }else{
          if(!hasLine(d["data"])){
            var verts = verticesFromAbsoluteNoLines(d);
          }else{
            var verts = verticesFromAbsoluteWithLines(d);
          }
        }
        
        var hullFromBuilding = d3.geom.hull(verts);
        verts.push(coords);
        var hullIncludingMouse = d3.geom.hull(verts);
        if(hullFromBuilding.equals(hullIncludingMouse)){
          showData(d["id"],coords,d);
          highlightSegment(d["id"]);
          
          $(".d3-tip").css("top", Math.floor(coords[1]) + mapHeight);
          $(".d3-tip").css("left",Math.floor(coords[0]) + mapWidth);
          
          
          //$(".d3-tip").css("top", Math.floor(coords[1]) + mapHeight);
          //$(".d3-tip").css("left",Math.floor(coords[0]) + mapWidth);
          
        }else{
          hideData(d["id"],d);
          clearAllHighlights(d["id"]);
          //tip.hide(d);
        }
                
      });
}

var tip = d3.tip().attr('class', 'd3-tip')
             .offset([-10,0])
             .html(function(d) {
              return "<strong>"+d.tag+"</strong>";
            });

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
    .attr("stroke-width",5); 
    
}

function drawPath(start, points){
  var path = start + " ";
      for (var i = 0; i < points.length; i++) {
        path += points[i].x + "," + points[i].y + " ";
      }
    return path;
}

//var tip = d3.tip()
//            .attr('class', 'd3-tip')
//            .offset([-10,0])
//            .html(function(d) {
//              return "<strong>"+d.tag+"</strong>";
//            });

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

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
                     .attr("height",height)
                     .on('mousemove', function() { testAndShow(d3.mouse(this)); } );
                     
  canvas.append("svg:image")
   .attr('x',-90)
   .attr('y',70)
   .attr('width', 1545)
   .attr('height', 845)
   .attr("xlink:href","res/bg.png");
  
  canvas.call(tip);
    
  //width = $("#map").offsetLeft;
  mapWidth = getOffset( document.getElementById('map') ).left - 80;
  mapHeight = getOffset( document.getElementById('map') ).top - 80;
  
  d3.json("res/data.json",function(data) {
            
       

    canvas.selectAll("path") //get an empty selector (as there are no polygons)
          .data(data) //join an array of data with the current selection
          .enter() //selection is split up into enter(), update(), exit()
            .append("path")
            .attr("d", function(d) { return drawPath(d["type"],d["data"]) + ' Z'} )
            .attr("id", function(d) { return d["id"]; } )
            .attr("class", function(d) { return d["class"];} )
            .attr("stroke","black")
            .attr("path-name", function(d) { return d["tag"]; } )
            .attr("fill","none")
            .attr("opacity",0)
            .attr("stroke-width",5); 
        //.on('mouseenter', function(d) { tip.show(d); } )  
        //.on('mouseleave', function(d) { tip.hide(d); } )
            
        
  });


}