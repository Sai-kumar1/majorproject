## MajorProject

> Technologies used

- Python
- Mongodb
- Nodejs
- MitmProxy

> Requirments before proceeding

- Mongodb installed with the default configurations .
- Create database named **majorproject** .
- In the **majorproject** db create collections with name **tripwires** .
- npm
- mitmproxy

**To run project follow the instructions below..**

**here -- info -- represents information**

```
$ cd  <path to the project folder>
$ npm install

-- terminal 1 --
$ node server.js

-- terminal 2 --
$ mitmdump -s ./mj.py
```
### In other terminal run ( from any location )

```
$ mongod
```
### Open any browser and configure the browser network to point to the **localhost:8000**