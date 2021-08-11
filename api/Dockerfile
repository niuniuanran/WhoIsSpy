##
## Build
##

FROM golang:1.16-buster AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./
COPY words-* ./

RUN go build -o /spy-api

##
## Deploy
##

FROM gcr.io/distroless/base-debian10

WORKDIR /

COPY --from=build /spy-api /spy-api

EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/spy-api"]