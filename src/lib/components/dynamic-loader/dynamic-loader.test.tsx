import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createErrorComponent } from './error-component';
import { createWebComponentWrapper } from './web-component-wrapper';
import { remoteModuleMap } from './remote-loader';

describe('DynamicLoader building blocks', () => {
  it('createErrorComponent renders a message with the remote id', () => {
    const ErrorComponent = createErrorComponent('my-remote');
    const { getByText } = render(<ErrorComponent />);
    expect(getByText(/Error loading remote component: my-remote/)).toBeTruthy();
  });

  it('createWebComponentWrapper mounts the given custom element tag', () => {
    const Wrapper = createWebComponentWrapper('my-widget', { title: 'hello' });
    const { container } = render(<Wrapper />);
    expect(container.querySelector('my-widget')).not.toBeNull();
  });

  it('exposes a module cache map', () => {
    expect(remoteModuleMap).toBeInstanceOf(Map);
  });
});
