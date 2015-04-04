Happy-DB
========
A super lightweight multi-threaded 100% redis compatible no sql database written purely in NodeJS.

Happy-DB uses Redis Protocol, which means that **all** of your existing Redis clients would work correctly with Happy-DB.

#### Installation

```bash
sudo npm install -g happy-db
```

#### Usage

`happy-db Port` Port should be a valid TCP port. For example
```js
happy-db 6379
```

#### Features Supported

 - GET, SET, INCR, DEL, EXISTS, PERSIST, EXPIRE, PEXPIRE, RENAME, PING
 - HSET, HGET, HDEL, **HEXPIRE**, HEXISTS, HGETALL, HKEYS, HLEN, HVALS, HMGET, HMSET
 - LPUSH, LPOP, RPUSH, RPOP, LREM, LLEN
 - HH ( Nested Hashes ) {

   - HHSET `KEY HKEY HHKEY HHVAL1 HHKEY` -> `HHSET MyWebsite:Users User:1 Name Steel Email steelbrain@example.com`
   - HHGET `KEY HKEY HHKEY...` -> `HHGET MyWebsite:Users User:1 Name`
   - HHDEL `KEY HKEY HHKEY...` -> `HHDEL MyWebsite:Users User:1 Email`
   - HHGETALL `KEY HKEY` -> `HHGETALL MyWebsite:Users User:1`
   - HHEXISTS `KEY HKEY HHKEY...` -> `HHEXISTS MyWebsite:Users User:1 SkypeName`
   - HHEXPIRE `KEY HKEY HHKEY1 HHKeyTimout1...` -> `HHEXPIRE MyWebsite:Users User:1 Token:Login 10`

 }

__Note:__ For almost all commands, Happy-DB supports multiple arguments and then returns an array of response,
for example doing `GET KEY1 KEY2 KEY3` will give you an array of `VALUE1 VALUE2 VALUE3`.

#### License

This project is licensed under the terms of MIT License.