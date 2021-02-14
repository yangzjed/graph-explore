<!DOCTYPE html>
<%@page import="test.Test1" %>
<html>

<head lang="en">

    <meta charset="UTF-8">
    <title></title>
</head>
<body>

<%
    String username = request.getParameter("name");
    String password = request.getParameter("password");
    String ans = username + password;
    Test1 t = new Test1();


%>

<%=
   "Hello, I am from Java! <br/>" + ans + t.lengthOfString(ans)
%>

Hi, I am the response!


</body>
</html>