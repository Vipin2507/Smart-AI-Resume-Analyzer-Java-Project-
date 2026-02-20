# Build stage - Maven with Java 17
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Copy pom and download dependencies (cached unless pom changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build runnable JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage - JRE only
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy JAR from builder (Spring Boot repackages to single JAR)
COPY --from=builder /app/target/*.jar app.jar

# Non-root user for security
RUN useradd -m appuser
USER appuser

EXPOSE 8080

# PORT and DB/JWT are provided via environment at runtime
ENTRYPOINT ["java", "-jar", "app.jar"]
