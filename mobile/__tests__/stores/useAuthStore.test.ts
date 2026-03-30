import { useAuthStore } from '../../src/stores/useAuthStore';
import { authService } from '../../src/services/authService';

// Mock dependencies
jest.mock('../../src/services/authService');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start unauthenticated', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('should set authenticated on successful login', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: '1', username: 'testuser', nickname: 'Test' },
          token: 'mock-token',
        },
      };
      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      await useAuthStore.getState().login({
        username: 'testuser',
        password: 'password123',
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.username).toBe('testuser');
      expect(state.token).toBe('mock-token');
      expect(state.isLoading).toBe(false);
    });

    it('should handle login failure', async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new Error('用户名或密码错误')
      );

      await expect(
        useAuthStore.getState().login({
          username: 'wrong',
          password: 'wrong',
        })
      ).rejects.toThrow('用户名或密码错误');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading during login', async () => {
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve;
      });
      (authService.login as jest.Mock).mockReturnValue(loginPromise);

      const promise = useAuthStore.getState().login({
        username: 'testuser',
        password: 'password123',
      });

      // Should be loading
      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveLogin!({
        success: true,
        data: { user: { id: '1', username: 'test' }, token: 't' },
      });

      await promise;

      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('register', () => {
    it('should set authenticated on successful registration', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: '2', username: 'newuser' },
          token: 'new-token',
        },
      };
      (authService.register as jest.Mock).mockResolvedValue(mockResponse);

      await useAuthStore.getState().register({
        username: 'newuser',
        password: 'password123',
        confirmPassword: 'password123',
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.username).toBe('newuser');
    });

    it('should handle registration failure', async () => {
      (authService.register as jest.Mock).mockRejectedValue(
        new Error('用户名已存在')
      );

      await expect(
        useAuthStore.getState().register({
          username: 'taken',
          password: 'pass',
          confirmPassword: 'pass',
        })
      ).rejects.toThrow('用户名已存在');

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear auth state on logout', () => {
      useAuthStore.setState({
        user: { id: '1', username: 'test' },
        token: 'token',
        isAuthenticated: true,
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should set unauthenticated when no token', async () => {
      useAuthStore.setState({ token: null });

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should verify token with API', async () => {
      useAuthStore.setState({ token: 'valid-token' });
      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        success: true,
        data: { id: '1', username: 'test' },
      });

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.username).toBe('test');
    });

    it('should set unauthenticated on API failure', async () => {
      useAuthStore.setState({ token: 'expired-token' });
      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        success: false,
      });

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
