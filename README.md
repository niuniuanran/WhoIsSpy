# Who's the spy 🕶️

This is one of the favourite board games among my friends, but no one wants to be the driver. So I made this web application to be the driver.

https://user-images.githubusercontent.com/41246016/129313422-43118c84-639b-4281-a625-25db8743b2f5.mp4

## Run a smoke test

To run the dev game (which is tested among our gang of six and we had great fun)
```
$ git clone https://github.com/niuniuanran/WhoIsSpy.git
```

### Start the back end

#### Option 1 - prerequisite: [go 1.16](https://golang.org/dl/)

```
$ cd WhoIsSpy/api
$ go run .
```

#### Option 2 - prerequisite: [docker](https://docs.docker.com/get-docker/)
```
$ cd WhoIsSpy/api
$ docker build --tag spy-api .
$ docker run -p 8080:8080 spy-api
```

### Start the front end

Start the front end spa:
```
$ cd WhoIsSpy/spa
$ npm install
$ npm start
```

### To host the game for a bunch
- Get your PC and all the group's phones connected to the same WiFi network
- In the `WhoIsSpy/spa/.env` file, update the `REACT_APP_API_BASE_URL` value to be your PC's private IP address 
- Restart the front end
- Enjoy!

## Ongoing improvements

I am working to make the game more resilient when a player leaves the room. Progress is kept in my journal [Hold my game together when people leaves room](https://niuniuanran.github.io/2021/07/20/Hold-my-game-together-when-people-leaves-room/)
