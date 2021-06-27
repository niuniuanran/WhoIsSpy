package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":8080", "http server address")

func main() {
	flag.Parse()
	wsServer := NewWebsocketServer()
	go wsServer.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(wsServer, w, r)
	})

	http.HandleCreateRoom("/create-room", func(w http.ResponseWriter, r *http.Request) {
		HandleCreateRoom(wsServer, w, r)
	})

	fmt.Println("Running on :8080")

	log.Fatal(http.ListenAndServe(*addr, nil))
}
