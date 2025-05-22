# Phaser Space Shooter Game

This is a simple space shooter game built with Phaser 3 and TypeScript, created as a test project.

## Prerequisites

To build and run this game, you will need:

-   **Node.js and npm:** These are required for managing project dependencies (like Phaser and TypeScript) and running various scripts. You can download them from [nodejs.org](https://nodejs.org/).

## Setup

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**
    Open your terminal in the project root directory and run:
    ```bash
    npm install
    ```
    This command will download and install Phaser, TypeScript, and any other necessary development tools defined in `package.json`.

## Building the Game

The game is written in TypeScript (`.ts` files located in the `src` directory) and needs to be compiled into JavaScript (`.js` files) to run in a browser.

1.  **Compile TypeScript:**
    Run the following command in your terminal from the project root:
    ```bash
    npx tsc
    ```
    This command uses the TypeScript compiler (invoked via `npx` which runs the version specified in `node_modules`) to compile the files according to the `tsconfig.json` configuration. The compiled JavaScript output will be placed in the `dist` folder (e.g., `dist/game.js`).

## Running the Game

Due to browser security restrictions (CORS policy), you cannot run the game by simply opening the `index.html` file directly from your file system. You need to serve the project files using a local HTTP server.

Here are a couple of ways to do this:

1.  **Using `http-server` (Node.js package):**
    -   If you don't have `http-server` installed, you can run it directly using `npx`:
        ```bash
        npx http-server .
        ```
    -   Alternatively, you can install it globally:
        ```bash
        npm install -g http-server
        ```
        And then run:
        ```bash
        http-server .
        ```
    -   By default, it will serve the current directory (`.`) on `http://localhost:8080`.

2.  **Using Python's built-in HTTP server:**
    -   If you have Python installed, you can use its simple HTTP server.
    -   For Python 3:
        ```bash
        python -m http.server 8000
        ```
    -   For Python 2 (less common now):
        ```bash
        python -m SimpleHTTPServer 8000
        ```
    -   This will serve the current directory on `http://localhost:8000`.

**Accessing the Game:**

Once the server is running, open your web browser and navigate to the address provided by the server (e.g., `http://localhost:8080` or `http://localhost:8000`). You should see `index.html` load, and the game will start.

---

Happy gaming!
