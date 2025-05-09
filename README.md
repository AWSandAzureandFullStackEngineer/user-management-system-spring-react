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

# Kubernetes Setup with Docker Desktop and Kubeadm

This guide explains how to set up and use Kubernetes via `kubeadm` and Docker Desktop on a local machine for development and testing purposes.

---

## 🚀 Overview

There are **two main ways** to use Kubernetes locally:

1. **Docker Desktop Kubernetes** (easy and fast for development).
2. **kubeadm** (for simulating real-world clusters and learning how clusters are built from scratch).

> This README walks you through both approaches, but emphasizes using `kubeadm` inside Docker containers for deeper learning and flexibility.

---

## 🛠️ Prerequisites

Make sure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
- [VirtualBox or VMware](https://www.virtualbox.org/) (if using VMs)
- Optional: [Kind](https://kind.sigs.k8s.io/) or [Minikube](https://minikube.sigs.k8s.io/)

---

## Enable Kubernetes in Docker Desktop

### ✅ Steps

1. Open Docker Desktop.
2. Go to **Settings > Kubernetes**.
3. Check **Enable Kubernetes**.
4. Click **Apply & Restart**.

Once enabled, Docker Desktop will install and run a single-node Kubernetes cluster.

### 🔍 Verify

```bash
kubectl version --short
kubectl get nodes
```
---

## ⚙️ Kubernetes Commands Used in This Project

These commands help you set up, manage, and interact with your Kubernetes cluster using `kubectl` and `kubeadm`.

---

### 🔧 Cluster Initialization and Setup


### View all nodes in the cluster
```
kubectl get nodes
```

### View all pods in all namespaces
```
kubectl get pods -A
```

### Apply a manifest (e.g., deployment, service, config)
```
kubectl apply -f <file.yaml>
```

### Delete resources defined in a manifest
```
kubectl delete -f <file.yaml>
```

### Inspect details about a specific pod
```
kubectl describe pod <pod-name>
```

### View logs from a container in a pod
```
kubectl logs <pod-name>
```

### Forward a local port to a Kubernetes service
```
kubectl port-forward svc/<service-name> 8080:80
```

# Here’s a sample Kubernetes deployment and service manifest for your backend app 
```
# backend-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  labels:
    app: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: your-docker-registry/your-backend-image:latest
          ports:
            - containerPort: 8080
          env:
            - name: DATABASE_URL
              value: "postgres://username:password@postgres-service:5432/yourdb"
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: NodePort
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30001
```

📌 How to Use:
Replace:

your-docker-registry/your-backend-image:latest with your actual image URL.

DATABASE_URL with your actual database connection string.

Adjust containerPort, targetPort, and nodePort if needed.

Apply the manifest:

```
kubectl apply -f backend-deployment.yaml
```

Check service:
```
kubectl get svc
```
Access the backend via:

```
http://<NODE_IP>:30001
```

Here is a complete PostgreSQL deployment and service manifest

📌 Replace the following placeholders:

yourdb: Your database name.

username: Your PostgreSQL username.

password: Your PostgreSQL password.

```
# postgres-deployment.yaml

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  labels:
    app: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: yourdb
            - name: POSTGRES_USER
              value: username
            - name: POSTGRES_PASSWORD
              value: password
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  type: ClusterIP
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
```

Here's a simpler and more organized way to structure your Kubernetes manifests. This approach uses a dedicated folder and a single command to apply all resources.

📁 Folder Structure
Create a folder named k8s-manifests and place your Kubernetes YAML files inside it:
```
project-root/
├── k8s-manifests/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   └── ingress.yaml              
├── README.md
└── ...
```
📥 Step-by-Step: Deploy All Manifests
✅ Create the folder:

```
mkdir k8s-manifests
```

📄 Add manifest files to the folder:

backend-deployment.yaml

backend-service.yaml

postgres-deployment.yaml

postgres-service.yaml

📦 Deploy all manifests at once:
```
kubectl apply -f k8s-manifests/
```

✅ Verify deployment:

```
kubectl get pods
kubectl get svc
kubectl get deployments
```

🧼 Clean Up All Resources
```
kubectl delete -f k8s-manifests/
```








