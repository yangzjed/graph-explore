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
public class ChromaticIndex extends HttpServlet {
    public static int runNumber = 0;
	public static int successfulColorings = 0;
	public static int[][] coloring;

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

	public static int maxDegree(int[][] adj) {
		int maxDegree = 0;
		for(int i=0; i<adj.length; i++) {
			int deg = 0;
			for(int j=0; j<adj.length; j++) {
				if(adj[i][j] == 1) {
					deg++;
				}
			}
			if(deg>maxDegree) {
				maxDegree = deg;
			}
		}

		return maxDegree;
	}

	public static void colorNext(int[][] adj, ArrayList<Integer> layer, int nColors) {
		runNumber++;
		boolean first = true;
		for(int i=0; i<adj.length; i++) {
			if(adj[i][i]!=0) {
				first = false;
				break;
			}
		}
		if(first) {
			adj[0][0] = 1;
			for(int i=0; i<adj.length; i++) {
				if(i!=0 && adj[0][i] == 1) {
					layer.add(i);
				}
			}
			colorNext(adj, layer, nColors);
		}
		else if(successfulColorings==0) {
			if(layer.isEmpty()) {
				for(int i=0; i<adj.length; i++) {
					if(adj[i][i] != 0) {
						for(int j=0; j<adj.length; j++) {
							if(adj[i][j]==1 && adj[j][j]==0 && !layer.contains(j)) {
								layer.add(j);
							}
						}
					}
				}

				int vNextComponent = -1;
				for(int i=0; i<adj.length; i++) {
					if(adj[i][i]==0) {
						vNextComponent = i;
					}
				}

				if(!layer.isEmpty()) {
					colorNext(adj, layer, nColors);
				}
				else if(vNextComponent>=0) {
					layer.add(vNextComponent);
					colorNext(adj, layer, nColors);

				}
				else {
					successfulColorings++;

					if(successfulColorings==1) {
						coloring = adj;
					}
				}

			}
			else {
				int v = layer.get(0);
				ArrayList<Integer> forbidden = new ArrayList<Integer>();
				for(int j=0; j<adj.length; j++) {
					if(adj[v][j]==1 && !forbidden.contains(adj[j][j]) && adj[j][j]!=0) {
						forbidden.add(adj[j][j]);
					}
				}

				if(true && forbidden.size()!=nColors) {
					layer.remove(0);
					for(int i=1; i<=nColors; i++) {
						if(!forbidden.contains(i)) {
							int[][] copy = copyArray(adj);
							copy[v][v] = i;
							colorNext(copy, layer, nColors);
						}
					}
				}
			}
		}
	}

	public static int[][] lineGraph(int[][] adj){
		int edgeCount=0;
		int[][] adjCopy = copyArray(adj);

		for(int i=0; i<adj.length; i++) {
			for(int j=0; j<adj.length; j++) {
				if(i<j && adj[i][j]==1) {
					edgeCount++;
					adjCopy[i][j] = edgeCount;
					adjCopy[j][i] = edgeCount;
				}
			}
		}
		int[][] lineAdj = new int[edgeCount][edgeCount];


		for(int i=0; i<adjCopy.length; i++) {
			for(int j=0; j<adjCopy.length; j++) {
				if(adjCopy[i][j]!=0) {
					int v = adjCopy[i][j];
					for(int k=0; k<adjCopy.length; k++) {
						if(adjCopy[i][k]!=0 && v!=adjCopy[i][k]) {
							int v2 = adjCopy[i][k];
							lineAdj[v-1][v2-1] = 1;
							lineAdj[v2-1][v-1] = 1;
						}
					}
				}
			}
		}

		return lineAdj;
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

        int maxDegree = maxDegree(adjacency);
        int chromaticIndex = maxDegree;
        //System.out.println(maxDegree);

        int[][] lineAdj = lineGraph(adjacency);
        if(lineAdj.length == 0) {
            p.print("1");
        }
        else {

            if(mode==2){
                ArrayList<Integer> layer = new ArrayList<Integer>();
                colorNext(lineAdj, layer, maxDegree);

                if(successfulColorings==0) {
                    colorNext(lineAdj, layer, maxDegree+1);
                    chromaticIndex = maxDegree+1;
                }
                ArrayList<Integer> colors = new ArrayList<Integer>();
                for(int i=0; i<coloring.length; i++){
                    colors.add(coloring[i][i]);
                }
                p.print(colors);
            }
            else{
                ArrayList<Integer> layer = new ArrayList<Integer>();
                colorNext(lineAdj, layer, maxDegree);

                if(successfulColorings==0) {
                    colorNext(lineAdj, layer, maxDegree+1);
                    chromaticIndex = maxDegree+1;
                }

                p.print(chromaticIndex);
            }

        }
        successfulColorings = 0;
        p.close();

    }
}
