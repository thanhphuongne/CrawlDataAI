# AI Crawl Data Backend

This backend provides APIs for user authentication, AI-powered data crawling requests, real-time chat, and data management.

## Architecture

- **Framework**: Express.js with Babel
- **Databases**:
  - PostgreSQL (users, requests via Sequelize)
  - MongoDB (conversations, crawled data via Mongoose)
- **Authentication**: JWT tokens
- **Real-time**: Socket.IO for WebSocket chat

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment variables (`.env`):
   ```
   SERVER_PORT=3001
   USER_JWT_SECRET_KEY=your-jwt-secret
   DATABASE_URL=postgresql://user:pass@localhost:5432/db
   MONGODB_URI=mongodb://localhost:27017/ai-crawl
   ```

3. Start databases (PostgreSQL + MongoDB)

4. Run migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. Start server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### POST /api/auth/register
Register new user with email/password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user_id": 1,
  "message": "User registered"
}
```

#### POST /api/auth/login
Login and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user_id": 1
}
```

### Crawl Requests

#### POST /api/requests
Create new crawl request (requires auth).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "requirement": "Crawl AI news from nytimes.com"
}
```

**Response:**
```json
{
  "request_id": 1,
  "status": "queued"
}
```

#### GET /api/requests
Get all user requests (optional status filter).

**Query:** `?status=completed`

**Response:** Array of request objects

#### GET /api/requests/:id
Get specific request by ID.

#### DELETE /api/requests/:id
Delete request and associated data.

### Conversation/Chat

#### POST /api/conversations
Send message (creates conversation if needed).

**Request:**
```json
{
  "content": "Hello AI",
  "request_id": 1
}
```

#### GET /api/conversations/:user_id
Get user conversations (optional request_id filter).

### Data Management

#### GET /api/data/:request_id
Get crawled data for request.

**Response:**
```json
{
  "url": "https://nytimes.com",
  "data": [...],
  "validated": false
}
```

#### GET /api/exports/:request_id/:format
Download exported data (json/csv/pdf).

### User Management

#### POST /api/users/:id
Update user profile.

## WebSocket Chat

Connect to `ws://localhost:3001?token=<jwt>`

### Events

#### Send: chat_message
```json
{
  "content": "User message",
  "request_id": 1
}
```

#### Receive: chat_response
```json
{
  "message": "Message received",
  "request_id": 1
}
```

## Code Flow

### Authentication Flow
1. User sends login/register request
2. Validate credentials via UserService
3. Generate JWT token
4. Return token for subsequent requests

### Request Creation Flow
1. Authenticated user sends requirement
2. Create Request record in PostgreSQL
3. Queue crawl job (TODO: implement job queue)
4. Return request ID

### Chat Flow
1. User connects to WebSocket with JWT
2. Verify token on connection
3. On chat_message:
   - Save message to MongoDB Conversation
   - TODO: Call AI API for response
   - Send chat_response

### Data Retrieval Flow
1. User requests data by request_id
2. Query MongoDB crawled_data collection
3. Return formatted data

## Database Models

### PostgreSQL (Sequelize)
- **User**: id, email, password, created_at
- **Request**: id, user_id, requirement, status, export_path, created_at

### MongoDB (Mongoose)
- **Conversation**: user_id, request_id, messages[{role, content, timestamp}]
- **CrawledData**: request_id, url, data[], validated

## TODOs

- Implement AI API integration for chat responses
- Add job queue for crawl processing (Bull/Redis)
- Implement CSV/PDF export formats
- Add request validation middleware
- WebSocket reconnection handling
- Rate limiting for APIs

## Testing

Use the provided Postman collection (`AICrawlDataPostman.json`) to test all endpoints.

1. Register/Login to get token
2. Set token in Postman environment
3. Test request creation, chat, data retrieval