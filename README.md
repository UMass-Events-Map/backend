# UMaps Backend


Steps to run starting from new db:

1. `bun migration`
2. `bun start:bun`

Ensure you have a `.env` file in the root of the project with the correct database credentials.

Ensure that syncing is set to true in the env file.

# Testing

## End-to-End Tests

The project includes comprehensive end-to-end tests for each major module. You can run tests using the following commands:

```bash
# Run all e2e tests
npm run test:e2e:all

# Run individual module tests
npm run test:events         # Test event endpoints
npm run test:buildings      # Test building endpoints
npm run test:profiles       # Test profile endpoints
npm run test:organizations  # Test organization endpoints
```

Each test suite verifies the functionality of its respective endpoints, including:
- Response structure
- Data validation
- Error handling
- Relationships between entities

# Database Access

## Location Information

The database client used is [TypeORM](https://typeorm.io/).

This allows it to be agnostic any postgres wrapper service used. Therefore, any postgres client can be used to access the database.

This project currently uses Supabase and will leverage its auth system and practices. 

This project also uses Cloudflare as a reverse-proxy and name server. The domain is [umaps.phoenixfi.app/docs](https://umaps.phoenixfi.app/docs). 

## Access Information

To access the data, use HTTP calls via a RESTful API. More detailed information is located in the [documentation](https://umaps.phoenixfi.app/docs). To send a request, there are many options, such as the fetch API. To test out a request, it is also possible to go to the domain directly, click on an option, and press "Try it out." 

### EX. Get event IDs

To get all event IDs with pagination, send a GET request to [/events/ids](https://umaps.phoenixfi.app/events/ids). On success, the backend will return a JSON with a list of IDs and the number of IDs returned.

curl:
```
curl -X 'GET' \
  'https://umaps.phoenixfi.app/events/{id}' \
  -H 'accept: application/json'
```

example response:
```
{
  "ids": [
    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  ],
  "total": 3
}
```

To limit the number of requests, try 'https://umaps.phoenixfi.app/events/ids?limit={number_of_requests}'. To select the number of records to skip, try 'https://umaps.phoenixfi.app/events/ids?offset={num_skip}'. 

### EX. Get event by ID

To get information about an event by its ID, send a GET request to [/events/{id}](https://umaps.phoenixfi.app/events/{id}). Replace the '{id}' with the ID of the event you want information about. On success, the backend will return a JSON with a information about the given event, such as its name, description, and building_id.

curl:
```
curl -X 'GET' \
  'https://umaps.phoenixfi.app/events/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' \
  -H 'accept: application/json'
```

example response:
```
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "Painting and Animal Therapy",
  "description": "Pet dogs and enjoy fun arts and crafts!",
  "date": "2024-11-20",
  "time": "10:15:00",
  "building_id": null,
  "room_number": "405",
  "organization_id": null,
  "thumbnail": "https://tinyurl.com/xxxxxxxx",
  "attendance": 9,
  "created_at": "2024-10-28T20:46:36.828Z",
  "updated_at": "2024-10-28T20:46:36.828Z",
  "building": null,
  "organization": null,
  "event_logs": []
}
```

example response w/ invalid id:
```
{
  "error": "invalid input syntax for type uuid: \"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\""
}
```

