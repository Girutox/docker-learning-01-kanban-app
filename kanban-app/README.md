# Kanban App

## Overview
The Kanban App is a project management tool designed to help teams visualize their work, maximize efficiency, and improve continuously. This application is built using Angular and follows the Kanban methodology.

## Features
- Create, edit, and delete tasks
- Drag and drop tasks between columns
- Assign tasks to team members
- Set due dates and priorities
- Filter and search tasks
- Responsive design for mobile and desktop

## Technologies Used
- Angular
- Firebase (for realtime database connection)
- HTML, CSS, and TypeScript

## Installation
To get started with the Kanban App, follow these steps:

1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/kanban-app.git
  ```
2. Navigate to the project directory:
  ```bash
  cd kanban-app
  ```
3. Install the dependencies:
  ```bash
  npm install
  ```
4. Start the development server:
  ```bash
  ng serve
  ```
5. Open your browser and navigate to `http://localhost:4200`.

## Environment Setup
To configure the environment variables for the Kanban App, follow these steps:

1. Create a new file named `.env` in a folder called `environments` in the root directory of the project.
2. Add your environment-specific variables to the `.env` file. For example:
  ```env
  FIREBASE_API_KEY=your-value
  FIREBASE_AUTH_DOMAIN=your-value
  FIREBASE_PROJECT_ID=your-value
  FIREBASE_APP_ID=your-value
  ```
3. Ensure that the `.env` file is included in your `.gitignore` file to prevent it from being pushed to the repository:
  ```
  .env
  ```
4. The file named `set-env.ts` inside the folder `environments` will handle the creation of the file named `environments.ts` in the same folder.

By following these steps, you can securely manage your environment variables without exposing sensitive information in your repository.

## Usage
1. Create a new board and add columns (e.g., To Do, In Progress, Done).
2. Add tasks to the columns and assign them to team members.
3. Drag and drop tasks to move them between columns as work progresses (coming soon).
4. Use filters and search to find specific tasks quickly (coming soon).

## Contributing
We welcome contributions to the Kanban App! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:
  ```bash
  git checkout -b feature/your-feature-name
  ```
3. Make your changes and commit them:
  ```bash
  git commit -m "Add your message here"
  ```
4. Push to the branch:
  ```bash
  git push origin feature/your-feature-name
  ```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact
For any questions or suggestions, please contact us at [giancarlo.hoyos@gmail.com].
