# Certie

<p align="center">
<a href="https://github.com/weareneopix/certie-fe" target="blank"><img src="https://i.imgur.com/dXPPY5T.png" width="200" alt="Certie" /></a>

A project based on W3 standard for obtaining, sharing and verifying certificates.

</p>

![ReactJS](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge) ![Typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=for-the-badge)

## Description

Certie is a project based on a W3 standard whose purpose is to provide users with a secure way to obtain, share, and verify certificates of any kind.

React version used is 17.0.2 and should **not** be updated to v18+ since [Carbon Design System](https://carbondesignsystem.com/) doesn't support it. (Written on May 11th, 2023, if carbon gets an update remove this line)

## Prerequisites

- For running:
- [Node](https://nodejs.org/en) use the LTS version (18.14.1 recommended)
- NPM (9.6.2)

## Installation

/

1. Install NPM dependencies `$ npm i`

2. Create `.env` file based on `.env.example`

   `$ cp .env.example .env`

## Usage

### Running the app

```bash
# Starts the app
$ npm start
```

### Adding new svg icon

- Add [file].svg to src/assets/icons
- Run: `npm run svgr`
- It should be automatically set in src/assets/icons/index.jsx for further use
- Update createdAsset.js to createdAsset.tsx (because Vite)

### Writing and checking docs

- Used [typedoc](https://typedoc.org/)
- Already written docs and be checked at docs/index.html
- After adding new one run: `npm run docs`
