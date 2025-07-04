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
This will need to be put into the targets.json file

If the API key is for a sandbox environment please also tweak the sandbox boolean

## Usage

### Compilation

To compile the typescript files, run

> npm run build

or alternatively

> tsc

### Running the utility

To run the utility, run

> npm run test

for test mode, or for production

> npm run prod

If the code complains about a missing API key, check that the targets.json file contains all the needed keys

### Data from Paddle

The utility can also be used to retrieve and save all the data found in Paddle.

> npm run test-read

or for production

> npm run prod-read

or pass "read" as the second argument to the index.js file generated after building the utility

> node index.js test read

the first argument is used to specify which keys to use, eg prod or test.
This can be customised in the targets.json file.
