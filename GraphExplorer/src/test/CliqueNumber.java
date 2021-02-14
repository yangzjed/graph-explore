package test;
import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.PrintWriter;
import java.util.*;

/**
 * Created by Jed on 6/27/2019.
 */
public class CliqueNumber extends HttpServlet {
    public static int cliqueNumber = 1;
    public static ArrayList<Integer> largestClique = new ArrayList<Integer>();
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

        ArrayList<Integer> clique = new ArrayList<Integer>();
        getLargerClique(adjacency,clique);


        /*
        for(int j=0; j<size; j++){
            adjacency[0][j] = Integer.valueOf(inputString.substring(j,j+1));
        }

        int i=1;
        while((inputString = streamReader.readLine()) != null) {
            for(int j=0; j<size; j++){
                adjacency[i][j] = Integer.valueOf(inputString.substring(j,j+1));
            }
            i++;
        }

        /*
        String username  = req.getParameter("name");
        String password = req.getParameter("password");

        p.print("<h1>" + username + ", " + password + "</h1>");
        */

        if (mode == 2) {
            p.print(largestClique);
            //System.out.println(largestClique);
        }
        else{
            p.print(cliqueNumber);
        }

        cliqueNumber = 1;
        p.close();
        largestClique.clear();

    }

}
