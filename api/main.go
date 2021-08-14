package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
)

var addr *string
var rooms map[*Room]bool
var availableRoomCodes = make(map[string]bool)

func main() {
	var port string
	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	} else {
		port = "8080"
	}
	addr = flag.String("addr", fmt.Sprintf(":%s", port), "http server address")

	flag.Parse()
	rooms = make(map[*Room]bool)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received websocket connection request")
		ServePlayerWs(w, r)
	})

	http.HandleFunc("/create-room", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received /create-room request")
		setupResponse(&w, r)
		if (r).Method == "OPTIONS" {
			return
		}
		handleCreateRoom(w, r)
	})

	http.HandleFunc("/find-room", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received /find-room request")
		setupResponse(&w, r)
		handleFindRoom(w, r)
	})

	http.HandleFunc("/ayt", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received /ayt request")
		setupResponse(&w, r)
		handleAyt(w, r)
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received health check request")
		setupResponse(&w, r)
		if (r).Method == "OPTIONS" {
			return
		}
		fmt.Fprint(w, "Health check ok")
	})

	log.Println("Running on", port)

	log.Fatal(http.ListenAndServe(*addr, nil))
}

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
