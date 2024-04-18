# Lottify UI

---

Lottify UI assists with providing an interface required to list, search, preview, upload and retrieve lottie files

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

<!-- TABLE OF CONTENTS -->

## Table of Contents

<details open>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#Design Decision">Design Decision</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li></li><a href="#contributor">Contributor</a></li>
  </ol>
</details>

## About The Project

This project is a UI for the Lottify API. It provides an interface to list, search, preview, upload and retrieve lottie files. The project is built mainly using Next.js, GraphQl and Tailwind CSS. The project is deployed on Vercel.

DEMO: [Lottify UI](https://lottify-ui.vercel.app/)

### Built With

<div>
  <a href="https://reactjs.org/"/>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  </a>

  <a href="https://nextjs.org/"/>
    <img src="https://img.shields.io/badge/Next.js-20232A?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>

  <a href="https://graphql.org/"/>
    <img src="https://img.shields.io/badge/GraphQL-20232A?style=for-the-badge&logo=graphql&logoColor=E10098" alt="GraphQL" />
  </a>

  <a href="https://tailwindcss.com/"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-20232A?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC" alt="Tailwind CSS" />
  </a>

  <a href="https://vercel.com/"/>
    <img src="https://img.shields.io/badge/Vercel-20232A?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </a>

  <a href="https://eslint.org/"/>
    <img src="https://img.shields.io/badge/ESLint-20232A?style=for-the-badge&logo=eslint&logoColor=4B32C3" alt="ESLint" />
  </a>

  <a href="https://prettier.io/"/>
    <img src="https://img.shields.io/badge/Prettier-20232A?style=for-the-badge&logo=prettier&logoColor=F7B93E" alt="Prettier" />
  </a>

  <!-- Typescript -->
  <a href="https://www.typescriptlang.org/"/>
    <img src="https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge&logo=typescript&logoColor=3178C6" alt="TypeScript" />
  </a>

  <!-- Commitlint -->
  <a href="https://commitlint.js.org/"/>
    <img src="https://img.shields.io/badge/Commitlint-20232A?style=for-the-badge&logo=commitlint&logoColor=white" alt="Commitlint" />
  </a>
</div>

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repo

```bash
git clone https://github.com/shettayyy/lottify-ui
```

2. Install NPM packages

```bash
npm install
```

3. Add the `.env` file that has been shared with you in the root directory and make sure the following environment variables are available:

```bash
NEXT_PUBLIC_API_URL=<API_URL>
```

## Usage

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For production build:

```bash
npm run build
npm run start
```

## Design Decision

##### PWA Features

This is a Progressive Web Application (PWA) that uses the Lottify API to list, search, preview, upload and retrieve lottie files.

I am using `next-pwa` with Next.js to make this a PWA.

This application is built offline-first where the network requests handled via Apollo Client is cached using apollo3-cache-persist with a localforage wrapper which is smart to pick the right storage solution based on the users browser. The application is designed to work offline and provide a seamless experience to the user.

I have also provided user the option to install the application on their device by providing a prompt to install the application when they visit the application for the first time. The prompt is shown even if the user cancels the prompt on reload. **The code to show the prompt after 2 days after cancel** has been commented for a better review process.

The user is shown the offline status via toast and the red dot next to app logo on the header using window.navigator.onLine API. We also detect the network status change and show the toast accordingly.

We also provide a fallback UI when the user is offline and the data is not available in the cache.

##### Uploads

The user can upload a lottie file by clicking on the upload button on the header. The user can select a file from their device and upload it. The file is uploaded to the server and the user is shown a menu with the progress. The user can then search for the uploaded file and preview it.

I am using react-dropzone to handle the file upload. The file is uploaded to the server using a POST request to the API.

I am performing chunked uploads to the server to handle large files. Files are uploaded to S3 presigned URLs and the server is notified when the upload is complete. The server then processes the file and adds it to the database.

##### Responsive Design

The application is designed to be responsive and work on all devices. I am using Tailwind CSS for styling and have used the utility classes to make the application responsive. The layout is built using flexbox and grid to make the application responsive and mobile-friendly.

##### Search

The user can search for a lottie file by typing in the search bar. The search is performed on the filename, author, description and user filename of the lottie file. The search input is debounced to reduce the number of requests to the server. You can clear the search by clicking on the clear button on the search bar.

##### Download

The user can download a lottie file by clicking on the download button on the listed card (top right). The file is downloaded to the user's device.

##### Linting

I am using ESLint, Typescript and Prettier to lint the code. The code is linted on every commit using husky and lint-staged.

## Deployment

This project is deployed on [Vercel](https://vercel.com/). The deployment is done automatically when a PR is merged to the main branch.

## Contributor

- [Shettayyy](https://github.com/shettayyy)
