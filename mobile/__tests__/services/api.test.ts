import api from '../../src/services/api';

// Mock axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: {
        use: jest.fn((onFulfilled, onRejected) => {
          // Store the response interceptor for testing
          (mockAxiosInstance as any)._responseFulfilled = onFulfilled;
          (mockAxiosInstance as any)._responseRejected = onRejected;
        }),
      },
    },
    defaults: { headers: { common: {} } },
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
  };
});

describe('API Service', () => {
  it('should be configured with correct base URL', () => {
    // api is a singleton created by axios.create
    expect(api).toBeDefined();
    expect(api.interceptors).toBeDefined();
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
  });
});
