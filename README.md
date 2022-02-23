# hapi-firebase-scope-auth

## Intro & Features

* Firebase Authentication plugin for HapiJS.
* This is used for validating Firebase authentication for HapiJs routes.
* Has support for Role based Access Control (RBAC) with firebase for API routes

## Installation

> npm install hapi-firebase-scope-auth

## Usage

```javascript
 
// Plugin registration
await server.register(require('hapi-firebase-auth'))

// Initialize Firebase Admin SDK

const { initializeApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

const fireApp = initializeApp()
const firebaseAdminAuthInstance = getAuth(fireApp)
 
// Create strategy
server.auth.strategy('myFirebase', 'firebase-scope', {
  firebaseAdminAuth: firebaseAdminAuthInstance,
  scopeField: 'role'
})

```

## RBAC Usage

* This plugin uses Firebase Admin SDK's verifyIdToken method to validate token.
* Once the token is validated then verifyIdToken returns JWT decoded values which include user details and custom claims.
* Set *scopeField* value in strategy as shown  in above configuration. *scopeField* is any key / field from decoded JWT.
* Based on scope configuration in route, it will be validated against *scopeField*

```javascript

// Following route will be authenticated if role value of user is either admin or author
server.routes([{
  method: 'GET',
  path: '/health',
  options: {
    auth: {
      strategy: 'myFirebase',
      scope: ['admin', 'author']
    },
    tags: ['api', 'health'],
    handler: LoginHandler,
    plugins: {},
    security: true
  }
}])

```

## License

[MIT](https://github.com/bussr-io/hapi-firebase-scope-auth/blob/main/LICENSE)

## Credits

* Credits to Author of [hapi-firebase-auth](https://www.npmjs.com/package/hapi-firebase-auth) plugin for providing a base to create this plugin.

### Authors

* [Bharath Reddy Kontham](https://github.com/bharathkontham)
* [Sushanth Shetty](https://github.com/sushanthmshetty)
