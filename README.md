# CityInfo – ASP.NET Core 10 Web API + Angular

Full-stack oefenproject: een REST API voor steden en hun bezienswaardigheden, met een Angular-front-end om in te loggen, te registreren en steden te bekijken.

De API is gebaseerd op de Pluralsight-cursus **"Getting Started with ASP.NET Core 10 Web API"** en uitgebreid met eigen functionaliteit. De Angular-front-end heb ik zelf gebouwd.

## Wat ik zelf heb toegevoegd

**Back-end**
- Echte gebruikersregistratie en login in plaats van een hardgecodeerde demogebruiker
- `User`-entiteit met unieke gebruikersnaam + EF Core-migration
- Wachtwoorden gehasht met ASP.NET Core `PasswordHasher<User>`
- `UserService` en `UserRepository` (business logic gescheiden van data-access)
- Genormaliseerde gebruikersnamen (case-insensitive) met `409 Conflict` bij duplicaten
- CORS-policy voor de Angular-client

**Front-end (Angular 22)**
- Login- en registratieformulieren met signal forms en validatie
- `AuthService` die de JWT bewaart en de vervaldatum controleert
- HTTP-interceptor die automatisch de Bearer-token meestuurt en bij `401` uitlogt
- Route guard die beveiligde pagina's afschermt
- Stedenlijst met zoeken en paginering (via de `X-Pagination`-header)

## Tech stack

| Back-end | Front-end |
|---|---|
| .NET 10, ASP.NET Core Web API | Angular 22, TypeScript |
| Entity Framework Core + SQLite | Signal forms, standalone components |
| JWT-authenticatie | HttpClient, interceptors, guards |
| API versioning, AutoMapper | |
| Serilog, OpenAPI + Scalar | |

## Lokaal starten

### Vereisten
- .NET 10 SDK
- Node.js + Angular CLI
- EF Core tools: `dotnet tool install --global dotnet-ef`

### 1. API

```powershell
cd CityInfo.API

# JWT-signing key instellen (wordt NIET in de repo bewaard)
$key = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
dotnet user-secrets set "Authentication:SecretForKey" $key

# database aanmaken
dotnet ef database update

# starten
dotnet run --launch-profile https
```

De API draait op `https://localhost:7164`. API-documentatie (Scalar): `https://localhost:7164/scalar`.

### 2. Front-end

```powershell
cd cityinfo-web
npm install
ng serve
```

Open `http://localhost:4200`, registreer een gebruiker en log in.

### Testen met .http-bestanden
`CityInfo.API/CityInfo.API-demo.http` bevat requests voor registratie, login en alle endpoints (te gebruiken in Visual Studio of VS Code met de REST Client-extensie).

## Projectstructuur

```
CityInfo/
├── CityInfo.API/        ASP.NET Core Web API
│   ├── Controllers/     endpoints
│   ├── Services/        business logic + repositories
│   ├── Entities/        EF Core-entiteiten
│   ├── Models/          DTO's
│   ├── Profiles/        AutoMapper-profielen
│   ├── DbContexts/      CityInfoContext + seed data
│   └── Migrations/
└── cityinfo-web/        Angular-client
    └── src/app/
        ├── core/        services, interceptor, guard
        ├── features/    auth (login/register), cities
        └── models/
```
