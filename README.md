# Acquisitions

**Acquisitions** is a production-ready API project developed using **Node.js**, **Express.js**, **Neon Postgres**, **Drizzle ORM**, and **Zod**, containerized with **Docker** and enhanced with **Warp** and **Arcjet** for security and automation. It includes **CI/CD pipelines**, logging, testing, and a modular architecture for scalable backend development.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Folder & File Structure](#folder--file-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [CI/CD](#cicd)
- [Testing](#testing)
- [Logging](#logging)
- [Contributing](#contributing)

---

## Project Overview

This backend API project offers:

- RESTful API development with **Express.js**
- PostgreSQL integration using **Neon DB** and **Drizzle ORM**
- Schema validation via **Zod**
- Secure, automated deployment using **Docker**, **Warp**, and **Arcjet**
- CI/CD automation with GitHub Workflows
- Modular, scalable, and maintainable folder structure

---

## Features

- Secure backend architecture
- JWT authentication support
- Database migrations with Drizzle
- Dockerized for development and production
- Logging with Winston
- Automated testing with Jest
- CI/CD workflows included

---

## Folder & File Structure

```
acquisitions/
├── src/
│   ├── controllers/      # Route handlers and business logic
│   ├── models/           # Database models and ORM schemas
│   ├── routes/           # API route definitions
│   ├── middleware/       # Express and custom middleware
│   ├── validators/       # Zod schemas for data validation
│   ├── services/         # Service-layer abstractions
│   ├── utils/            # Utility functions
│   ├── index.js          # App entry point
│   └── config/           # Environment & DB configs (e.g., .env, db.js)
├── tests/                # Automated unit and integration tests
├── docker/               # (Optional) Extra Docker config/scripts
├── .github/
│   └── workflows/        # CI/CD pipeline definitions (e.g., test.yml, deploy.yml)
├── Dockerfile            # Application container definition
├── docker-compose.yml    # Multi-service orchestration
├── package.json          # Project dependencies & metadata
├── README.md             # Project documentation
├── LICENSE               # License file
└── .env.example          # Environment variable template (never commit secrets!)
```
---

> Each folder and file is organized for **maximum clarity, modularity, and maintainability**.

---

## Getting Started

## Prerequisites

- Node.js v18+
- Docker & Docker Compose
- PostgreSQL (via Neon)

## Installation

```bash
git clone https://github.com/Abhay-0103/Acquisitions.git
cd Acquisitions
npm install
```
---

## Environment Variables

Create a .env file by copying .env.example and configure:
```bash
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
LOG_LEVEL=info
```

---

## Docker Setup
Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```

Production
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## CI/CD

The .github/workflows/ folder contains automated workflows for:

- Build & test

- Docker image build & push

- Deployment automation

---

## Testing

Run automated tests located in tests/:
```bash
npm test
```

---

## Logging

Application logs are stored in logs/. Configured with Winston for:

- Error logging

- Info logging

- JSON output with timestamps

---

## Contributing

1. Fork the repository

2. Create a feature branch

3. Commit changes

4. Submit a Pull Request

Follow conventional commits for consistency.
