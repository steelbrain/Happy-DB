import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;

public class Main {
  public static void main(String[] Args) {
    try {
      
      int Port = 6379;
      String DBPath = null;
      HashMap<String, Object> Database = new HashMap<String, Object>();

      String[] Chunks;
      for (String Arg: Args) {
        Chunks = Arg.split("\\=");
        if(Chunks.length == 2){
          if(Chunks[0].equals("--port")){
            Port = Integer.valueOf(Chunks[1]);
          } else if(Chunks[0].equals("--db-path")){
            DBPath = Chunks[1];
          } else {
            throw new Exception("Invalid Parameter " + Arg);
          }
        } else {
          throw new Exception("Invalid Parameter " + Arg);
        }
      }

      ServerSocket SocketServer = new ServerSocket(Port);

      for(;;){
        Socket ClientSocket = SocketServer.accept();
        try {
          new Thread(new SocketClient(ClientSocket, Database)).start();
        } catch(Exception e){}
      }
    } catch(Exception e){
      System.out.println(e.getMessage());
    }
  }
}
