/**
 * Created by Jed on 6/18/2019.
 */
var topMargin = 60;
var leftMargin = 30;
var canvasWidth = 800;
var canvasHeight = 500;
var nodeSize = 10;
var drawMode = 1;
var displayMode = -1;
var nodes = [];
var edges = [];
var currentEdge = [];
var selectedNodes = 0;
var context;
var adjacency = [];
var colors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'];


var updateAdjacency = function(){
    var previousSize = adjacency.length;
    var rows = nodes.length;
    if(nodes.length==0){
        rows =1;
    }
    for(var i=0; i<rows; i++){
        adjacency[i] = [];
    }
    for(var i=0; i<rows; i++){
        for(var j=0; j<rows; j++){
            adjacency[i][j] = 0;
        }
    }
    for(var i=rows;i<previousSize; i++){
        adjacency.splice(rows,1);
    }

    //number the nodes
    for(var i=0; i<nodes.length; i++){
        nodes[i].number = i;
    }

    //update the adjacency matrix
    for(var i=0; i<edges.length; i++){
        adjacency[edges[i].e1.number][edges[i].e2.number] = 1;
        adjacency[edges[i].e2.number][edges[i].e1.number] = 1;
    }

    //number the edges
    var counter = 0;
    for(var j=0; j<adjacency.length; j++){
        for(var k=0; k<adjacency.length; k++){
            if(j<k && adjacency[j][k]==1){
                for(var i=0; i<edges.length; i++){
                    if((edges[i].e1.number==j&&edges[i].e2.number==k) || (edges[i].e2.number==j&&edges[i].e1.number==k)){
                        edges[i].number = counter;
                        counter++;
                        console.log("edge");
                        console.log(j);
                        console.log(k);
                    }
                }
            }
        }
    }

}

var drawNode = function(x,y,size,style){
    context.beginPath();
    context.strokeStyle = style;
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.stroke();
}
var selectN = function(mouseX, mouseY){
    // returns -1 if no vertex is found


    var selected = -1;
    for(var i=0; i<nodes.length; i++){
        var dist = Math.sqrt(Math.pow(mouseX-nodes[i].x,2)+Math.pow(mouseY-nodes[i].y,2));
        if(dist<nodeSize){
            nodes[i].isSelected = true;
            selected = i;
            //redraw();
            break;
        }
    }

    return selected;
}

var selectE = function(mouseX, mouseY){
    //returns -1 if no edge is found

    for(var i=0; i<edges.length; i++){
        var x1 = edges[i].e1.x;
        var y1 = edges[i].e1.y;
        var x2 = edges[i].e2.x;
        var y2 = edges[i].e2.y;
        var num =  Math.abs((y2-y1)*mouseX-(x2-x1)*mouseY+x2*y1-x1*y2);
        var den =  Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        var dist = num/den;

        var xmin = Math.min(x1,x2);
        var ymin = Math.min(y1,y2);
        var xmax = Math.max(x1,x2);
        var ymax = Math.max(y1,y2);
        if(dist<3 && xmin<=mouseX && mouseX<=xmax && ymin<=mouseY && mouseY<=ymax){

            return i;
        }
    }
    return -1;

}

var clearSelections = function(){
    for(var i=0; i<edges.length; i++){
        edges[i].isSelected = false;
    }
    for(var i=0; i<nodes.length; i++){
        nodes[i].isSelected = false;
    }
}

