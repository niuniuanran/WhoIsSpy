package main

import (
	"flag"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":8080", "http server address")
var rooms map[*Room]bool
var availableRoomCodes = make(map[string]bool)

func main() {
	flag.Parse()
	rooms = make(map[*Room]bool)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServePlayerWs(w, r)
	})

	http.HandleFunc("/create-room", func(w http.ResponseWriter, r *http.Request) {
		setupResponse(&w, r)
		if (r).Method == "OPTIONS" {
			return
		}
		handleCreateRoom(w, r)
	})

	http.HandleFunc("/find-room", func(w http.ResponseWriter, r *http.Request) {
		handleFindRoom(w, r)
	})

	log.Println("Running on :8080")

	log.Fatal(http.ListenAndServe(*addr, nil))
}

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
