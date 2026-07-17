import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { AuthenticationProvider } from './provider';
import { useUserProfile } from './index';

type Me = { name: string };

const wrapper = ({ children }: { children: React.ReactElement }) => (
  <AuthenticationProvider>{children}</AuthenticationProvider>
);

describe('useUserProfile', () => {
  beforeEach(() => window.localStorage.clear());

  it('starts with an empty profile', () => {
    const { result } = renderHook(() => useUserProfile<Me>(), { wrapper });
    expect(result.current.userProfile).toEqual({});
  });

  it('stores generic auth data and exposes it back', () => {
    const { result } = renderHook(() => useUserProfile<Me>(), { wrapper });

    act(() => {
      result.current.setUserProfile({ token: 'abc', user: { name: 'jo' } });
    });

    expect(result.current.userProfile.token).toBe('abc');
    expect(result.current.userProfile.user).toEqual({ name: 'jo' });
  });
});
