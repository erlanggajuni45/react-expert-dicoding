describe('Login spec', () => {
  beforeEach(() => {
    // Intercept preload profile request (returns 401 because no token)
    cy.intercept('GET', '**/users/me', {
      statusCode: 401,
      body: {
        status: 'fail',
        message: 'unauthenticated',
      },
    }).as('preloadProfile');

    cy.visit('http://localhost:5173/login')
  })

  it('should display login correctly', () => {
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should display error toast if email is empty', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: '"email" is not allowed to be empty',
      },
    }).as('loginEmptyEmail');

    cy.get('button[type="submit"]').click()
    cy.wait('@loginEmptyEmail')
    cy.get('[data-type="error"]').should('be.visible')
    cy.get('[data-type="error"]').contains('"email" is not allowed to be empty')
  })

  it('should display error toast if password is empty', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: '"password" is not allowed to be empty',
      },
    }).as('loginEmptyPassword');

    cy.get('input[type="email"]').type('email@mail.com')
    cy.get('button[type="submit"]').click()
    cy.wait('@loginEmptyPassword')
    cy.get('[data-type="error"]').should('be.visible')
    cy.get('[data-type="error"]').contains('"password" is not allowed to be empty')
  })

  it('should display error toast if email and password are wrong', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: {
        status: 'fail',
        message: 'email or password is wrong',
      },
    }).as('loginWrongCredentials');

    cy.get('input[type="email"]').type('email@mail.com')
    cy.get('input[type="password"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.wait('@loginWrongCredentials')
    cy.get('[data-type="error"]').should('be.visible')
    cy.get('[data-type="error"]').contains('email or password is wrong')
  })

  it('should login successfully', () => {
    // Intercept successful login
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          token: 'mock-token',
        },
      },
    }).as('loginSuccess');

    // Intercept subsequent profile request after login
    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          user: {
            id: 'user-1',
            name: 'Erlangga',
            email: 'erlangga@gmail.com',
            avatar: 'https://example.com/avatar.jpg',
          },
        },
      },
    }).as('getProfileSuccess');

    // Intercept threads and users list requests on home page
    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          threads: [],
        },
      },
    }).as('getThreads');

    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          users: [],
        },
      },
    }).as('getUsers');

    cy.get('input[type="email"]').type('erlangga@gmail.com')
    cy.get('input[type="password"]').type('111111')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginSuccess')
    cy.wait('@getProfileSuccess')
    cy.url().should('include', '/')

    cy.get('button').contains(/^Thread Baru$/).should('be.visible')
  })
})