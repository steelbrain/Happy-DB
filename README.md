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

 - GET
  - `GET KEY` -> `VALUE`
  - `GET KEY1 KEY2 KEY3 ...` -> `VALUE1 VALUE2 VALUE3`
 - SET
  - `SET KEY VALUE` -> `OK`
  - `SET KEY1 VALUE1 KEY2 VALUE2 KEY3 VALUE3 ...` -> `OK`
 - INCR
  - `INCR KEY` -> `1`
  - `INCR KEY1 KEY2 KEY3 ...` -> `1 1 1`
 - EXPIRE
  - `EXPIRE KEY TIMEOUT` -> `OK`
  - `EXPIRE KEY1 TIMEOUT1 KEY2 TIMEOUT2 ...` -> `OK`
 - DEL
  - `DEL KEY` -> `1`
  - `DEL KEY1 KEY2 KEY3 ...` -> `3`
__Note:__ You will get the multiple values as an array by your Redis client, and single values as string.

#### License

This project is licensed under the terms of MIT License.