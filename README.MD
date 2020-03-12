# Setting up the environment

Add a file `.env` to the root of the filesystem with options for the server.

| Variable  | Description   |
|-----------|---------------|
| DBUSER    | Username of database user |
| DBPASS    | Password of database user |
| GCID      | Google Credentials Client ID |
| GCST      | Google Credentials Secret |
| GCCB      | Google Credentials callback URL |
| PORT      | Port for the server to listen on, default: `3000` |
| IP        | IP for the server to listen on, default: `localhost` |

# Starting up the the server

Simple way to start up the server

```bash
node app.js
```
Starting up the server with developer dependancy `nodemon` to auto restart the server on change

```bash
nodemon app.js
```