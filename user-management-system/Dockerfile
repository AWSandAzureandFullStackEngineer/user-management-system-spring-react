# Dockerfile for Spring Boot User Management System (Java 21, Maven)

# --- Stage 1: Build Stage ---
# Use a JDK image to build the application
FROM eclipse-temurin:21-jdk-jammy AS builder

# Set the working directory in the container
WORKDIR /app

# Copy Maven wrapper files (if used) first to leverage Docker cache
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN rm -rf /root/.m2/repository

# Download dependencies. This layer will be cached if pom.xml/wrapper doesn't change.
# Use --batch-mode for non-interactive builds
RUN ./mvnw dependency:go-offline --batch-mode

# Copy the application source code
COPY src ./src

# Build the application JAR. Skip tests as they should run in CI, not during image build.
# Ensure the Spring Boot Maven plugin is configured to create an executable JAR.
RUN ./mvnw package -DskipTests --batch-mode

# --- Stage 2: Runtime Stage ---
# Use a smaller JRE image for the final runtime environment
FROM eclipse-temurin:21-jre-jammy

# Set the working directory
WORKDIR /app

# Create a non-root user and group for security best practices
# Running as a non-root user limits potential container breakout vulnerabilities.
RUN groupadd --system spring && useradd --system --gid spring springuser
USER springuser

# Copy *only* the built JAR from the builder stage
# Adjust the path if your build tool generates the JAR elsewhere or with a different name.
# Spring Boot Maven plugin typically places it in /target
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the application runs on (default Spring Boot port)
# This is metadata; the port still needs to be published via `docker run -p`
EXPOSE 8080

# Define the command to run the application when the container starts
# Using the 'exec' form is recommended
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
