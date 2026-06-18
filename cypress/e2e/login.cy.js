describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login')
  })

  it('should display login correctly', () => {
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should display error toast if email is empty', () => {
    cy.get('button[type="submit"]').click()
    cy.get('[data-type="error"]').should('be.visible')
    cy.get('[data-type="error"]').contains('"email" is not allowed to be empty')
  })

  it('should display error toast if password is empty', () => {
    cy.get('input[type="email"]').type('email@mail.com')
    cy.get('button[type="submit"]').click()
    cy.get('[data-type="error"]').should('be.visible')
    cy.get('[data-type="error"]').contains('"password" is not allowed to be empty')
  })

  it('should display error toast if email and password are wrong', () => {
    cy.get('input[type="email"]').type('email@mail.com')
    cy.get('input[type="password"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.get('[data-type="error"]').should('be.visible')
    cy.get('[data-type="error"]').contains('email or password is wrong')
  })

  it('should login successfully', () => {
    cy.get('input[type="email"]').type('erlangga@gmail.com')
    cy.get('input[type="password"]').type('111111')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/')

    cy.get('button').contains(/^Thread Baru$/).should('be.visible')
  })
})