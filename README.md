# Getting Started

Dependencies
- Google application credentials
- Node JS
- Postgresql

## Installations/Dependencies

In order to execute the program, you'll need to install node. In the shell, run
```
npm install
```

Upon completing the download, execute the file by running
```
node server.js
```

## HTTP Requests

### GETTING
To pull information down from the server, simply navigate to the localhost server at
```
http://localhost:8888/
```
To see the entire user database, navigate to
```
http://localhost:8888/database_tb
```
To see all users in the database, navigate to
```
http://localhost:8888/user_tb
```
To see information about a single user in the database, navigate to
```
http://localhost:8888/user/:username
```
where the `:username` parameter is a specific username within the database.

For instance, if there existed a user `foo` in the database, one could request to see `foo`'s information by navigating to
```
http://localhost:8888/user/foo
```
### POSTING
To create a new user entry execute the following command in command line:
```
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"displayName":"John Doe","userName":"johndoe88", "long": 2, "lat": 2}' \
    http://localhost:8888/user/create
```
Change the parameters as appropriate to suit your needs.

To assign users addresses, execute the following command, again adapting the parameters accordingly.
```
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"address":"18 Old Campus Road", "address_name:"Dorm", "user_id_ref":2, "long":2, "lat":2}' \
    http://localhost:8888/address/create
```

### PUTTING

To update a user entry (rather than creating one), follow the example code below.

```
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"user_id":2, "displayName":"John Doe","userName":"johndoe88", "long": 2, "lat": 2}' \
    http://localhost:8888/user/update
```

To update an address entry, follow the example code below.

```
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"user_id":2, "address":"18 Old Campus Road", "address_name:"Dorm", "user_id_ref":2, "long":2, "lat":2}' \
    http://localhost:8888/adress/update
```

### DELETING
To delete entries, follow the example code below.

```
curl --header "Content-Type: application/json" \
    --request DELETE \
    --data '{"user_id": 1}' \
    http://localhost:8888/address/delete
```
