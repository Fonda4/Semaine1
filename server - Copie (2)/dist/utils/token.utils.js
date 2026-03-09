"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFakeToken = generateFakeToken;
exports.validateFakeToken = validateFakeToken;
/**
 * Generates a fake token from a non empty string
 * @param username the username
 * @returns a fake token that can be used as a JWT or undefined if the username is invalid
 */
function generateFakeToken(username) {
    if (!username || typeof username !== 'string' || username.length === 0)
        return undefined;
    return Buffer.from(username, 'utf-8').toString('base64');
}
/**
 * Validates a fake token
 * @param token the token to validate
 * @returns the username if the token is valid, undefined otherwise
 */
function validateFakeToken(token) {
    try {
        return Buffer.from(token, 'base64').toString('utf-8');
    }
    catch (error) {
        return undefined;
    }
}
