# Build scanner
FROM golang:1.15-alpine AS scanner-builder
WORKDIR /go/src/github.com/artifacthub/scanner
COPY go.* ./
COPY cmd/scanner cmd/scanner
COPY internal internal
RUN cd cmd/scanner && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /scanner .

# Download trivy
FROM alpine:latest AS trivy-downloader
WORKDIR /tmp
RUN wget https://github.com/aquasecurity/trivy/releases/download/v0.11.0/trivy_0.11.0_Linux-64bit.tar.gz
RUN tar -zxvf trivy_0.11.0_Linux-64bit.tar.gz

# Final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates && addgroup -S scanner && adduser -S scanner -G scanner
USER scanner
WORKDIR /home/scanner
COPY --from=scanner-builder /scanner ./
COPY --from=trivy-downloader /tmp/trivy /usr/local/bin
RUN echo $PATH
CMD ["./scanner"]
