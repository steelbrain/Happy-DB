import java.io.BufferedReader;

public class RedisProto {
  public static String Encode(String Request){
    return "$" + Request.length() + "\r\n" + Request + "\r\n";
  }
  public static String[] Decode(BufferedReader InBound) throws Exception{
    String Line = InBound.readLine();
    if(Line.length() == 0){
      return new String[0];
    }
    String Type = Line.substring(0, 1);
    if(Type.equals("*")){
      Integer Count = Integer.valueOf(Line.substring(1));
      String[] ToReturn = new String[Count];
      for(Integer i = 0; i < Count; ++i){
        InBound.readLine();
        ToReturn[i] = InBound.readLine();
      }
      return ToReturn;
    } else {
      throw new Exception("Invalid Request");
    }
  }
}
