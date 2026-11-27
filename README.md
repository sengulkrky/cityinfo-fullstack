# CityInfo – ASP.NET Core 10 Web API + Angular

Full-stack practice project: a REST API for cities and their points of interest, with an Angular front-end to log in, register and browse cities.

The API is based on the Pluralsight course **"Getting Started with ASP.NET Core 10 Web API"** and extended with my own features. I built the Angular front-end myself.

## What I added myself

**Back-end**
- Real user registration and login instead of a hard-coded demo user
- `User` entity with a unique username + EF Core migration
- Passwords hashed with ASP.NET Core `PasswordHasher<User>`
- `UserService` and `UserRepository` (business logic separated from data access)
- Normalized usernames (case-insensitive) with `409 Conflict` on duplicates
- CORS policy for the Angular client

**Front-end (Angular 22)**
- Login and registration forms with signal forms and validation
- `AuthService` that stores the JWT and checks its expiry date
- HTTP interceptor that automatically sends the Bearer token and logs out on `401`
- Route guard that protects secured pages
- City list with search and pagination (via the `X-Pagination` header)

## Tech stack

| Back-end | Front-end |
|---|---|
| .NET 10, ASP.NET Core Web API | Angular 22, TypeScript |
| Entity Framework Core + SQLite | Signal forms, standalone components |
| JWT authentication | HttpClient, interceptors, guards |
| API versioning, AutoMapper | |
| Serilog, OpenAPI + Scalar | |

## Running locally

### Requirements
- .NET 10 SDK
- Node.js + Angular CLI
- EF Core tools: `dotnet tool install --global dotnet-ef`

### 1. API

```powershell
cd CityInfo.API

# Set the JWT signing key (NOT stored in the repo)
$key = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
dotnet user-secrets set "Authentication:SecretForKey" $key

# Create the database
dotnet ef database update

# Start
dotnet run --launch-profile https
```

The API runs on `https://localhost:7164`. API documentation (Scalar): `https://localhost:7164/scalar`.

### 2. Front-end

```powershell
cd cityinfo-web
npm install
ng serve
```

Open `http://localhost:4200`, register a user and log in.

### Testing with .http files
`CityInfo.API/CityInfo.API-demo.http` contains requests for registration, login and all endpoints (usable in Visual Studio, or in VS Code with the REST Client extension).

## Project structure

```
CityInfo/
├── CityInfo.API/        ASP.NET Core Web API
│   ├── Controllers/     endpoints
│   ├── Services/        business logic + repositories
│   ├── Entities/        EF Core entities
│   ├── Models/          DTOs
│   ├── Profiles/        AutoMapper profiles
│   ├── DbContexts/      CityInfoContext + seed data
│   └── Migrations/
└── cityinfo-web/        Angular client
    └── src/app/
        ├── core/        services, interceptor, guard
        ├── features/    auth (login/register), cities
        └── models/
```
