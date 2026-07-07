# Express Server

A high-performance, production-ready Express.js REST API server with clustering, comprehensive logging, security middleware, and graceful shutdown handling.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Security Features](#security-features)
- [Logging](#logging)
- [License](#license)

## Features

✨ **Core Features:**
- **Express.js REST API** - Lightweight and flexible web framework
- **Clustering** - Automatic CPU core detection with multi-process clustering for improved performance
- **Security** - Helmet middleware for setting secure HTTP headers
- **CORS Support** - Cross-Origin Resource Sharing enabled for all origins
- **Logging** - Comprehensive request/response logging using Pino
- **Error Handling** - Global error boundary middleware for exception handling
- **Graceful Shutdown** - Proper connection draining and process termination
- **Input Validation** - JSON payload size limit (10KB) with validation

## Prerequisites

Before running this server, ensure you have:

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

Check your versions:
```bash
node --version
npm --version
```

## Installation

1. **Clone the repository** (if applicable):
```bash
git clone <repository-url>
cd express_server
```

2. **Install dependencies**:
```bash
npm install
```

This will install the following packages:
- `express` - Web framework
- `helmet` - Security middleware
- `cors` - Cross-origin resource sharing
- `pino` - JSON logging library
- `pino-http` - HTTP request logging middleware
- `dotenv` - Environment variable management

## Running the Server

### Development Mode

```bash
npm start
```

The server will:
1. Detect the number of available CPU cores
2. Launch a worker process for each core
3. Listen on port 3000 (or the port specified in `PORT` environment variable)
4. Monitor worker processes and restart them if they crash

**Output Example:**
```
[PRIMARY 12345] Launching cluster across 4 CPU cores...
🚀 Worker process 12346 listening on http://localhost:3000
🚀 Worker process 12347 listening on http://localhost:3000
🚀 Worker process 12348 listening on http://localhost:3000
🚀 Worker process 12349 listening on http://localhost:3000
```

### Custom Port

Set the `PORT` environment variable:

**Windows (PowerShell):**
```powershell
$env:PORT=8000
npm start
```

**Windows (CMD):**
```cmd
set PORT=8000
npm start
```

**Linux/macOS:**
```bash
PORT=8000 npm start
```

## API Endpoints

### Health Check

**GET** `/api/users/health`

Returns the server status and architecture information.

**Response (200 OK):**
```json
{
  "status": "UP",
  "architecture": "Express REST Router"
}
```

**Example:**
```bash
curl http://localhost:3000/api/users/health
```

---

### Get All Users

**GET** `/api/users`

Retrieves all users (currently returns a success message).

**Response (200 OK):**
```json
{
  "message": "GET request successful for /users"
}
```

**Example:**
```bash
curl http://localhost:3000/api/users
```

---

### Create New User

**POST** `/api/users`

Creates a new user account with username and email.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": 456,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing username or email parameters."
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com"
  }'
```

---

### 404 - Not Found

Any request to an undefined route will return:

**Response (404 Not Found):**
```json
{
  "error": "Route GET /unknown/path does not exist."
}
```

---

### 500 - Internal Server Error

Unhandled exceptions are caught by the error boundary middleware:

**Response (500 Internal Server Error):**
```json
{
  "error": "An unexpected internal error occurred."
}
```

## Project Structure

```
express_server/
├── app.js              # Main Express application setup
├── server.js           # Server entry point with clustering logic
├── package.json        # Project dependencies and metadata
├── README.md           # This file
├── LICENSE             # Project license
├── routes/
│   └── userRoutes.js   # User-related API endpoints
└── utils/
    └── logger.js       # Pino logger configuration
```

### File Descriptions

- **app.js** - Configures Express middleware (helmet, CORS, logging, error handling) and registers routes
- **server.js** - Implements Node.js clustering for multi-core CPU utilization and graceful shutdown
- **routes/userRoutes.js** - Defines health check, user retrieval, and user creation endpoints
- **utils/logger.js** - Sets up Pino logger for structured JSON logging

## Environment Variables

Create a `.env` file in the project root to customize settings:

```env
PORT=3000
LOG_LEVEL=info
NODE_ENV=development
```

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port number |
| `LOG_LEVEL` | info | Pino logging level (trace, debug, info, warn, error, fatal) |
| `NODE_ENV` | development | Node environment (development, production) |

## Security Features

### Helmet Middleware
- Sets secure HTTP headers to prevent common vulnerabilities
- Includes protections against:
  - XSS (Cross-Site Scripting)
  - Clickjacking
  - MIME-type sniffing
  - CSS injection

### CORS Configuration
- Currently allows requests from all origins (`"*"`)
- In production, configure specific allowed origins

### Input Validation
- JSON payload limited to 10KB to prevent large payload attacks
- Request validation for required fields (username, email)

### Graceful Shutdown
- 10-second timeout for existing connections to close
- Forces shutdown if connections remain after timeout
- Prevents data corruption during server restart

## Logging

The server uses **Pino** for structured JSON logging:

### Log Levels
- `trace` - Most detailed, lowest priority
- `debug` - Debugging information
- `info` - General informational messages
- `warn` - Warning messages (e.g., missing fields)
- `error` - Error messages
- `fatal` - Critical errors

### Logged Events
- HTTP requests and responses (via pino-http)
- System health status requests
- User registration attempts
- Missing or invalid parameters
- Unhandled exceptions
- Worker process crashes (in primary process)

### Example Log Output
```json
{
  "level": 30,
  "time": "2024-01-15T10:30:45.123Z",
  "pid": 12346,
  "method": "POST",
  "url": "/api/users",
  "statusCode": 201,
  "msg": "Registering new user account metadata"
}
```

## Troubleshooting

### Server won't start
- Verify Node.js version: `node --version`
- Check if port 3000 is already in use: Change `PORT` environment variable
- Ensure all dependencies are installed: `npm install`

### High memory usage
- The clustering model uses multiple processes; this is expected
- Each worker process will consume some memory
- Monitor with: `node --inspect=9229 server.js`

### Requests timing out
- Check server logs for errors
- Verify middleware isn't blocking requests
- Ensure JSON payload is under 10KB limit

### Worker processes crashing
- Check console output for error messages
- Verify request payloads are valid JSON
- Review pino log output for detailed error information

## License

ISC