# Build scanner
FROM golang:1.15-alpine AS scanner-builder
WORKDIR /go/src/github.com/artifacthub/scanner
COPY go.* ./
COPY cmd/scanner cmd/scanner
COPY internal internal
RUN cd cmd/scanner && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /scanner .

# Final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates && addgroup -S scanner && adduser -S scanner -G scanner
USER scanner
WORKDIR /home/scanner
COPY --from=scanner-builder /scanner ./
RUN echo $PATH
CMD ["./scanner"]