window.onresize = function(){
    var rectContent = document.getElementById("content").getBoundingClientRect();
    //alert(rectContent.left + ",  " + rectContent.top + ",  " + rectContent.right + ",  " + rectContent.bottom);

    var top = document.getElementById("canvas").offsetTop;
    var left = document.getElementById("canvas").offsetLeft;
    //alert("window.onload:" + left + "," + top);

    /*
    var rectCanvas = document.getElementById("canvas").getBoundingClientRect();
    console.log("canvas topleft " + rectCanvas.left + ",  " + rectCanvas.top);
    topMargin = rectCanvas.top;
    //leftMargin = (rectCanvas.right-rectCanvas.left - 800)/2 ;
    leftMargin = rectCanvas.left;
    */
    var rectCanvas = document.getElementById("canvas");
    console.log("canvas topleft " + rectCanvas.offsetLeft + ",  " + rectCanvas.offsetTop);
    topMargin = rectCanvas.offsetTop;
    //leftMargin = (rectCanvas.right-rectCanvas.left - 800)/2 ;
    leftMargin = rectCanvas.offsetLeft;


    //set box position
    var box = document.getElementById("box");
    box.style.left = leftMargin+850;
    box.style.top = topMargin;
    //box.style.position = "absolute";

    //set table position
    var table = document.getElementById("table");
    table.style.left = leftMargin+850;
    table.style.top = topMargin+200;

    //set menu position
    var menu = document.getElementById("menu");
    menu.style.left = leftMargin;
    menu.style.top = topMargin-55;
    //menu.style.position = "absolute";

}

