# Order Processing System

This project implements event-driven Order Processing System using Node.js, Express, MongoDB, Redis, and AWS services (SQS and SES).

## Table of Contents

- [Order Processing System](#order-processing-system)
  - [Table of Contents](#table-of-contents)
  - [Objective](#objective)
  - [Features](#features)
  - [Technical Stack](#technical-stack)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
      - [User register Request Body](#user-register-request-body)
      - [User login Request Body](#user-login-request-body)
      - [Refresh token Request Body](#refresh-token-request-body)
    - [Orders](#orders)
      - [Create order Request Body](#create-order-request-body)
  - [Postman Collection](#postman-collection)
  - [Architecture](#architecture)
  - [Error Handling and Resilience](#error-handling-and-resilience)
  - [Testing](#testing)

## Objective

To build  event-driven Order Processing System that allows users to place orders, process them asynchronously, and send notifications upon completion.

## Features

- **User Authentication:** JWT-based authentication with access and refresh tokens.
- **Order Management:** Create and retrieve order details.
- **Inventory Check:** Stock validation before order confirmation.
- **Asynchronous Processing:** Order processing via AWS SQS.
- **Caching:** Order details cached in Redis for quick retrieval.
- **Email Notifications:** Order status notifications via AWS SES.
- **Error Handling:** Robust error handling.

## Technical Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Caching:** Redis
- **Authentication:** JWT
- **Message Queue:** AWS SQS
- **Email Service:** AWS SES
- **Environment Management:** .env

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Redis (local or cloud)
- AWS Account with credentials
- AWS SQS Queue
- AWS SES Verified Sender Identity
- Postman

## Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/shashivardhan-dev/order-processing-system.git
    cd order-processing-system
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure environment variables:**

    Create a `.env` file in the root directory and populate it with the required environment variables (see [Environment Variables](#environment-variables)).

4. **Start MongoDB and Redis:**

    Ensure that MongoDB and Redis are running and accessible.

5. **Configure AWS:**

    Ensure your AWS  is configured with the necessary credentials and default region.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
PORT=3000
MONGODB_URL=<your_mongodb_uri>
REDIS_URL=<your_redis_Url>
ACCESS_TOKEN_JWT_SECRET=<your_access_token_jwt_secret>
REFRESH_TOKEN_JWT_SECRET=<your_refresh_token_jwt_secret>
AWS_REGION=<your_aws_region>
AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
SQS_URL=<your_sqs_queue_url>
SES_SENDER_EMAIL=<your_verified_ses_sender_email>
MAX_SQS_RETRIES=<max_sqs_retries>
```

## Running the Application

 **Start the API server:**

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.

#### User register Request Body

```JSON
{
  "username": "testuser",
  "password": "password123",
  "email": "email@email.com"
}
```

```plaintext
Headers: Content-Type: application/json
```

- `POST /api/auth/login`: Login and get access and refresh tokens.
  
#### User login Request Body
  
```JSON
{

  "password": "password123",
  "email": "email@email.com"
}
```

```plaintext
Headers: Content-Type: application/json
```

- `POST /api/auth/refresh`: Refresh access token using refresh token.

#### Refresh token Request Body
  
  ```JSON
{
   "refreshToken":"jwt-token"
}
```

```plaintext
Headers: Content-Type: application/json
```

### Orders

- `POST /api/orders`: Create a new order.

#### Create order Request Body

  ```JSON
{
     "items" :[{"productId":"bike1", "quantity": 1}]   // ProductId in Mock folder 
}
```

```plaintext
Headers: Content-Type: application/json and Authorization: Bearer Token JWTId 
```

- `GET /api/orders/:id`: Get order details by ID.

```plaintext
Headers: Content-Type: application/json and Authorization: Bearer Token JWT Id 

```

## Postman Collection

A Postman collection (`order-processing-system.postman_collection.json`) is included in the repository for easy testing of the API endpoints. Import it into Postman.

## Architecture

1. **Client/User:**
    - Creates user.
2. **Order Service (Express.js + MongoDB):**
    - Handles order creation.
    - Validates inventory.
    - Pushes order to AWS SQS.
3. **Order Processor Worker (Node.js Service):**
    - Listens to AWS SQS.
    - Processes order & updates status.
    - Stores order in Redis for quick retrieval.
    - Sends AWS SES email notification.
4. **AWS Services:**
    - SQS: Manages async processing queue.
    - SES: Sends email notifications.

## Error Handling and Resilience

- **Inventory Check:** Orders are rejected if items are out of stock.
- **Asynchronous Processing:** AWS SQS ensures reliable message delivery.
- **Caching:** Redis improves retrieval performance and reduces database load.
- **Error Handling:** Proper error handling and validation are implemented throughout the application.
- **Retry Logic:** Implemented retry logic for AWS SQS  handle transient failures.

## Testing

Postman is used for testing the API endpoints. Unit tests and integration tests can be added for more comprehensive testing.
