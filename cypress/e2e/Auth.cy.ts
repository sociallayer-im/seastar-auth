// Repointed at soon's actual auth contract (see soon/app/controllers/api/v1/auth_controller.rb
// and src/service/solar.ts, which prefixes every call with `${api}/api/v1`).
// The previous version of this file targeted sails' legacy routes
// (/siwe/verify, /profile/signin_with_email, /profile/set_verified_email,
// /profile/get_by_email, /profile/create, /profile/get_by_handle) — none of
// which exist on soon — and every describe block was skipped, so this suite
// gave zero regression coverage of the hardened SIWE/email flow. See
// soon/design/CHANGELOG.md 2026-07-29.
const api = 'http://localhost:3000'
const auth_field = 'solar_auth'
const true_auth = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MjkwMjYsImFkZHJlc3NfdHlwZSI6ImVtYWlsIiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIl0sIngtaGFzdXJhLXVzZXItaWQiOiIyOTAyNiJ9fQ.HDBzeDq0uDuQH9k8_E2r7BKRFrmxRwLHf1i8Mof0wPg'

describe('Email Sign-in', () => {
    beforeEach(() => {
        cy.intercept('post', `${api}/api/v1/auth/request_code`, {
            statusCode: 200,
            body: {message: 'ok'},
        })

        cy.setCookie('lang', 'en')
    })

    it('Existing email user goes straight to the return URL', () => {
        cy.intercept('post', `${api}/api/v1/auth/verify_code`, {
            statusCode: 200,
            body: {token: 'auth_token', user: {id: '1', email: '475469442@qq.com', name: 'existing_user'}},
        })
        // clientCheckUserLoggedInAndRedirect re-fetches the profile via the token.
        cy.intercept('get', `${api}/api/v1/users/me`, {
            statusCode: 200,
            body: {id: '1', email: '475469442@qq.com', name: 'existing_user'},
        })

        cy.visit('/?return=http://localhost:3000/status')

        cy.get('input[name="email"]').type('475469442@qq.com')
        cy.get('input[name="email"]').type('{enter}')
        cy.url().should('include', '/verify-email?email=475469442%40qq.com')

        cy.get('input[data-testid="pin-code-input"]').type('123456')

        cy.url().should('eq', 'http://localhost:3000/status')
    })

    it('New email user (no name yet) is sent to /register', () => {
        cy.intercept('post', `${api}/api/v1/auth/verify_code`, {
            statusCode: 200,
            body: {token: 'auth_token', user: {id: '2', email: '475469442@qq.com', name: null}},
        })
        cy.intercept('get', `${api}/api/v1/users/me`, {
            statusCode: 200,
            body: {id: '2', email: '475469442@qq.com', name: null},
        })

        cy.visit('/?return=http://localhost:3000/status')

        cy.get('input[name="email"]').type('475469442@qq.com')
        cy.get('input[name="email"]').type('{enter}')
        cy.get('input[data-testid="pin-code-input"]').type('123456')

        cy.url().should('include', '/register')

        // getProfileByName -> GET /users/:name; a 404 means the name is free.
        cy.intercept('get', `${api}/api/v1/users/ppnnsspp`, {statusCode: 404, body: {error: 'Not found'}})
        cy.intercept('get', `${api}/api/v1/users/ppnnsspp-2`, {statusCode: 200, body: {id: '9', name: 'ppnnsspp-2'}})
        cy.intercept('patch', `${api}/api/v1/users/me`, {statusCode: 200, body: {id: '2', name: 'ppnnsspp'}})

        // taken: 200 = a user with that name exists
        cy.get('[data-testid="username-input"]').type('ppnnsspp-2')
        cy.get('button').contains(/continue|register|confirm/i).click()
        cy.contains('User already exists').should('exist')

        // free: 404
        cy.get('[data-testid="username-input"]').clear()
        cy.get('[data-testid="username-input"]').type('ppnnsspp')
        cy.get('button').contains(/continue|register|confirm/i).click()

        cy.url().should('eq', 'http://localhost:3000/status')
    })

    it('Bind email: an in-use email is rejected at verify (no pre-check by design — PII)', () => {
        cy.setCookie(auth_field, true_auth)
        cy.setCookie('return', 'http://localhost:3000/status')

        cy.intercept('post', `${api}/api/v1/auth/request_code`, {
            statusCode: 200,
            body: {message: 'ok'},
        })

        cy.visit('/bind-email')
        cy.get('input[name="email"]').type('exist@qq.com')
        cy.get('button').contains(/continue/i).click()
        cy.url().should('eq', 'http://localhost:3000/verify-bind-email?email=exist%40qq.com')

        cy.intercept('post', `${api}/api/v1/auth/bind_email`, {
            statusCode: 422,
            body: {error: 'Email is already in use'},
        })
        cy.get('input[data-testid="pin-code-input"]').type('123456')
        cy.contains('Email is already in use').should('exist')
    })

    it('Bind email: a fresh email succeeds', () => {
        cy.setCookie(auth_field, true_auth)
        cy.setCookie('return', 'http://localhost:3000/status')

        cy.visit('/bind-email')
        cy.get('input[name="email"]').type('475469442@qq.com')
        cy.get('button').contains(/continue/i).click()
        cy.url().should('eq', 'http://localhost:3000/verify-bind-email?email=475469442%40qq.com')

        cy.intercept('post', `${api}/api/v1/auth/bind_email`, {
            statusCode: 200,
            body: {id: '1', email: '475469442@qq.com', name: 'existing_user'},
        })
        cy.intercept('get', `${api}/api/v1/users/me`, {
            statusCode: 200,
            body: {id: '1', email: '475469442@qq.com', name: 'existing_user'},
        })
        cy.get('input[data-testid="pin-code-input"]').type('123456')

        cy.url().should('eq', 'http://localhost:3000/status')
    })
})

describe('Middleware', () => {
    it('Redirect to root when no login', () => {
        cy.visit('/bind-email')
        cy.url().should('eq', 'http://localhost:3000/')
    })
})

// These two need a real (or automated) wallet extension — MetaMask/Phantom —
// to sign a message, which cy.intercept can't fake; they were unmocked and
// flaky before the sails->soon migration too. Keeping them skipped is
// legitimate (this needs wallet-automation tooling like @synthetixio/synpress,
// not an endpoint fix), but documenting why so it doesn't read as "still
// broken like everything else in this file used to be."
describe('Wallet Sign-in', () => {
    it.skip('MetaMask Sign-in — requires wallet-extension automation (synpress); not covered here', () => {
        cy.visit('/?return=http://localhost:3000/status')
        cy.contains('MetaMask').click()
        cy.wait(10000)
        cy.url().should('eq', 'http://localhost:3000/status')
    })
})

describe('Solana Sign-in', () => {
    it.skip('Solana Sign-in — requires wallet-extension automation (synpress); not covered here', () => {
        cy.visit('/?return=http://localhost:3000/status')
        cy.contains('Solana').click()

        cy.wait(1000)
        cy.get('button[data-testid=solana-sigin-in-wallet]').click()
        cy.get('button[data-testid=solana-sigin-in-btn]').click()
        cy.wait(5000)

        cy.url().should('eq', 'http://localhost:3000/status')
    })
})
