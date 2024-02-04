# 📰 @europresse-lib

A TypeScript library to search and fetch articles from Europresse.

*This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Europresse, or any of its subsidiaries or its affiliates. The name Europresse as well as related names, marks, emblems and images are registered trademarks of their respective owners.*

## Features

- [x] Authentication
- [x] Search
- [x] Article retrieval in HTML

## Supported authentication providers

- [x] [@ent-cookies](https://github.com/ebanDev/ent-cookies)
  - Additional parameters: `ent`
- [ ] direct login
- [ ] bnf

## Installation

```bash
npm install europresse-lib

# or 

yarn add europresse-lib
```

## Usage

```typescript
import { auth, search, article } from 'europresse-lib';

const cookies = await auth('username', 'password', 'provider');
const results = await search(cookies, 'query');
const article = await article(cookies, 'id', 'html');
```
