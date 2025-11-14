# API Reference

This document describes all available REST API endpoints for the **Workout Backend Service**.
All routes are prefixed with `/api`.

## 📚 **Interactive Documentation**

**Swagger UI is available at:** `/docs`

- **Local Development:** `http://localhost:3000/docs`
- **Production:** `https://yourdomain.com/docs`

The Swagger UI provides:

- Interactive API testing
- Detailed request/response schemas
- Authentication testing
- Real-time API exploration

---

## Authentication

### Headers

| Header          | Type               | Description                                 |
| --------------- | ------------------ | ------------------------------------------- |
| `Authorization` | `string`           | Format: `Bearer <access_token>` _Required_. |
| `Content-Type`  | `application/json` | All POST/PUT requests                       |

### Authentication Flow

1. User registers via `/api/auth/register`
2. User logs in via `/api/auth/login`
3. Receives an `access_token` and `refresh_token`
4. Include the `access_token` in all protected requests

> **💡 Tip:** Use the interactive Swagger UI at `/docs` to test authentication flow and get valid tokens for API exploration.

---

## 👤 **Auth Endpoints**

### `POST /api/auth/register`

Register a new user.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "MyStrongPassword123",
  "username": "johndoe",
  "fullName": "John Doe"
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe"
  }
}
```

#### Error Responses

- `400 Bad Request` - Invalid input data
- `409 Conflict` - User already exists

### `POST /api/auth/login`

Authenticate a user and return JWT tokens.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "MyStrongPassword123"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe"
  }
}
```

#### Error Responses

- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid credentials

### `POST /api/auth/logout`

Logout user and invalidate token.

**Auth:** Bearer token required

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### `POST /api/auth/refresh`

Refresh JWT tokens.

**Body**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👤 **User Endpoints**

### `GET /api/users/profile`

Get current user's profile.

**Auth:** Bearer token required

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Fitness enthusiast",
    "createdAt": "2024-01-01T00:00:00Z",
    "isActive": true
  }
}
```

### `PUT /api/users/profile`

Update current user's profile.

**Auth:** Bearer token required

**Body**

```json
{
  "username": "johndoe",
  "fullName": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "Updated bio"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Updated bio"
  }
}
```

### `POST /api/users/profile/avatar`

Upload user avatar image.

**Auth:** Bearer token required

**Body:** `multipart/form-data` with `avatar` file (max 5MB)

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "avatarUrl": "https://your-domain.com/uploads/avatars/filename.jpg"
  }
}
```

### `GET /api/users`

Get all users (admin only).

**Auth:** Bearer token required

**Query Parameters:**

- `page` (integer, default: 1)
- `limit` (integer, default: 10, max: 100)
- `search` (string)

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatarUrl": "https://example.com/avatar.jpg",
      "isActive": true
    }
  ]
}
```

### `GET /api/users/:id`

Get user by ID.

**Auth:** Bearer token required

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "fullName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Fitness enthusiast",
    "isActive": true
  }
}
```

### `GET /api/users/:id/analytics`

Get user analytics.

**Auth:** Bearer token required

### `PATCH /api/users/:id/activate`

Reactivate a user account.

**Auth:** Bearer token required

### `PATCH /api/users/:id/deactivate`

Deactivate a user account.

**Auth:** Bearer token required

### `DELETE /api/users/:id`

Delete user (admin only).

**Auth:** Bearer token required

**Response (204 No Content)**

---

## 🏋️ **Workout Endpoints**

### `POST /api/workouts`

Create a new workout.

**Auth:** Bearer token required

**Body**

```json
{
  "routineId": "uuid-optional",
  "title": "Morning Push Workout",
  "visibility": "PRIVATE"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Morning Push Workout",
    "visibility": "PRIVATE",
    "createdAt": "2024-01-01T00:00:00Z",
    "userId": "uuid"
  }
}
```

### `GET /api/workouts`

Get user's workouts.

**Auth:** Bearer token required

**Query Parameters:**

- `limit` (integer, default: 20)
- `offset` (integer, default: 0)
- `includeFinished` (boolean, default: true)
- `routineId` (string, UUID)

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Morning Push Workout",
      "visibility": "PRIVATE",
      "finishedAt": null,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `GET /api/workouts/stats`

Get workout statistics.

**Auth:** Bearer token required

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "totalWorkouts": 50,
    "completedWorkouts": 45,
    "currentStreak": 5,
    "longestStreak": 12
  }
}
```

### `GET /api/workouts/analytics`

Get workout analytics for charts.

**Auth:** Bearer token required

**Query Parameters:**

- `type` (required): `overall-progress` | `muscle-groups` | `volume-over-time`
- `months` (integer, default: 6)

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "type": "overall-progress",
    "chartData": [...]
  }
}
```

