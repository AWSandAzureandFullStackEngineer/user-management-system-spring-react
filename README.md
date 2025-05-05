# User Management System - Spring Boot Backend

This project provides a backend API for a User Management System (UMS) built with Spring Boot. It includes features for user registration and retrieval, with role-based access control.

## Features

* **User Creation:** Register new users via a REST API endpoint.
* **Get All Users:** Retrieve a list of all registered users (requires ADMIN role).
* **Database:** Uses PostgreSQL for data persistence.
* **Schema Management:** Uses Flyway for database schema migrations.
* **API Documentation:** Uses SpringDoc OpenAPI (Swagger UI) for interactive API documentation.
* **Security:** Uses Spring Security for basic authentication and role-based authorization.
* **Testing:** Includes Unit, Integration, and Component tests using JUnit 5, Mockito, AssertJ, and Spring Boot Test utilities.

## Technologies Used

* **Framework:** Spring Boot 3.3.x
* **Language:** Java 21
* **Database:** PostgreSQL 16
* **Build Tool:** Apache Maven
* **Containerization:** Docker & Docker Compose
* **Persistence:** Spring Data JPA / Hibernate
* **Migrations:** Flyway
* **Mapping:** MapStruct
* **Security:** Spring Security (HTTP Basic, Role-based)
* **API Docs:** SpringDoc OpenAPI (Swagger UI)
* **Testing:** JUnit 5, Mockito, AssertJ, Spring Boot Test, H2 (for tests)
* **Utilities:** Lombok

## Setup and Configuration

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/AWSandAzureandFullStackEngineer/user-management-system-spring-react.git](https://github.com/AWSandAzureandFullStackEngineer/user-management-system-spring-react.git)
    cd user-management-system-spring-react/user-management-system # Navigate to the Spring Boot project root
    ```
2.  **Prerequisites:**
    * Java 21 JDK installed.
    * Apache Maven installed (or use the included Maven wrapper `./mvnw`).
    * Docker and Docker Compose installed and running.
3.  **Environment Variables (`.env` file - Optional):**
    * You can create a file named `.env` in the project root directory (where `docker-compose.yml` resides) to override default database credentials or ports used by Docker Compose. **Do not commit this file to Git.**
    * *Example `.env` content:*
        ```env
        POSTGRES_USER=my_db_user
        POSTGRES_PASSWORD=my_secret_password
        POSTGRES_DB=my_ums_database
        DB_PORT=5433 # Host port for PostgreSQL (if 5432 is taken)
        APP_PORT=8081 # Host port for the Spring Boot app (if 8080 is taken)
        ```
    * If this file is not present, the defaults defined in `docker-compose.yml` will be used (`ums_user`, `changeme_password`, `user_management_db`).

## Building and Running

1.  **Build the Application JAR:**
    * Navigate to the project root directory in your terminal.
    * Run the Maven wrapper to build the executable JAR:
        * Linux/macOS: `./mvnw clean package`
        * Windows: `.\mvnw.cmd clean package`
    * This creates the JAR file in the `target/` directory.
2.  **Run with Docker Compose:**
    * Ensure Docker is running.
    * From the project root directory, run:
        ```bash
        docker-compose up --build -d
        ```
        * `--build`: Builds the `app` Docker image using the `Dockerfile`. Needed the first time or after code changes.
        * `-d`: Runs the containers (PostgreSQL database and Spring Boot app) in detached mode (background).
3.  **Verify Services:**
    * Check container status: `docker-compose ps` (Both `ums_postgres_db` and `ums_spring_app` should be 'Up' and healthy).
    * View application logs: `docker-compose logs -f app`
    * View database logs: `docker-compose logs -f db`
4.  **Application Access:**
    * The API will be available at `http://localhost:8080` (or `http://localhost:<APP_PORT>` if you set `APP_PORT` in `.env`).
    * **API Documentation (Swagger UI):** Access interactive documentation at `http://localhost:8080/swagger-ui.html`.

## Running Tests

* To run all tests (Unit, Integration, etc.) using Maven:
    ```bash
    # Linux/macOS
    ./mvnw test

    # Windows
    .\mvnw.cmd test
    ```
* Test reports can be found in `target/surefire-reports/`.

## Key Components Explained

* **`UserController`:** Handles incoming HTTP requests for `/api/v1/users`, validates input DTOs, delegates business logic to `UserService`, and formats responses.
* **`UserService`/`UserServiceImpl`:** Contains the core business logic for user management, such as checking for duplicates, hashing passwords, interacting with the `UserRepository`, and mapping between DTOs and entities. Uses `@Transactional` for database transaction management.
* **`UserRepository`:** Spring Data JPA interface for database operations on the `User` entity. Includes derived queries and custom native queries.
* **`User` Entity:** JPA entity representing the `users` (or `app_users` - ensure consistency!) table in the database. Includes mappings for columns and relationships (like roles).
* **DTOs (`UserRequestDTO`, `UserResponseDTO`):** Data Transfer Objects used to define the structure of data sent to and received from the API, decoupling the API contract from the internal entity structure. Includes validation annotations (`@Valid`, `@NotBlank`, etc.).
* **`UserMapper`:** MapStruct interface responsible for generating code to map data between DTOs and the `User` entity.
* **`SecurityConfig`:** Configures Spring Security, including defining the `PasswordEncoder` bean, setting up HTTP security rules (authorization), enabling HTTP Basic authentication, and configuring session management.
* **`CustomUserDetailsService`:** Implements Spring Security's `UserDetailsService` to load user credentials and roles from the database via `UserRepository`.
* **`DataInitializer`:** An `ApplicationRunner` bean that creates a default `admin` user on startup if one doesn't exist.
* **Flyway Migrations (`src/main/resources/db/migration`):** SQL scripts (`V*.sql`) that define database schema changes. Flyway automatically applies pending migrations when the application starts.

## Stopping the Application

* To stop the running Docker containers:
    ```bash
    docker-compose down
    ```
* To stop the containers AND remove the PostgreSQL data volume (deletes all database data):
    ```bash
    docker-compose down -v
    ```
