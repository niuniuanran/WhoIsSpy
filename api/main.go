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

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(w, r)
	})

	fmt.Println("Running on :8080")

	log.Fatal(http.ListenAndServe(*addr, nil))
}