### `GET /api/workouts/:id`

Get workout by ID.

**Auth:** Bearer token required

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Morning Push Workout",
    "visibility": "PRIVATE",
    "finishedAt": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "workoutSets": []
  }
}
```

### `PUT /api/workouts/:id`

Update workout.

**Auth:** Bearer token required

**Body**

```json
{
  "title": "Updated Workout Title",
  "visibility": "PUBLIC",
  "finishedAt": "2024-01-01T12:00:00Z"
}
```

### `DELETE /api/workouts/:id`

Delete workout.

**Auth:** Bearer token required

**Response (204 No Content)**

### `POST /api/workouts/:id/finish`

Mark workout as finished.

**Auth:** Bearer token required

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "finishedAt": "2024-01-01T12:00:00Z"
  }
}
```

### `POST /api/workouts/:id/sets`

Add a set to workout.

**Auth:** Bearer token required

**Body**

```json
{
  "exerciseId": "uuid",
  "weight": 135.5,
  "reps": 10,
  "restSeconds": 90,
  "notes": "Felt good"
}
```

### `PUT /api/workouts/sets/:setId`

Update workout set.

**Auth:** Bearer token required

### `DELETE /api/workouts/sets/:setId`

Delete workout set.

**Auth:** Bearer token required

---

## 📝 **Routine Endpoints**

### `POST /api/routines`

Create a new routine.

**Auth:** Bearer token required

**Body**

```json
{
  "title": "Push/Pull/Legs Split",
  "description": "3-day workout split",
  "difficulty": "INTERMEDIATE",
  "visibility": "PRIVATE"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Push/Pull/Legs Split",
    "description": "3-day workout split",
    "difficulty": "INTERMEDIATE",
    "visibility": "PRIVATE",
    "createdAt": "2024-01-01T00:00:00Z",
    "userId": "uuid"
  }
}
```

### `GET /api/routines/public`

Get public routines.

**Auth:** Optional

**Query Parameters:**

- `page` (integer, default: 1)
- `limit` (integer, default: 10, max: 50)
- `difficulty` (string): `BEGINNER` | `INTERMEDIATE` | `ADVANCED`
- `search` (string)

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Beginner Full Body",
      "description": "Full body workout for beginners",
      "difficulty": "BEGINNER",
      "visibility": "PUBLIC",
      "upvotes": 15,
      "user": {
        "username": "fitnessguru",
        "fullName": "Fitness Guru"
      }
    }
  ]
}
```

### `GET /api/routines/my`

Get user's routines with complete exercise details.

**Auth:** Bearer token required

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Push/Pull/Legs Split",
      "description": "3-day workout split",
      "difficulty": "INTERMEDIATE",
      "visibility": "PRIVATE",
      "routineExercises": [
        {
          "id": "routine-exercise-id",
          "dayIndex": 0,
          "orderIndex": 0,
          "sets": 4,
          "reps": 8,
          "restSeconds": 90,
          "exercise": {
            "id": 1,
            "name": "Bench Press",
            "category": "STRENGTH",
            "primaryMuscles": ["chest"]
          }
        }
      ]
    }
  ]
}
```

### `GET /api/routines/:id`

Get routine by ID.

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Push/Pull/Legs Split",
    "description": "3-day workout split",
    "difficulty": "INTERMEDIATE",
    "visibility": "PUBLIC",
    "upvotes": 5,
    "routineExercises": [...]
  }
}
```

### `PUT /api/routines/:id`

Update routine.

**Auth:** Bearer token required

**Body**

```json
{
  "title": "Updated Routine Title",
  "description": "Updated description",
  "difficulty": "ADVANCED",
  "visibility": "PUBLIC"
}
```

### `DELETE /api/routines/:id`

Delete routine.

**Auth:** Bearer token required

**Response (204 No Content)**

### `GET /api/routines/specific-exercise/:id`

Get suggested exercises for routine.

**Auth:** Bearer token required

### `POST /api/routines/:id/exercises`

Add exercise to routine.

**Auth:** Bearer token required

**Body**

```json
{
  "exerciseId": 1,
  "dayIndex": 0,
  "orderIndex": 0,
  "sets": 4,
  "reps": 8,
  "restSeconds": 90,
  "notes": "Focus on form"
}
```

### `DELETE /api/routines/:id/exercises/:exerciseId`

Remove exercise from routine.

**Auth:** Bearer token required

### `POST /api/routines/:id/vote`

Upvote a routine.

**Auth:** Bearer token required

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "upvotes": 6
  }
}
```

### `DELETE /api/routines/:id/vote`

Remove vote from routine.

**Auth:** Bearer token required

### `POST /api/routines/:id/clone`

Clone a routine to user's account.

