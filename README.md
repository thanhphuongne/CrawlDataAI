# CrawlDataAI

[![Build Status](https://gitlab.com/Tienpm3/crawldataai/badges/main/pipeline.svg)](https://gitlab.com/Tienpm3/crawldataai/-/commits/main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An AI-powered data crawling and scoring system that allows users to submit crawl requests, engage in real-time AI chat, and manage crawled data.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Authors](#authors)
- [License](#license)
- [Support](#support)

## Features

- **User Authentication**: Secure login and registration with JWT tokens.
- **Crawl Requests**: Submit requirements for AI-powered data crawling from websites.
- **Real-time Chat**: WebSocket-based chat for interacting with AI assistants.
- **Data Management**: Store, retrieve, and export crawled data in various formats (JSON, CSV, PDF).
- **Multiple Backends**: Node.js (Express) and Python (FastAPI) implementations.
- **Multiple Frontends**: Angular and React (Next.js) user interfaces.
- **Database Support**: PostgreSQL for relational data, MongoDB for unstructured data.

## Architecture

- **Backends**:
  - Node.js: Express.js with PostgreSQL (Sequelize) and MongoDB (Mongoose).
  - Python: FastAPI with PostgreSQL (SQLAlchemy) and MongoDB (Motor).
- **Frontends**:
  - Angular: Using ng-zorro-antd for UI components.
  - React: Next.js with Material-UI.
- **Databases**: PostgreSQL for relational data, MongoDB for unstructured data.
- **Real-time**: Socket.IO for WebSocket communication.
- **AI Integration**: OpenAI API for chat responses.

## Getting Started

### Prerequisites

- Node.js 16+ or Python 3.8+
- PostgreSQL and MongoDB databases
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://gitlab.com/Tienpm3/crawldataai.git
   cd crawldataai
   ```

2. Set up the backend (choose one or both):

   **Node.js Backend**:
   ```
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials (DB_DATABASE=CrawlDataAI, etc.)
   npx sequelize-cli db:migrate
   npm run dev
   ```

   **Python Backend**:
   ```
   cd backend-python
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your database credentials (DATABASE_URL=postgresql://user:pass@localhost/CrawlDataAI)
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

3. Set up the frontend (choose one):

   **Angular Frontend**:
   ```
   cd fe-angular
   npm install
   npm start
   ```

   **React Frontend**:
   ```
   cd frontend-react
   npm install
   npm run dev
   ```

4. Access the application:
   - Backend: http://localhost:3001 (Node.js) or http://localhost:8000 (Python)
   - Frontend: http://localhost:4200 (Angular) or http://localhost:3004 (React)

## Usage

1. Register or login to get a JWT token.
2. Submit a crawl request with your requirements.
3. Use the chat feature to interact with the AI.
4. Retrieve and export your crawled data.

Example API Usage:

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Create Crawl Request
curl -X POST http://localhost:3001/api/requests \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"requirement": "Crawl AI news from nytimes.com"}'
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Crawl Requests
- `POST /api/requests` - Create crawl request
- `GET /api/requests` - Get user requests
- `GET /api/requests/:id` - Get specific request
- `DELETE /api/requests/:id` - Delete request

### Chat
- `POST /api/conversations` - Send message
- `GET /api/conversations/:user_id` - Get conversations

### Data
- `GET /api/data/:request_id` - Get crawled data
- `GET /api/exports/:request_id/:format` - Export data

## WebSocket Events

Connect to `ws://localhost:3001?token=<jwt>`

- Send: `chat_message` - Send a message
- Receive: `chat_response` - Receive AI response

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Roadmap

- [ ] Implement AI API integration for chat responses
- [ ] Add job queue for crawl processing (Bull/Redis)
- [ ] Implement CSV/PDF export formats
- [ ] Add request validation middleware
- [ ] WebSocket reconnection handling
- [ ] Rate limiting for APIs

## Authors

- **Tienpm3** - *Initial work* - [GitLab Profile](https://gitlab.com/Tienpm3)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@crawldataai.com or create an issue on [GitLab](https://gitlab.com/Tienpm3/crawldataai/-/issues).
