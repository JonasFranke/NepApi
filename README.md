# NEP-Viewer API

## Features

NepApi is a reverse engineered api for the NEP-Viewer.
It creates a webserver from which you are able to get the current state of your solar panels.

## Usage
### Usage with Docker
- Pull the docker image using `docker pull ghcr.io/JonasFranke/nepapi:latest`
- Start the container using `docker run --name nepapi -e username=<YOUR EMAIL ADDRESS> -e password=<YOUR PASSWORD> -e sid=<YOUR SITE ID> nepapi:latest`

### Usage without Docker
Requirements: [Bun](https://bun.sh) >= 1.2.3
- Pull the repo using `git clone --depth=1 https://github.com/JonasFranke/nepapi.git`
- Create a .env file like in the example file
- Start webserver using `bun run start`

### Routes
- `/` Gets the current wattage
- `/total` Gets the total production
- `/today` Gets the production from this day
- `/month` Gets the production from this month
- `/year` Gets the production from the year
