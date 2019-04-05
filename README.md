# Getting Started

Dependencies
- Google application credentials
- Node JS
- nodeGeoCoder
- knex
- bodyparser
- Postgresql

## Installations/Dependencies

In order to execute the program, you'll need to install node. In the shell, run
```
npm install node
```

Upon completing the download, execute the file by running
```
node server.js
```

## HTTP Requests

### GETTING
Home Page
```
/
```
To see the entire user database, navigate to
```
/database_tb
```
To see all users in the database, navigate to
```
/user_tb
```
To see information about a single user in the database, navigate to
```
/user/:username
```
where the `:username` parameter is a specific username within the database.

For instance, if there existed a user `foo` in the database, one could request to see `foo`'s information by navigating to
```
/user/foo
```
### Creating Users/Addresses
To create a new user entry execute the following command in command line:
```
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"displayName":"John Doe","userName":"johndoe88", "long": 2, "lat": 2}' \
    /user/create
```
Change the parameters as appropriate to suit your needs.

To assign users addresses, execute the following command, again adapting the parameters accordingly.
```
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"address":"18 Old Campus Road", "address_name:"Dorm", "user_id_ref":2, "long":2, "lat":2}' \
    /address/create
```

### Updating Users/Addresses

To update a user entry (rather than creating one), follow the example code below.

```
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"user_id":2, "displayName":"John Doe","userName":"johndoe88", "long": 2, "lat": 2' \
    /user/update
```

To update an address entry, follow the example code below.

```
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"user_id":2, "address":"18 Old Campus Road", "address_name:"Dorm", "user_id_ref":2, "long":2, "lat":2}' \
    /adress/update
```

### DELETING
To delete entries, follow the example code below.

```
curl --header "Content-Type: application/json" \
    --request DELETE \
    --data '{"user_id": 1}' \
    /address/delete
```
