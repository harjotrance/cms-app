# Next.js CMS with WYSIWYG Editor and Plugin Architecture

## Overview

This project is a Content Management System (CMS) built with Next.js, designed to be user-friendly, extensible, and feature-rich. It allows users to create, edit, and manage posts and pages through an intuitive admin interface with a WYSIWYG editor.  A key feature is its plugin architecture, enabling developers to extend the CMS's functionality with custom content blocks and frontend enhancements.

## Key Features

*   **Core CMS Functionalities:**
    *   **Post and Page Management:** Create, Read, Update, and Delete (CRUD) operations for both posts and pages.
    *   **WYSIWYG Editor:** Integrated TinyMCE editor for rich text content creation and formatting.
    *   **Slug Generation:** Automatic URL-friendly slug generation from post/page titles, with editing capability.
    *   **Data Storage:** Utilizes Prisma ORM for efficient and scalable database interactions (database choice is flexible, supports PostgreSQL, MySQL, etc.).

*   **Plugin Architecture:**
    *   **Extensible Plugin System:** Allows for the installation and management of plugins to extend CMS capabilities.
    *   **Content Block Registration:** Plugins can register new content block types, which can be inserted into the WYSIWYG editor.
    *   **Frontend Extensibility:** Plugins can alter the frontend appearance and functionality through custom React components.
    *   **Example Plugins:** Includes example plugins like "Greeting Plugin" and "Image Slider Plugin" to demonstrate plugin development.

*   **User Interface & Experience:**
    *   **Intuitive Admin UI:** User-friendly interface for content management, built with Next.js and Shadcn UI components.
    *   **Theme Switching:** Basic theme switching functionality (Light/Dark mode) implemented using CSS variables and Theme Context.
    *   **Responsive Design:** CMS admin and frontend are designed to be responsive across various screen sizes.

## Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (v15.1.7) - React framework for building web applications.
*   **WYSIWYG Editor:** [TinyMCE](https://www.tiny.cloud/) - Powerful and customizable rich text editor.
*   **ORM (Object-Relational Mapper):** [Prisma](https://www.prisma.io/) - Modern database toolkit for type-safe database access.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development.
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/) - Reusable UI components built with Radix UI and Tailwind CSS.
*   **Language:** JavaScript (primarily).
*   **Database:**  Database choice is flexible and configurable via Prisma (e.g., PostgreSQL, MySQL, SQLite).
*   **Package Manager:** Yarn (recommended) or npm.

## Getting Started

Follow these steps to set up and run the CMS project locally:

### Prerequisites

*   **Node.js:** (version 18 or later recommended) - [Install Node.js](https://nodejs.org/)
*   **Yarn or npm:** (Yarn is recommended) - [Install Yarn](https://yarnpkg.com/getting-started/install) or npm comes with Node.js.
*   **Database Setup:**
    *   Choose a database (e.g., PostgreSQL, MySQL).
    *   Set up a database instance and obtain your database connection URL.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd [your-repository-directory]
    ```

2.  **Install dependencies:**
    ```bash
    yarn install  # Or npm install
    ```

### Database Setup

1.  **Configure Database Connection:**
    *   Create a `.env.local` file in the root of your project.
    *   Add your database connection URL to `.env.local` as `DATABASE_URL`.
        ```env
        DATABASE_URL="your-database-connection-url"
        ```
        *(Replace `your-database-connection-url` with your actual database connection string. See Prisma documentation for format.)*

2.  **Run Prisma Migrations:**
    ```bash
    yarn prisma migrate dev
    ```
    This will create the database schema based on your `schema.prisma` file.

3.  **Generate Prisma Client:**
    ```bash
    yarn prisma generate
    ```
    This generates the Prisma Client code, allowing you to interact with your database.

4.  **Optional: Prisma Studio:**
    You can use Prisma Studio to visually inspect your database:
    ```bash
    yarn prisma studio
    ```

### Environment Variables

*   **`.env.local` file:**
    *   `DATABASE_URL`: Your database connection URL (as set up in Database Setup).
    *   `TINYMCE_API_KEY`: Your TinyMCE API key.  You can get a free API key from [TinyMCE website](https://www.tiny.cloud/).  This is required for the TinyMCE editor to function.

### Running the Development Server

```bash
yarn dev  # Or npm run dev
```

This will start the Next.js development server.

*   Access the CMS Admin Panel: Open your browser and go to http://localhost:3000/admin (adjust port if needed).
*   Access the Frontend: View frontend pages at URLs like http://localhost:3000/posts or http://localhost:3000/pages.

## Plugin Development

The CMS features a component-based plugin architecture. Plugins are located in the components/plugins directory.

### Plugin Structure

Each plugin resides in its own subfolder within components/plugins. A plugin folder typically contains:

*   `manifest.json`: A JSON file describing the plugin's metadata.
*   `index.js` (or `.jsx`, `.tsx`): The main React component for the plugin's content block.

### manifest.json

The `manifest.json` file defines the plugin's properties:

```json
{
  "name": "Plugin Name",          // Display name of the plugin (e.g., "Image Slider")
  "description": "Plugin description", // Short description of the plugin
  "contentBlockType": "pluginIdentifier", // Unique identifier for the plugin (e.g., "imageSlider")
  "component": "./index.js"        // Path to the main plugin component file (relative to manifest.json)
}
```

*   `name`: User-friendly name of the plugin, displayed in the TinyMCE plugin menu.
*   `description`: Short description, used as a tooltip or plugin description in the admin UI.
*   `contentBlockType`: A unique identifier for this plugin type. This is used in plugin placeholders (e.g., greeting, imageSlider).
*   `component`: Path to the main React component file for the plugin, relative to the manifest.json file itself.

### Content Block Component (index.js)

The `index.js` file contains the React component that will be rendered on the frontend when the plugin is used.

```jsx
import React from 'react';

const MyPluginBlock = ({ /* Plugin Data Props (if any) */ }) => {
  return (
    <div>
      {/* Plugin UI and Content here */}
      <h3>My Plugin Block</h3>
      <p>This is a custom content block.</p>
    </div>
  );
};

export default MyPluginBlock;
```

*   Plugin components are standard React functional components.
*   They receive props that can be used to customize the plugin's rendering. Currently, plugins can receive data via the `data` attribute in the plugin placeholder.

### Plugin Placeholder

To insert a plugin into content, use placeholders in the TinyMCE editor with the following format:

```
[plugin:pluginIdentifier data='{"key": "value", ...}']
```

*   `pluginIdentifier`: This matches the `contentBlockType` from the plugin's `manifest.json` (e.g., greeting, imageSlider, videoEmbed).
*   `data='{...}'`: Optional JSON data to configure the plugin instance. Data is passed as props to the plugin component. If no data is needed, use `data='{}`.

## Example: Creating a New Plugin

To create a new plugin, for example, a "Quote" plugin:

*   Create a plugin folder: `components/plugins/quote-plugin`
*   Create `manifest.json` in `components/plugins/quote-plugin`:

```json
{
  "name": "Quote",
  "description": "Display a quote with author.",
  "contentBlockType": "quote",
  "component": "./index.js"
}
```

*   Create `index.js` in `components/plugins/quote-plugin`:

```jsx
import React from 'react';

const QuoteBlock = ({ text, author }) => {
  return (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4">
      <p>{text}</p>
      {author && <footer className="mt-2 text-sm text-gray-500">— {author}</footer>}
    </blockquote>
  );
};

export default QuoteBlock;
```

*   Insert the plugin in TinyMCE: Use the placeholder `[plugin:quote data='{"text": "Your quote here", "author": "Author Name"}']` or use the "Insert Plugin" button in the editor (after the plugin is loaded).

## Plugin Loading and Rendering

*   **Plugin Loading:** The CMS automatically loads plugin manifests from the `components/plugins` directory on the server-side via an API route (`/api/plugins`).
*   **TinyMCE Integration:** Plugin buttons are dynamically added to the TinyMCE toolbar using the `setup` function in the Editor component. Clicking a plugin button inserts the corresponding placeholder into the editor.
*   **Frontend Rendering:** The `PluginRenderer` component (`components/PluginRenderer.js`) is responsible for parsing content, detecting plugin placeholders, dynamically importing plugin components, and rendering them on the frontend. It uses `next/dynamic` for efficient dynamic component loading.

## Theme Switching

Basic theme switching functionality (Light/Dark mode) is implemented using:

*   **Theme Context** (`lib/theme-context.js`): Provides a React Context to manage the current theme and a function to change themes. Persists theme choice in localStorage.
*   **Theme Definitions** (`styles/themes.js`): Defines theme color palettes as JavaScript objects, using CSS variable names.
*   **CSS Variables** (`styles/globals.css`): CSS variables (`--theme-color-...`) are used throughout the CSS to apply theme colors. The `ThemeProvider` component dynamically updates these CSS variables when the theme changes.
*   **Theme Switcher Component** (`components/ThemeSwitcher.js`): A UI component (using Shadcn UI DropdownMenu) to allow users to select and switch between available themes.