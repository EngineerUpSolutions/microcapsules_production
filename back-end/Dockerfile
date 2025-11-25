# ------------ STAGE 1: Build the Go binary ------------
FROM golang:1.24 AS builder
WORKDIR /app
# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download
# Copy the rest of the source
COPY . .
# Build the binary
RUN go build -o main .
# ------------ STAGE 2: Run the app ------------
FROM debian:bookworm-slim
WORKDIR /app
# Copy binary from builder stage
COPY --from=builder /app/main .
# Expose port 8080
EXPOSE 8080
# Run the binary
CMD ["./main"]
