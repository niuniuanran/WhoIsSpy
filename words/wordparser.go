package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"strings"
)

func main() {
	wordDict := make(map[string]bool)

	addWordPairsFromFile("./words", wordDict)
	addWordPairsFromFile("./newwords", wordDict)

	pairs := make([]string, 0)
	for p := range wordDict {
		pairs = append(pairs, p)
	}

	result := strings.Join(pairs, "\n")

	f, err := os.Create("./result")
	if err == nil {
		defer f.Close()
	}
	f.Write([]byte(result))

}

func addWordPairsFromFile(filePath string, existing map[string]bool) {
	dat, err := ioutil.ReadFile(filePath)
	if err != nil {
		fmt.Println(err.Error())
	}
	numberAndDot := regexp.MustCompile(`[0-9]+、`)
	wordString := string(dat)
	result := string(numberAndDot.ReplaceAll([]byte(wordString), []byte("")))
	wordPairs := strings.Fields(result)

	for _, p := range wordPairs {
		if strings.Contains(p, "—") {
			existing[p] = true
		}
	}

}
