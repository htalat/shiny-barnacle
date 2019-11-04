# Paperspace coding challenge

I tried to go with a modular approach so we can test the components separately and so changes can be made easily.

### Built with
- Node  
- Express  
- Mongoose  
- MongoDB  

---

## run the app
`docker-compose up`

## run the test 
`docker-compose run --rm app npm test`

## if not using docker
- have mongo running locally
- change `mongo` to `localhost` in `config/*.env`
- `npm install` to install dependencies
- `npm start` to start the app
- `npm test` to run the tests

---

The following endpoints have been implemented:

- `POST /address`  
```
curl -X POST \
  http://localhost:3000/address \
  -H 'Content-Type: application/json' \
  -d '{
	"name": "first address",
	"street": "2nd avenue",
	"city": "Needham",
	"state": "MA",
	"country": "USA"
}'
```
- `GET /address`

```
curl -X GET \
  'http://localhost:3000/address?state=MA&country=USA'
```

- `GET /address/:id`

```  
curl -X GET \
  http://localhost:3000/address/<your-id>
```

- `PUT /address/:id`

only need to send the field to update.
in case of either state or country, both fields have to be sent (to verify from the external service)

```
curl -X PUT \
  http://localhost:3000/address/<your-id> \
  -H 'Content-Type: application/json' \
  -d '{
	"name" : "Updated Address",
	"state": "FL",
	"country": "USA"
}'
```

- `DELETE /address/:id`

```
curl -X DELETE \
  http://localhost:3000/address/<your-id>
```

- `GET /`  

```
curl http://localhost:3000/
```
The responses are in the format
```
{
    status, // boolean
    message, // string
    data: { // where applicable 
        address // object
    }
}
```

The schema for address:
- name (string)
- street (string)
- city (string)
- country (string)
- state (string)