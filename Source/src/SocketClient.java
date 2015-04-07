import java.io.BufferedReader;
import java.io.DataOutputStream;
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
      DataOutputStream OutBound = new DataOutputStream(ClientSocket.getOutputStream());
      while (ClientSocket.isConnected()) {
        try {
          String OutBuffer = RedisProto.Encode(String.join(" ", Happy.Handle(RedisProto.Decode(InBound))));
          OutBound.writeBytes(OutBuffer);
        } catch(HappyNullException e){
          OutBound.writeBytes("$-1\r\n");
        } catch(HappyErrorException e){
          OutBound.writeBytes("-" + e.Message + "\r\n");
        }
      }
      ClientSocket.close();
    } catch(Exception e){
      System.out.println(e.getMessage());
    }
    Thread.currentThread().interrupt();
  }
}
