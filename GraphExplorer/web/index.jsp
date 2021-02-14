<%--
  Created by IntelliJ IDEA.
  User: Jed
  Date: 6/18/2019
  Time: 5:47 PM
  To change this template use File | Settings | File Templates.
--%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style>
    body{
        background:white;
    }

    .content{
        max-width:1100px;
        min-width: 1100px;
        margin: auto;
        background: #D8D8FF;
        padding: 0px 0px 10px 0px;
    }

    .description{
        max-width:1100px;
        min-width: 1100px;
        margin: auto;
        padding: 30px 0px 0px 0px;
    }
</style>

<html>


<head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="keywords" content="graph theory, graph, interactive, visual, draw, tool">
    <title>GraphExplore</title>


</head>


<body>
<img src="images/GraphExplore%20Logo.png" width="600px">
<div class="description">
    This web application is designed for graph theory learners to easily visualize
    complex results of various graph algorithms, including those for
    the clique problem, independent set, chromatic number, chromatic index, and edge connectivity.
<br>
<br>
<p style="font-size:20px"><b>How to Use</b></p>
<b>Add Nodes:</b> while this button is selected, click anywhere to add
<br>
<b>Add Edges:</b> while this button is selected, click on one vertex, and then click on another to draw an edge connecting them
<br>
<b>Select:</b> use this mode to select multiple edges/vertices
<br>
<b>Remove:</b> deletes all selected edges and vertices
<br><br>
Click on any of the boxes on the bottom right of the interface for an example that demonstrates the indicated property.
<br>
<br>
</div>

<div>
<div class="content" id="content">
        <%  int canvasTop = 60;
            int canvasLeft = 30;
        %>
        <br>
        <div id="menu" style="margin-left: 10px; margin-top:-10px">
            <button id="select" class="btn btn-outline-primary"style = "">Select</button>
            <button id="addNode" class="btn btn-outline-primary active" style = "">Add Nodes</button>
            <button id="addEdge" class="btn btn-outline-primary" style = "">Add Edges</button>

            <!--
            <button id="getClique">Get Clique Number</button>
            <button id="getIndependenceNumber">Get Independence Number</button>
            -->
            <button id="remove" class="btn btn-outline-danger" style = "outline:none; box-shadow:none; top:<%=canvasTop-50%>; left: <%=canvasLeft+330%>">Remove</button>
            <button id="clear" class="btn btn-danger" style = "outline: none; box-shadow: none; margin-left:365px">Clear</button>
        </div>
        <hr style="border:1px solid blue;">

        <div id ="canvas" style="margin-left: 10px">
            <script type="text/javascript" src = "make.js"></script>
            <canvas id="myCanvas" width="800" height = "500" style = "border: 2px solid #000000; top:<%=canvasTop%>; left:<%=canvasLeft%>"></canvas>
            <!--<canvas id="myCanvas2" width="150" height = "100" style = "border: 1px solid #000000; position:absolute; top:30; left:1050"></canvas> -->
        </div>

        <table id = "box" style="position:absolute" border="0px solid black">

            <tr>

                <td bgcolor=white style = "border: 0px solid black; padding: 10px" width="200px" height="150px"> <div id = "title"><b>Graph Properties</b></div>
                    <div id = "p1">Max. Degree:</div>
                    <div id = "p2">Min. Degree</div>
                    <div id = "p3">|V|:</div> <!--<div id = "p1"></div>-->
                    <div id = "p4">|E|:</div>
                </td>
            </tr>

        </table>



        <table id = "table" border="0px solid black" style="position:absolute; top: <%=canvasTop+190%>; left: <%=canvasLeft+900%>; border-collapse: separate; border-spacing: 2px 10px">
            <% for (int i = 0; i < 5; i++){ %>
            <tr>
                <td bgcolor=white style = "border: 0px solid black; padding: 10px" height="42px" width="200px"> <span id = "<%=i%>"></span><span id="<%=i+1000%>"></span></td>
            </tr>
            <% } %>
        </table>

    </div></div>

<div class="description" style="margin-top:-20px">
    Please send any comments or suggestions to yangz.jed at gmail.com. Thanks!
</div>
<br>
</body>
</html>
