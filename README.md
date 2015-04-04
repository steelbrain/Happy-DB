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

#### License

This project is licensed under the terms of MIT License.