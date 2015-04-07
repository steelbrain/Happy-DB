import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.HashMap;

public class SocketClient implements Runnable {
  private final Socket ClientSocket;
  private final HashMap<String, Object> Database;

  public SocketClient(Socket ClientSocket, HashMap<String, Object> Database) {
    this.ClientSocket = ClientSocket;
    this.Database = Database;
  }

  public void run() {

    try {
      BufferedReader InBound = new BufferedReader(new InputStreamReader(ClientSocket.getInputStream()));
      String Line;
      String[] LineChunks;
      while ((Line = InBound.readLine()) != null) {
        LineChunks = Line.split("\\ ");
      }
      ClientSocket.close();
    } catch(Exception e){
      System.out.println(e.getMessage());
    }
    Thread.currentThread().interrupt();
  }
}
