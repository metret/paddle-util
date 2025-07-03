# Paddle Pricing Utility

## Setup

### Initialisation

> npm install

this should install all needed packages, but if not, seperately run

> npm i paddle-node-sdk

### Required Files

They all are, although the files paddleCountries.json and pricing.json are particularly important.

The former contains an array of objects which are taken from the paddle API documentation, and is used by the program to establish counrty codes for every country.

The latter is the file which contains the data from which this utility creates all the entities in Paddle.


### Paddle integration

In order to run this utility, you will need your Paddle API key.
This will need to be put into a .env file, which should look something like this:

> PADDLE_API_KEY = 'your_api_key_here'

If the API key is for a sandbox environment, you won't need to do anything extra.  Otherwise, you will need to change this line in the index.ts file:

> const sandbox:boolean = true

to

> const sandbox:boolean = false

## Usage

### Compilation

To compile the typescript files, run

> npm run build

or alternatively

> tsc

### Running the utility

To run the utility, run

> npm run launch

or, if it still needs to be compiled,

> npm run restart

which will build the utility and then run it.

If the code complains about a missing API key, note that the .env file needs to be passed to node, eg:

> node --env-file=.env index.js

### Data from Paddle

The utility can also be used to retrieve and display all the data found in Paddle.

> npm run data

or pass "find" as an argument to the index.js file generated after building the utility

> node index.js find

