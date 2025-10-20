# food-delivery-microservices

## 🚀 Getting Started

### Prerequisites

Ensure you have the following tools installed on your machine:
* **Docker**
* **Docker Compose**

### Running the Application

1.  Clone this repository to your local machine.
2.  Open a terminal at the **root of the project** (where the `docker-compose.yml` file is located).
3.  Run the following command to build the images and start all containers:
    ```bash
    docker-compose up --build
    ```
    The `--build` flag is important on the first run to build the Docker images from the `Dockerfile`s.

## 🛠️ How to Use

Once the containers are running, the application is accessible at the following addresses:

* **Frontend (User Application)**: [http://localhost:5173](http://localhost:5173)
* **Backend (Restaurants API)**: [http://localhost:8082/restaurants](http://localhost:8082/restaurants)

The PostgreSQL database is also exposed on port `5432` if you wish to connect to it with a database client.

## 🗺️ API Endpoints (`RestaurantService`)

| Method | URL | Description |
| :--- | :--- | :--- |
| `GET` | `/restaurants` | Retrieves the list of all restaurants. |
| `GET` | `/restaurants/{id}` | Retrieves a restaurant by its ID. |
| `POST` | `/restaurants` | Creates a new restaurant. |
| `PUT` | `/restaurants/{id}` | Updates an existing restaurant. |
| `DELETE`| `/restaurants/{id}` | Deletes a restaurant. |
| `GET` | `/restaurants/{id}/menu` | Retrieves the menu for a restaurant. |

## 🔮 Future Work

* **Add other microservices**:
    * `UserService` for authentication and profile management.
    * `DriverService` for driver management and geolocation tracking.
    * `OrderService` to orchestrate the ordering process.
* **Implement an API Gateway** (e.g., Spring Cloud Gateway) to act as a single entry point.
* **Integrate a message broker** (e.g., RabbitMQ) for asynchronous communication between services.