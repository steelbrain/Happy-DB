

public class RedisProto {
  public static String Encode(String[] Request){
    String[] ToReturn = new String[Request.length + 1];
    ToReturn[0] = "*" + Request.length;
    for(Integer I = 1; I <= Request.length; ++I){
      ToReturn[I] = RedisProto.Encode(Request[I - 1]);
    }
    return String.join("\r\n", ToReturn);
  }
  public static String Encode(String Request){
    return "$" + Request.length() + "\r\n" + Request;
  }
}
