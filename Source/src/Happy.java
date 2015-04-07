import java.util.HashMap;

class HappyNullException extends Exception{}
class HappyErrorException extends Exception{
  public String Message;
  public HappyErrorException(String Message) {this.Message = Message;}

}
public class Happy {
  public static String[] Handle(HashMap<String, Object> Database, String[] Request) throws Exception{
    if(Request.length == 0 ){
      throw new HappyNullException();
    }
    String RequestType = Request[0].toUpperCase();
    if(RequestType.equals("GET")){
      return ActionGET(Database, Request);
    } else if(RequestType.equals("SET")){
      return ActionSET(Database, Request);
    }
    throw new HappyErrorException("Unknown Command '" + Request[0] + "'");
  }
  public static String[] ActionGET(HashMap<String, Object> Database, String[] Request) throws Exception{
    if(Request.length != 2){
      throw new HappyErrorException(Main.MSG_INVALID_REQUEST);
    };
    if(!Database.containsKey(Request[1])){
      throw new HappyNullException();
    }
    Object Value = Database.get(Request[1]);
    if(Value instanceof String){
      return new String[]{String.valueOf(Value)};
    } else {
      throw new HappyErrorException("The Operation is invalid for this Key");
    }
  }
  public static String[] ActionSET(HashMap<String, Object> Database, String[] Request) throws Exception{
    if(Request.length != 3){
      throw new HappyErrorException(Main.MSG_INVALID_REQUEST);
    };
    Database.put(Request[1], Request[2]);
    return new String[]{"OK"};
  }
}