**Auth:** Bearer token required

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "new-routine-uuid",
    "title": "Push/Pull/Legs Split (Copy)",
    "isClone": true
  }
}
```

---

## 💪 **Exercise Endpoints**

### `GET /api/exercises`

Search and filter exercises.

**Query Parameters:**

- `search` (string): Search term for name, instructions, or muscles
- `category` (string): `STRENGTH` | `CARDIO` | `MOBILITY`
- `level` (string): `BEGINNER` | `INTERMEDIATE` | `ADVANCED`
- `primaryMuscles` (string): Target muscle group
- `equipment` (string): Equipment type
- `force` (string): `PUSH` | `PULL` | `STATIC`
- `mechanic` (string): `COMPOUND` | `ISOLATION`
- `page` (integer, default: 1)
- `limit` (integer, default: 18, max: 50)

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bench Press",
      "category": "STRENGTH",
      "level": "BEGINNER",
      "primaryMuscles": ["chest"],
      "secondaryMuscles": ["triceps", "shoulders"],
      "equipment": "barbell",
      "force": "PUSH",
      "mechanic": "COMPOUND",
      "instructions": "Lie on bench, grip bar..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 18,
    "total": 150,
    "pages": 9
  }
}
```

### `GET /api/exercises/random`

Get random exercises for discovery.

**Query Parameters:**

- `page` (integer, default: 1)
- `limit` (integer, default: 18, max: 50)

### `GET /api/exercises/muscle-groups`

List all available muscle groups.

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    "abdominals",
    "biceps",
    "calves",
    "chest",
    "forearms",
    "glutes",
    "hamstrings",
    "lats",
    "lower back",
    "quadriceps",
    "shoulders",
    "triceps",
    "traps"
  ]
}
```

### `GET /api/exercises/equipment-types`

List all available equipment types.

**Response (200 OK)**

```json
{
  "success": true,
  "data": ["barbell", "dumbbell", "machine", "cable", "bodyweight", "kettlebell", "resistance band"]
}
```

### `GET /api/exercises/filter-options`

Get all filter options for exercises.

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "categories": ["STRENGTH", "CARDIO", "MOBILITY"],
    "levels": ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    "forces": ["PUSH", "PULL", "STATIC"],
    "mechanics": ["COMPOUND", "ISOLATION"],
    "muscleGroups": ["chest", "back", "legs", "..."],
    "equipmentTypes": ["barbell", "dumbbell", "..."]
  }
}
```

### `GET /api/exercises/list`

List all exercises (simple format).

### `GET /api/exercises/:id`

Get exercise by ID with full details.

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Bench Press",
    "category": "STRENGTH",
    "level": "BEGINNER",
    "primaryMuscles": ["chest"],
    "secondaryMuscles": ["triceps", "shoulders"],
    "equipment": "barbell",
    "force": "PUSH",
    "mechanic": "COMPOUND",
    "instructions": "Detailed instructions...",
    "images": ["bench-press-1.jpg", "bench-press-2.jpg"]
  }
}
```

---

## ❤️ **Health Endpoints**

### `GET /api/health`

Basic health check.

**Response (200 OK)**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### `GET /api/health/detailed`

Detailed health information.

**Response (200 OK)**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z",
  "uptime": "5d 12h 30m",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## Error Responses

All error responses follow this format (as defined in Swagger schemas):

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/endpoint"
}
```

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `204 No Content` - Successful request with no response body
- `400 Bad Request` - Invalid input data or request format
- `401 Unauthorized` - Missing, invalid, or expired authentication
- `403 Forbidden` - Insufficient permissions for the requested resource
- `404 Not Found` - Requested resource does not exist
- `409 Conflict` - Resource already exists or constraint violation
- `500 Internal Server Error` - Server-side error

### Error Details

Some endpoints may include additional `details` field with more specific error information:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

---

## Example Requests

### Using curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get workouts (authenticated)
curl -X GET http://localhost:3000/api/workouts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Search exercises
curl -X GET "http://localhost:3000/api/exercises?search=chest&category=STRENGTH&limit=10"
```

### Using JavaScript Fetch

```javascript
// Login example
const loginResponse = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const { token } = await loginResponse.json();

// Authenticated request example
const workoutsResponse = await fetch("/api/workouts", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 📝 **Documentation Notes**

- **Schema Validation:** All request/response formats are validated against OpenAPI 3.0 schemas
- **Consistency:** This document mirrors the interactive Swagger documentation at `/docs`
- **Testing:** Use Swagger UI for live API testing and schema validation
- **Updates:** When API changes occur, both this document and Swagger schemas are updated simultaneously

For the most up-to-date API testing experience, visit the **Swagger UI at `/docs`** which provides:

- Real-time API testing
- Authentication token management
- Detailed schema validation
- Interactive response examples
