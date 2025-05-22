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
    This command will download and install Phaser, TypeScript, and any other necessary development tools defined in `package.json`. You may also need to install `esbuild` if you intend to use it for bundling (see "Bundling for the Browser" section).

## Audio Assets

**Important Note:** The audio files currently included in the `assets/sounds/` and `assets/music/` directories are **placeholders only**. They do not contain actual audio data.

-   **Placeholder Files:**
    -   `assets/sounds/player_shoot.wav`
    -   `assets/sounds/enemy_hit.wav`
    -   `assets/sounds/player_hit.wav`
    -   `assets/music/background.mp3`

-   **Required Action:**
    For sound effects and music to work correctly in the game, you **must replace these placeholder files** with valid audio files (e.g., actual `.wav` or `.mp3` files). Ensure the replacement files use the same names and are placed in the same directories.

-   **Behavior with Placeholders:**
    If the placeholder files are used as-is (i.e., they are empty or invalid audio format):
    -   The game will **not** crash. Recent code changes include checks to prevent errors if audio files are missing or invalid.
    -   However, you will likely see "Error decoding audio data" messages (or similar) in your browser's developer console.
    -   No sound effects or music will be heard.

## Building the Game

The game is written in TypeScript (`.ts` files located in the `src` directory) and needs to be compiled into JavaScript (`.js` files).

1.  **Compile TypeScript:**
    Run the following command in your terminal from the project root:
    ```bash
    npx tsc
    ```
    This command uses the TypeScript compiler (invoked via `npx` which runs the version specified in `node_modules`) to compile the files according to the `tsconfig.json` configuration. The compiled JavaScript output will be placed in the `dist` folder (e.g., `dist/game.js`). This output uses CommonJS modules, which are not directly usable by browsers.

## Bundling for the Browser

When TypeScript is compiled with `module: "commonjs"` (as configured in `tsconfig.json`), it produces JavaScript files that use `require()` to import modules. Browsers do not natively support `require()`. A bundler is needed to resolve these modules and create a single JavaScript file that can run in the browser.

We recommend `esbuild` for its speed and simplicity.

### Using esbuild

1.  **Installation (if not already installed as part of project setup):**
    If you haven't installed `esbuild` yet, run:
    ```bash
    npm install --save-dev esbuild
    ```

2.  **Bundling Command:**
    After compiling with `npx tsc`, run the following command to bundle the output:
    ```bash
    npx esbuild dist/game.js --bundle --outfile=bundle.js --format=iife
    ```
    -   `dist/game.js`: This is the main entry point file produced by the TypeScript compiler (`tsc`).
    -   `--bundle`: Tells `esbuild` to inline any imported dependencies into the output file.
    -   `--outfile=bundle.js`: Specifies the name of the output file (e.g., `bundle.js`). This is the file you will include in your `index.html`.
    -   `--format=iife`: Outputs the code as an Immediately Invoked Function Expression. This is a good format for browser scripts as it helps avoid polluting the global scope.

## Running the Game

To play the game, you need to compile the TypeScript, bundle the JavaScript, and then serve the project files using a local HTTP server.

1.  **Install all dependencies:**
    ```bash
    npm install 
    ```
    (This will install TypeScript, Phaser, and esbuild if listed in `package.json`'s devDependencies).

2.  **Compile TypeScript:**
    ```bash
    npx tsc
    ```

3.  **Bundle JavaScript for the browser:**
    ```bash
    npx esbuild dist/game.js --bundle --outfile=bundle.js --format=iife
    ```
    **Important:** Ensure your `index.html` file is updated to reference this bundled output file. For example, change `<script src="dist/game.js"></script>` to `<script src="bundle.js"></script>`.

4.  **Serve the project locally:**
    Due to browser security restrictions (CORS policy), you cannot run the game by simply opening the `index.html` file directly from your file system.
    Here are a couple of ways to serve it:

    -   **Using `http-server` (Node.js package):**
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

    -   **Using Python's built-in HTTP server:**
        -   If you have Python installed:
        -   For Python 3:
            ```bash
            python -m http.server 8000
            ```
        -   For Python 2:
            ```bash
            python -m SimpleHTTPServer 8000
            ```
        -   This will serve the current directory on `http://localhost:8000`.

5.  **Accessing the Game:**
    Once the server is running, open your web browser and navigate to the address provided by the server (e.g., `http://localhost:8080` or `http://localhost:8000`). You should see `index.html` load, and the game will start.

---

Happy gaming!
