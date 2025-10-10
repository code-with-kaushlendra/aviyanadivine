# Use official Maven image with Java 17
FROM maven:3.9.0-eclipse-temurin-17

# Set working directory inside the container
WORKDIR /app

# Copy your project files
COPY . .

# Build the project skipping tests
RUN mvn clean package -DskipTests

# Expose the port your app runs on (adjust if needed)
EXPOSE 8080

# Run the app - adjust if your app's start command is different
CMD ["java", "-jar", "target/your-app-name.jar"]
