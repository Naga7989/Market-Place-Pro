# ── Build stage ──────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first (cached separately from source)
RUN mvn dependency:go-offline -B
COPY src ./src
# Build without tests; preview features enabled for Java 21
RUN mvn package -DskipTests -B

# ── Run stage ────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/marketplace-backend-1.0.0.jar app.jar

# Expose the port Render maps to
EXPOSE 8080

# JVM flags tuned for Render free tier (512 MB RAM):
#   -XX:+UseContainerSupport   — detect container memory limits
#   -XX:MaxRAMPercentage=70.0  — use max 70% of container RAM for heap
#   -Djava.security.egd=...    — faster startup (non-blocking RNG)
#   --enable-preview           — required by pom.xml compiler config
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=70.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "--enable-preview", \
  "-jar", "app.jar", \
  "--spring.profiles.active=prod"]
