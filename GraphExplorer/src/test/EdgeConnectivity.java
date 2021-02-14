package test;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.*;
/**
 * Created by Jed on 8/18/2019.
 */
public class EdgeConnectivity extends HttpServlet{
    public static int edgeConnectivity;
    public static int[][] copyArray(int[][] orig) {
        int v = orig.length;
        int[][] a = new int[v][v];
        for(int i=0; i<v; i++) {
            for(int j=0; j<v; j++) {
                a[i][j] = orig[i][j];
            }
        }
        return a;
    }

    public static ArrayList<Integer> augmentingPath(int[][] adj, int sink) {
        int length = adj.length;
        ArrayList<ArrayList<Integer>> layers = new ArrayList<ArrayList<Integer>>();
        int layerCount = 0;
        boolean[] visited = new boolean[length];
        visited[0] = true;
        for(int i=1; i<length; i++) {
            visited[i] = false;
        }
        ArrayList<Integer> init = new ArrayList<Integer>();
        init.add(0);
        layers.add(init);
        layerCount++;

        while(layers.get(layerCount-1).size()>0 && !layers.get(layerCount-1).contains(sink)) {
            ArrayList<Integer> currentLayer = new ArrayList<Integer>();
            for(int i=0; i<length; i++) {
                if(layers.get(layerCount-1).contains(i)) {
                    for(int j=0; j<length; j++) {
                        if(adj[i][j]==1 && visited[j]==false) {
                            currentLayer.add(j);
                            visited[j] = true;
                        }
                    }
                }
            }
            layers.add(currentLayer);
            //currentLayer.clear();
            layerCount++;
        }

        int currentVertex = sink;
        ArrayList<Integer> path = new ArrayList<Integer>();
        if(visited[sink] == true) {
            path.add(sink);
            for(int i=layers.size()-1; i>=0; i--) {
                for(int j=0; j<layers.get(i).size(); j++) {
                    int back = layers.get(i).get(j);
                    if(adj[back][currentVertex]!=0) {
                        path.add(back);
                        currentVertex = back;
                        break;
                    }
                }
            }
            for(int i=0; i<path.size()-1; i++) {
                int x = path.get(i+1);
                int y = path.get(i);
                if(adj[y][x]==0) {
                    adj[y][x] = 1;
                }
                else {
                    adj[x][y] = 0;
                }
            }
            return path;
        }
        else {
            return path;
        }
    }

    public static int connectivity(int[][] adj, int sink) {
        int c = 0;
        ArrayList<Integer> currentPath = new ArrayList<Integer>();
        currentPath = augmentingPath(adj, sink);
        while(!currentPath.isEmpty()) {
            c++;
            System.out.println(currentPath);
            currentPath = augmentingPath(adj, sink);
        }

        return c;
    }

    public static void getEdgeConnectivity(int[][] adj) {
        edgeConnectivity = Integer.MAX_VALUE;
        for(int i=1; i<adj.length; i++) {
            int[][] temp = copyArray(adj);
            int t = connectivity(temp, i);
            if(edgeConnectivity>t) {
                edgeConnectivity = t;
            }
        }
    }



    public void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        res.setContentType("text/html");
        PrintWriter p = res.getWriter();

        BufferedReader streamReader = new BufferedReader( new InputStreamReader(req.getInputStream(), "UTF-8"));

        String inputString = "";
        while(true){
            String current = streamReader.readLine();
            if(current == null){
                break;
            }
            inputString += current;

        }
        int size = inputString.length(); //
        // [[row],[row],...[row]]

        String elements = "";
        for(int i=0; i<size; i++){
            String c = inputString.substring(i,i+1);
            if(c.equals("0") || c.equals("1") || c.equals("2")){
                elements += c;
            }
        }
        int adjSize = (int) Math.sqrt(elements.length());
        int[][] adjacency = new int[adjSize][adjSize];

        int counter =0;
        for(int i=0; i<adjSize; i++){
            for(int j=0; j<adjSize; j++){
                adjacency[i][j] = Integer.valueOf(elements.substring(counter, counter+1));
                counter++;
            }
        }
        int mode = adjacency[0][0];

        for(int i=0; i<adjacency.length; i++){
            adjacency[i][i] = 0;
        }

        getEdgeConnectivity(adjacency);
        p.print(edgeConnectivity);

        p.close();

    }
}