window.onload = function(){
    window.onresize();

    var canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = "#000000";

    var r0 =document.getElementById(0);
    var r1 =document.getElementById(1);
    var r2 =document.getElementById(2);
    var r3 =document.getElementById(3);
    var r4 =document.getElementById(4);

    r0.innerHTML= "Clique Number:";
    r1.innerHTML= "Independence Number:";
    r2.innerHTML= "Chromatic Number:";
    r3.innerHTML= "Chromatic Index:";
    r4.innerHTML = "Edge Connectivity:";

    /*
    context.fillStyle = "#000000";
    context.fillRect(0,0,75,75);
    */
    updateAdjacency();
    /*
    var canvas2 = document.getElementById("myCanvas2");
    context2 = canvas2.getContext("2d");
    context2.fillStyle = "#000000";
    //context2.fillRect(0,0,75,75);
    context2.font = "12px Arial";
    context2.fillText("Hello World!", 30, 30);
    */
    canvas.onclick=function(e){


        //select mode
        if(drawMode===0){
            var node = selectN(e.offsetX, e.offsetY);
            var edge = selectE(e.offsetX, e.offsetY);
            //(ind[0]);
            //alert(ind[1]);
            if(node===-1 && edge===-1){
                clearSelections();
                //redraw();
            }
            else if(edge === -1){
                nodes[node].isSelected = true;
            }
            else{
                edges[edge].isSelected = true;
            }
            redraw();
        }



        //node drawing mode
        if(drawMode===1) {
            //drawNode(e.pageX - leftMargin, e.pageY - topMargin, nodeSize);
            //nodes.push({x: e.pageX - leftMargin, y: e.pageY - topMargin, number:nodes.length, isSelected:false});
            nodes.push({x: e.offsetX, y: e.offsetY, number:nodes.length, isSelected:false});
            //alert("margins " + leftMargin + " " + topMargin);
            //alert("absolute pos " + e.pageX + " " +  e.pageY)
            //alert("mouse " + (e.pageX-leftMargin) + " " + (e.pageY-topMargin));
            updateAdjacency();
            redraw();
            //alert(adjacency[0]);
        }



        //edge drawing mode
        if(drawMode===2){
            clearSelections();
            var x = e.offsetX;
            var y = e.offsetY;
            var z = selectN(x,y);
            if(z===-1){
                clearSelections();
                currentEdge = [];
                redraw();
                return;
            }
            selectedNodes++;
            if(currentEdge.length<1) {
                currentEdge.push(nodes[z]);
                redraw();
            }
            else{
                currentEdge.push(nodes[selectN(x,y)]);
                edges.push({e1:currentEdge[0], e2:currentEdge[1], isSelected: false});
                currentEdge[0].isSelected = false;
                currentEdge[1].isSelected = false;
                selectedNodes = 0;
                currentEdge = [];
                updateAdjacency();
                redraw();
                //alert(edges.length);

            }

        }


    }

    var addNode = document.getElementById("addNode");
    var addEdge = document.getElementById("addEdge");
    var select = document.getElementById("select");
    addNode.onclick = function(){
        currentEdge = [];
        drawMode = 1;
        clearSelections();
        redraw();
        addNode.classList.add("active");
        addEdge.classList.remove("active");
        select.classList.remove("active");
    }

    //var addEdge = document.getElementById("addEdge");
    addEdge.onclick = function(){
        drawMode = 2;
        clearSelections();
        redraw();
        addNode.classList.remove("active");
        addEdge.classList.add("active");
        select.classList.remove("active");
    }

    //var select = document.getElementById("select");
    select.onclick = function(){
        clearSelections();
        redraw();
        currentEdge = [];
        drawMode = 0;
        addNode.classList.remove("active");
        addEdge.classList.remove("active");
        select.classList.add("active");
    }

    var remove = document.getElementById("remove");
    remove.onclick = function(){
        for(var i=edges.length-1; i>=0; i--){
            if(edges[i].isSelected==true){
                edges.splice(i,1);
                //currentEdge = [];
            }
        }
        for(var i=nodes.length-1; i>=0; i--){
            if(nodes[i].isSelected==true){

                for(var j = edges.length-1; j>=0; j--){
                    if(edges[j].e1==nodes[i] || edges[j].e2==nodes[i]){
                        edges.splice(j,1);
                        //currentEdge = [];
                    }
                }
                nodes.splice(i,1);
                //currentEdge[];

            }
        }
        currentEdge = [];
        updateAdjacency();
        redraw();

    }

    var clear = document.getElementById("clear");
    clear.onclick = function(){
        nodes = [];
        edges = [];
        currentEdge = [];
        updateAdjacency();
        redraw();
    }




    /*
    var getClique = document.getElementById("getClique");
    getClique.onmouseover = function() {
        updateAdjacency();
        var request = new XMLHttpRequest();
        request.open("POST", "/CliqueNumber");
        request.addEventListener("load", alertCliqueNumber);
        request.send(JSON.stringify(adjacency));

    }
    */

    var alertCliqueNumber = function(event){
        //alert(event.target.response);
        var ans = document.getElementById("1000");
        var p = document.getElementById("0");
        p.innerHTML = "Clique Number: ";
        var response = event.target.response.toString();
        //ans.innerHTML = event.target.response.toString();
        if(displayMode==0){
            var c = document.getElementById("myCanvas");
            var cTemp = c.getContext("2d");
            var responseArray = JSON.parse(response);
            //alert(response);
            for(var i=0; i<responseArray.length; i++){
                //cTemp.rect(200+i,200+i,150, 150);
                for(var j=0; j<nodes.length; j++){
                    if(responseArray[i]===j){
                        cTemp.rect(nodes[j].x-12, nodes[j].y-12, 24, 24);
                        break;
                    }
                }
                cTemp.stroke();
            }

            //context.fillStyle = "#000000";
            //context.fillRect(0,0,75,75);
            console.log(response)

        }
        else{
            if(nodes.length==0){
                response = "0";
                ans.innerHTML = response;
            }
            else{
                ans.innerHTML = response;
            }
            console.log("c: " + response);
        }
        //console.log(event.target.response);
        displayMode = -1;
    }

    var prepareClique = function(){
        var request = new XMLHttpRequest();
        request.open("POST", "/CliqueNumber");
        request.addEventListener("load", alertCliqueNumber);

        console.log(JSON.stringify(adjacency));
        request.send(JSON.stringify(adjacency));
        //if(drawMode==1){adjacency[0][0]=1000; request.send(JSON.stringify(adjacency));}
    }

    /*
    var getIndependenceNumber = document.getElementById("getIndependenceNumber");
    getIndependenceNumber.onmouseover = function(){
        updateAdjacency();
        var request = new XMLHttpRequest();
        request.open("POST", "/IndependenceNumber");
        request.addEventListener("load", alertIndependenceNumber);
        request.send(JSON.stringify(adjacency));
    }
    */
    var alertIndependenceNumber = function(event){
        //alert(event.target.response);
        var ans = document.getElementById("1001");
        var p = document.getElementById("1");
        p.innerHTML = "Independence Number: ";
        var response = event.target.response.toString();

        //lines 258-278
        if(displayMode==1){
            var c = document.getElementById("myCanvas");
            var cTemp = c.getContext("2d");
            var responseArray = JSON.parse(response);
            //alert(response);
            for(var i=0; i<responseArray.length; i++){
                //cTemp.rect(200+i,200+i,150, 150);
                for(var j=0; j<nodes.length; j++){
                    if(responseArray[i]===j){
                        cTemp.rect(nodes[j].x-12, nodes[j].y-12, 24, 24);
                        break;
                    }
                }
                cTemp.stroke();
            }

            //context.fillStyle = "#000000";
            //context.fillRect(0,0,75,75);
            console.log(response)

        }
        else{
            if(nodes.length==0){
                response = "0";
                ans.innerHTML = response;
            }
            else{
                ans.innerHTML = response;
            }
            console.log("i: " + response);
        }
        displayMode = -1;

    }

    var prepareIndependenceNumber = function(){
        var request = new XMLHttpRequest();
        request.open("POST", "/IndependenceNumber");
        request.addEventListener("load", alertIndependenceNumber);
        request.send(JSON.stringify(adjacency));
    }


    var alertChromaticNumber = function(event){
        //alert(event.target.response);
        var ans = document.getElementById("1002");
        var p = document.getElementById("2");
        p.innerHTML = "Chromatic Number: ";
        var response = event.target.response.toString();
        console.log("COLORS:" + response);

        if(displayMode==1){
            for(var i=0; i<nodes.length; i++){
                var c = document.getElementById("myCanvas");
                var cTemp = c.getContext("2d");
                var responseArray = JSON.parse(response);
                cTemp.beginPath();
                cTemp.arc(nodes[i].x, nodes[i].y, nodeSize, 0, 2*Math.PI);
                cTemp.fillStyle = colors[responseArray[i]-1];
                cTemp.fill();
            }

            console.log(response)

        }
        else{
            if(nodes.length==0){
                response = "0";
                ans.innerHTML = response;
            }
            else{
                ans.innerHTML = response;
            }
            console.log("chrN: " + ans.innerHTML);
        }


    }
    var prepareChromaticNumber = function(){
        var request = new XMLHttpRequest();
        request.open("POST", "/ChromaticNumber");
        request.addEventListener("load", alertChromaticNumber);
        request.send(JSON.stringify(adjacency));
    }


    var alertEdgeConnectivity = function(event){
        //alert(event.target.response);
        var ans = document.getElementById("1004");
        var p = document.getElementById("4");
        p.innerHTML = "Edge Connectivity: ";
        var response = event.target.response.toString();
        if(nodes.length==0 || nodes.length==1){
            response = "0";
            ans.innerHTML = response;
        }
        else{
            ans.innerHTML = response;
        }
        console.log("Ec: " + ans.innerHTML);

    }
    var prepareEdgeConnectivity = function(){
        var request = new XMLHttpRequest();
        request.open("POST", "/EdgeConnectivity");
        request.addEventListener("load", alertEdgeConnectivity);
        request.send(JSON.stringify(adjacency));
    }


    var alertChromaticIndex = function(event){
        //alert(event.target.response);
        var ans = document.getElementById("1003");
        var p = document.getElementById("3");
        p.innerHTML = "Chromatic Index: ";
        var response = event.target.response.toString();

        if(displayMode==1){
            var c = document.getElementById("myCanvas");
            var cTemp = c.getContext("2d");
            var responseArray = JSON.parse(response);
            //alert(responseArray);
            for(var i=0; i<edges.length; i++){
                for(var j=0; j<edges.length; j++){
                    if(edges[j].number==i){
                        cTemp.strokeStyle = colors[responseArray[i]-1];
                        cTemp.beginPath();
                        var x1 = edges[j].e1.x;
                        var x2 = edges[j].e2.x;
                        var y1 = edges[j].e1.y;
                        var y2 = edges[j].e2.y;
                        var frac = nodeSize/Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
                        //alert(frac);

                        cTemp.moveTo(x1+(x2-x1)*frac,y1+(y2-y1)*frac);
                        cTemp.lineTo(x2-(x2-x1)*frac, y2-(y2-y1)*frac);
                        cTemp.stroke();
                        cTemp.strokeStyle = "#000000";

                    }
                }

            }

        }
        else{
            if(nodes.length==0 || edges.length==0){
                response = "0";
                ans.innerHTML = response;
            }
            else{
                ans.innerHTML = response;
            }
            console.log("chrI: " + ans.innerHTML);
        }
        displayMode = -1;


    }
    var prepareChromaticIndex = function(){
        var request = new XMLHttpRequest();
        request.open("POST", "/ChromaticIndex");
        request.addEventListener("load", alertChromaticIndex);
        request.send(JSON.stringify(adjacency));
    }



    var table = document.getElementById("table");
    for(var i=0; i<5; i++) {
        table.rows[i].cells[0].addEventListener("mouseover", function (event) { // This handler will be executed every time the cursor is moved over a different list item
            // highlight the mouseover target
            event.target.parentNode.style.color = "blue";
            event.target.parentNode.style.textDecoration = "underline";
            event.target.parentNode.style.cursor = "hand";

            /*
             // reset the color after a short delay
             setTimeout(function() {
             event.target.style.color = "";
             }, 500);
             */
        }, false);

        table.rows[i].cells[0].addEventListener("mouseout", function (event) { // This handler will be executed every time the cursor is moved over a different list item
            // highlight the mouseover target
            event.target.parentNode.style.color = "black";
            event.target.parentNode.style.textDecoration = "none";
            event.target.parentNode.style.cursor = "default";

            /*
             // reset the color after a short delay
             setTimeout(function() {
             event.target.style.color = "";
             }, 500);
             */
        }, false);
    }


    /*
    for(var i=0; i<5; i++){
        table.rows[i].cells[0].onmouseover = function(){
            var o = document.getElementById(""+(i+1000));
            console.log(i);
        }
    }
    */


    table.rows[0].cells[0].onclick = function(){
        clearMarkings();
        displayMode = 0;
        var request = new XMLHttpRequest();
        request.open("POST", "/CliqueNumber");
        request.addEventListener("load", alertCliqueNumber);

        console.log(JSON.stringify(adjacency));
        //request.send(JSON.stringify(adjacency));
        if(displayMode==0) {
            adjacency[0][0] = 2;
            request.send(JSON.stringify(adjacency));
            adjacency[0][0] = 0;
        }
    }
    table.rows[1].cells[0].onclick = function(){
        clearMarkings();
        displayMode = 1;
        var request = new XMLHttpRequest();
        request.open("POST", "/IndependenceNumber");
        request.addEventListener("load", alertIndependenceNumber);

        console.log(JSON.stringify(adjacency));
        if(displayMode==1) {
            adjacency[0][0] = 2;
            request.send(JSON.stringify(adjacency));
            adjacency[0][0] = 0;
        }

    }
    table.rows[2].cells[0].onclick = function(){
        clearMarkings();
        displayMode = 1;
        var request = new XMLHttpRequest();
        request.open("POST", "/ChromaticNumber");
        request.addEventListener("load", alertChromaticNumber);

        console.log(JSON.stringify(adjacency));
        if(displayMode==1) {
            adjacency[0][0] = 2;
            request.send(JSON.stringify(adjacency));
            adjacency[0][0] = 0;
        }

    }
    table.rows[3].cells[0].onclick = function(){
        clearMarkings();
        displayMode = 1;
        var request = new XMLHttpRequest();
        request.open("POST", "/ChromaticIndex");
        request.addEventListener("load", alertChromaticIndex);

        console.log(JSON.stringify(adjacency));
        if(displayMode==1) {
            adjacency[0][0] = 2;
            request.send(JSON.stringify(adjacency));
            adjacency[0][0] = 0;
        }

    }



    clearMarkings = function(){
        //important! clears display of previous property before showing current property
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        context.fillStyle = "#000000";

        //essentially redraw()
        for(var i=0; i<edges.length; i++){
            if(edges[i].isSelected==true){
                context.strokeStyle = "#FF0000";
            }

            context.beginPath();
            var x1 = edges[i].e1.x;
            var x2 = edges[i].e2.x;
            var y1 = edges[i].e1.y;
            var y2 = edges[i].e2.y;
            var frac = nodeSize/Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
            //alert(frac);

            context.moveTo(x1+(x2-x1)*frac,y1+(y2-y1)*frac);
            context.lineTo(x2-(x2-x1)*frac, y2-(y2-y1)*frac);
            context.stroke();
            context.strokeStyle = "#000000";
        }

        for(var i=0; i<nodes.length; i++){
            if(nodes[i].isSelected==true){
                context.strokeStyle = "#FF0000";
            }
            drawNode(nodes[i].x, nodes[i].y, nodeSize, context.strokeStyle);
            context.strokeStyle = "#000000";
        }
    }

    redraw = function() {
        //updateAdjacency();
        //window.onresize();
        prepareClique();
        prepareIndependenceNumber();
        prepareChromaticNumber();
        prepareChromaticIndex();
        prepareEdgeConnectivity();
        var box = document.getElementById("box");
        var title = document.getElementById("title");
        var p1 = document.getElementById("p1");
        var p2 = document.getElementById("p2");
        var p3 = document.getElementById("p3");
        var p4 = document.getElementById("p4");

        title.innerHTML = "<b>Graph Properties</b>";
        var degrees = [];
        for(var i=0; i<nodes.length; i++){
            degrees[i] = 0;
        }
        for(var i=0; i<edges.length; i++){
            degrees[edges[i].e1.number]++;
            degrees[edges[i].e2.number]++;
        }

        var maxDegree = 0;
        var minDegree = Number.MAX_VALUE;
        for(var i=0; i<nodes.length; i++){
            if(maxDegree<degrees[i]){
                maxDegree = degrees[i];
            }
            if(minDegree>degrees[i]){
                minDegree = degrees[i];
            }
        }
        if(nodes.length == 0){
            minDegree = 0;
        }

        p1.innerHTML = "Max. Degree: " + maxDegree.toString();
        p2.innerHTML = "Min. Degree: " + minDegree.toString();
        p3.innerHTML = "|V|: " + nodes.length.toString();
        p4.innerHTML = "|E|: " + edges.length.toString();

        //important! Clears the board
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        context.fillStyle = "#000000";

        for(var i=0; i<edges.length; i++){
            if(edges[i].isSelected==true){
                context.strokeStyle = "#FF0000";
            }

            context.beginPath();
            var x1 = edges[i].e1.x;
            var x2 = edges[i].e2.x;
            var y1 = edges[i].e1.y;
            var y2 = edges[i].e2.y;
            var frac = nodeSize/Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
            //alert(frac);

            context.moveTo(x1+(x2-x1)*frac,y1+(y2-y1)*frac);
            context.lineTo(x2-(x2-x1)*frac, y2-(y2-y1)*frac);
            context.stroke();
            context.strokeStyle = "#000000";
        }

        for(var i=0; i<nodes.length; i++){
            if(nodes[i].isSelected==true){
                context.strokeStyle = "#FF0000";
            }
            drawNode(nodes[i].x, nodes[i].y, nodeSize, context.strokeStyle);
            context.strokeStyle = "#000000";
        }



    }

}
