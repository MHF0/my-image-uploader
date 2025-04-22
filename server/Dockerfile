# Use the official Golang image as the base image
FROM golang:1.24.2-alpine

# Set the current working directory inside the container
WORKDIR /app

# Copy the Go modules and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go app inside the container
RUN go build -o main .

# Expose the port the app will run on
EXPOSE 8080

# Command to run the app
CMD ["./main"]
