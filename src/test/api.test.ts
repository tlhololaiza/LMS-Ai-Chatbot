import { describe, it, expect } from 'vitest'

/**
 * Mock API function
 * This represents the backend endpoint that will exist later.
 */
async function mockHealthCheck() {
  return {
    status: 200,
    message: 'API is running'
  }
}

describe('API health check', () => {
  it('should return status 200 and confirmation message', async () => {
    const response = await mockHealthCheck()

    expect(response.status).toBe(200)
    expect(response.message).toBe('API is running')
  })
})
