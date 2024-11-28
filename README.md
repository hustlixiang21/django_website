# A Great Epic

## Table of Contents

- [A Great Epic](#a-great-epic)
  - [Table of Contents](#table-of-contents)
  - [Project Description](#project-description)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Directory Structure](#directory-structure)
  - [Installation \& Setup](#installation--setup)
  - [Future Improvements](#future-improvements)

## Project Description

This project is a competitive game platform designed to support both single-player AI training and multiplayer gameplay with real-time synchronization. It includes features such as secure multi-platform login, JWT for secure data exchange, OAuth 2.0 authentication, matchmaking, and deployment on Huawei Cloud. The backend is built using Django, with AJAX for enhanced front-end interactivity and WebSocket for real-time multiplayer communication.

## Features

1. Competitive Game with AI Training
    * Players can engage in single-player mode where they train against an AI opponent.
    * The AI adapts to the player's performance, providing an increasingly challenging experience.
    * The game tracks player actions and adjusts the difficulty level dynamically based on the player's progress.
2. Multiplayer Matchmaking
   * Real-time multiplayer gameplay allows users to challenge others over the internet.
   * Matchmaking functionality helps players find suitable opponents based on their skill levels.
   * The game uses Redis for centralized room management, ensuring that players are connected to the correct game instance.
3. Multi-Platform Login
   * Supports both web and AcApp platforms, enabling users to play across devices.
   * OAuth 2.0 is implemented for user authentication and authorization, allowing secure login and seamless access to the game on multiple platforms.
4. AJAX-based Responsive Interactions
   * The game uses AJAX to enhance the user experience, providing dynamic and seamless interactions.
   * Players can interact with the game in real-time without the need to reload the page, improving gameplay and reducing wait times.
5. Real-Time Multiplayer Synchronization
   * WebSocket is used for real-time synchronization of player actions, including movements, skills, and chat messages.
   * Redis manages game rooms, ensuring that all connected players are synchronized and have a consistent game state throughout the match.
6. Cloud Deployment
   * The game is deployed on a Huawei Cloud server using Docker, which ensures both portability and scalability.
   * Nginx acts as a reverse proxy, handling incoming requests, managing load balancing, and ensuring high availability of the application.

## Technology Stack

- Backend: Django (Python)
- Frontend: HTML, CSS, JavaScript (AJAX for dynamic interaction)
- Real-Time Communication: WebSocket, Redis (for room management and message synchronization)
- Authentication: OAuth 2.0 (for secure login)
- Matchmaking: Thrift (for efficient multi-threaded communication)
- Database: SQLite (for local development)
- Containerization: Docker
- Web Server: Nginx
- Cloud Platform: Huawei Cloud

## Directory Structure

```txt
.
├── README.md                   # Project documentation
├── db.sqlite3                  # SQLite database file
├── game/                        # Game-related Django application
│   ├── admin.py                 # Admin interface configuration
│   ├── consumers/               # WebSocket consumers for multiplayer
│   ├── migrations/              # Database migrations
│   ├── models/                  # Models for player, follow, and post
│   ├── static/                  # Static files (CSS, JS, images)
│   ├── templates/               # HTML templates for views
│   ├── tests.py                 # Unit tests
│   ├── views/                   # Views for game-related pages
│   └── urls/                    # URL routing for game-related pages
├── manage.py                    # Django project management script
├── match_system/                # Matchmaking system logic
│   ├── src/                     # Source code for matchmaking server
│   └── thrift/                  # Thrift definitions for matchmaking
├── requirements.txt             # Python dependencies
├── scripts/                     # Utility scripts for deployment and optimization
│   ├── compress_game_js.sh      # Script to compress JavaScript files
│   └── uwsgi.ini                # uWSGI configuration file for deployment
├── static/                      # Static assets (CSS, JS, images)
├── website/                     # Main Django application settings
│   ├── settings.py              # Project settings
│   ├── urls.py                  # Project URL routing
--
```

## Installation & Setup

To set up the project locally, follow these steps:

1. Clone the repository

    ```bash
    git clone https://github.com/hustlixiang21/django_website.git
    cd django_website
    ```

2. Install dependencies
    Make sure you have Python 3 installed, and then install the required Python packages.

    ```bash
    pip install -r requirements.txt
    ```

3. Set up the database
    Run the following command to apply database migrations:

    ```bash
    python manage.py migrate
    ```

4. Start the development server
    Run the following command to start the Django development server:

    ```bash
    python manage.py runserver
    ```

5. Access the app
   Open your web browser and go to `http://127.0.0.1:8000/` to access the game platform.

Configure Nginx:

Set up Nginx as a reverse proxy for your Django application. Make sure to configure your domain and SSL certificates as needed.
Deploy to Huawei Cloud:

Use Huawei Cloud's Docker-based infrastructure to deploy the application.
Configure the necessary cloud settings (e.g., virtual private server, security groups).

## Future Improvements

* AI Enhancements: Improve AI difficulty and behavior for a more challenging single-player experience.
* Expanded Platforms: Extend support to more platforms (e.g., mobile, desktop apps).
* Matchmaking Optimizations: Refine matchmaking algorithms and optimize performance under heavy traffic.