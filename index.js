const Boom = require('@hapi/boom')
const Package = require('./package.json')

const AuthenticationSchema = (server, options) => {
  return {

    /**
     * Hapi's authenticate method
     *
     * @param {*} request Request object created by the server
     * @param {*} h Standard hapi response toolkit
     */
    authenticate (request, h) {
      // throw error if firbase admin auth instance is not configured
      if (!options.firebaseAdminAuth) {
        throw Boom.badRequest('Firebase Admin Auth Instance not configured')
      }

      // Get token from header
      const Authorization = request.headers.authorization
      if (!Authorization) return null

      const Token = Authorization.replace(/(bearer )/i, '')

      // If token not found, return an 'unauthorized' response
      if (Token === null) {
        throw Boom.unauthorized('Unauthorized')
      }

      // Validate token
      return validate(Token, options.firebaseAdminAuth, h, options.scopeField)
    }
  }
}

/**
 * Firebase User Token validation using Firebase Admin SDK
 *
 * @param {string} token Access token provided by Firebase Auth
 * @param {*} firebaseAdminAuthInstance Initialized Firebase App instance
 * @param {*} h Standard hapi response toolkit
 * @param {string} scopeField field name from verifyIdToken which will be used for scope validation
 */
const validate = async (token, firebaseAdminAuthInstance, h, scopeField = 'role') => {
  try {
    const credentials = await firebaseAdminAuthInstance.verifyIdToken(token, true)
    credentials.scope = credentials[scopeField] || ''
    return h.authenticated({ credentials })
  } catch (error) {
    throw Boom.unauthorized('Invalid token')
  }
}

/**
 * Hapi Plugin register method
 * @param {*} server
 * @param {*} options
 */
const register = async (server, options) => {
  server.auth.scheme('firebase-scope', AuthenticationSchema)

  server.ext('onPostAuth', (request, h) => {
    // TBD: Add any logic postAuth
    return h.continue
  })
}

// Export Plugin
module.exports = {
  plugin: {
    name: Package.name,
    version: Package.version,
    pkg: Package,
    register
  }
}
