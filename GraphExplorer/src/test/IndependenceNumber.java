package test;
import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.PrintWriter;
import java.util.*;
/**
 * Created by Jed on 8/13/2019.
 */
public class IndependenceNumber extends HttpServlet {
    public static int cliqueNumber = 1;
    public static ArrayList<Integer> largestClique;

    public static ArrayList<Integer> copyArrayList(ArrayList<Integer> orig){
        ArrayList<Integer> a = new ArrayList<Integer>();
        for(int i=0; i<orig.size(); i++) {
            a.add(i,orig.get(i));
        }
        return a;
    }
    public static void getLargerClique(int[][] arr, ArrayList<Integer> currentClique) {
        //System.out.println(currentClique);
        if(currentClique.size() == 0) {
            for(int i=0;i<arr.length; i++) {
                for(int j=0; j<i; j++) {
                    if(arr[i][j]==1) {
                        currentClique.add(i);
                        currentClique.add(j);
                        if(currentClique.size()>cliqueNumber) {
                            cliqueNumber = currentClique.size();
                            largestClique = copyArrayList(currentClique);
                        }
                        if(currentClique.size()<arr.length) {
                            //System.out.println(currentClique);
                            getLargerClique(arr, currentClique);
                        }
                        currentClique.clear();
                    }
                }
            }
        }
        else {
            for(int i=0; i<arr.length; i++) {
                boolean expand = true;
                int nextNode = 0;
                for(int j=0; j<currentClique.size(); j++) {
                    if(arr[i][currentClique.get(j)]==0) {
                        expand = false;
                        break;
                    }
                }
                if(expand) {
                    nextNode = i;
                    currentClique.add(nextNode);
                    if(currentClique.size()>cliqueNumber) {
                        cliqueNumber = currentClique.size();
                        //System.out.println(cliqueNumber);
                        largestClique = copyArrayList(currentClique);
                        //System.out.println(largestClique);
                    }

                    if(currentClique.size()<arr.length && !largestClique.containsAll(currentClique)) {
                        //System.out.println(currentClique);
                        getLargerClique(arr, currentClique);
                    }
                }
            }

        }

    }
    public static int[][] getComplement(int[][] adj){
        for(int i=0; i<adj.length; i++) {
            for(int j=0; j<adj.length; j++) {
                if((adj[i][j]==0)&&i!=j) {
                    adj[i][j] = 1;
                }
                else {
                    adj[i][j] = 0;
                }
            }
        }
        return adj;
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
        System.out.println(mode);

        for(int i=0; i<adjacency.length; i++){
            adjacency[i][i] = 0;
        }

        getComplement(adjacency);
        ArrayList<Integer> clique = new ArrayList<Integer>();
        getLargerClique(adjacency, clique);

        if (mode == 2) {
            p.print(largestClique);
            System.out.println(largestClique);
            System.out.println("clique");
        }
        else{
            p.print(cliqueNumber);
        }

        System.out.println("done");

        cliqueNumber = 1;
        p.close();
        largestClique.clear();
    }
}
