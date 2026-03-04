/**
 * Mock 用户数据
 */

export interface MockUser {
  id: string;
  openid: string;
  phone: string | null;
  nickname: string | null;
  avatar: string | null;
  createdAt: string;
}

// 新用户（未绑定手机号）
export const mockNewUser: MockUser = {
  id: 'user-new-001',
  openid: 'openid_new_001',
  phone: null,
  nickname: null,
  avatar: null,
  createdAt: '2026-03-01T10:00:00Z',
};

// 老用户（已绑定手机号）
export const mockExistingUser: MockUser = {
  id: 'user-existing-001',
  openid: 'openid_existing_001',
  phone: '138****8888',
  nickname: '测试用户',
  avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/132',
  createdAt: '2026-01-01T08:00:00Z',
};

// 用户列表（用于批量测试）
export const mockUserList: MockUser[] = [
  mockNewUser,
  mockExistingUser,
  {
    id: 'user-002',
    openid: 'openid_002',
    phone: '139****9999',
    nickname: '用户A',
    avatar: 'https://example.com/avatar1.png',
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'user-003',
    openid: 'openid_003',
    phone: '137****7777',
    nickname: '用户B',
    avatar: 'https://example.com/avatar2.png',
    createdAt: '2026-02-15T14:30:00Z',
  },
];

// 生成随机用户
export function generateMockUser(overrides: Partial<MockUser> = {}): MockUser {
  const timestamp = Date.now();
  return {
    id: `user-${timestamp}`,
    openid: `openid_${timestamp}`,
    phone: `1${Math.floor(Math.random() * 10)}****${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    nickname: `用户${Math.floor(Math.random() * 1000)}`,
    avatar: `https://example.com/avatar/${timestamp}.png`,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// 生成用户批量数据
export function generateMockUsers(count: number): MockUser[] {
  return Array.from({ length: count }, () => generateMockUser());
}

// 用户状态枚举
export enum UserStatus {
  NEW = 'new', // 新用户，未绑定手机
  ACTIVE = 'active', // 活跃用户
  INACTIVE = 'inactive', // 不活跃用户
}

// 根据状态获取 Mock 用户
export function getMockUserByStatus(status: UserStatus): MockUser {
  switch (status) {
    case UserStatus.NEW:
      return mockNewUser;
    case UserStatus.ACTIVE:
      return mockExistingUser;
    case UserStatus.INACTIVE:
      return {
        ...mockExistingUser,
        createdAt: '2025-01-01T00:00:00Z',
      };
    default:
      return mockExistingUser;
  }
}
