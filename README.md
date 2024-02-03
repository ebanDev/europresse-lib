# 📰 @europresse-lib

A TypeScript library for the Europresse API.

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
