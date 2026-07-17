import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useNavbarHeight } from './index';
import { Provider, useBus } from '../use-bus';

const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>;

describe('useNavbarHeight', () => {
  it('starts at 0 and updates when the configured event fires', () => {
    const { result } = renderHook(
      () => {
        const bus = useBus();
        const height = useNavbarHeight('my-navbar', 'navbar-evt');
        return { bus, height };
      },
      { wrapper }
    );

    expect(result.current.height).toBe(0);

    act(() => result.current.bus.emit('navbar-evt', 120));
    expect(result.current.height).toBe(120);
  });
});
