This is just something I came up with when I was searching for an appartment, and I wanted to know how long it would take me to go from the appartment to work.

Usage instructions:
  - clone this repo
  - make sure you have mongodb installed
  - npm i
  - add .env-file
  - edit the config variables in index.js
  - node index.js

Example .env file:

```sh
GOOGLE_API_KEY=google-api-key
BOOLI_CALLER_ID=booli-caller-id
BOOLI_API_KEY=booli-api-key
DESTINATION=Centralplan 15, 111 20 Stockholm
```

There's also an API server included:
  - node server.js
  - open localhost:3333/items/

MIT licence
