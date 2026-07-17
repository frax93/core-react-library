import { describe, it, expect } from 'vitest';
import generatePromise, { PromiseErrorInterface } from './generate-promise';

describe('generatePromise', () => {
  it('resolves with the wrapped value when not canceled', async () => {
    const { promise } = generatePromise(Promise.resolve('value'));
    await expect(promise).resolves.toBe('value');
  });

  it('rejects with a canceled error when canceled before resolution', async () => {
    const { promise, cancel } = generatePromise(Promise.resolve('value'));
    expect(cancel()).toBe(true);

    await expect(promise).rejects.toMatchObject<Partial<PromiseErrorInterface>>({
      isCanceled: true,
    });
  });

  it('propagates rejection from the source promise', async () => {
    const { promise } = generatePromise(Promise.reject('boom'));
    await expect(promise).rejects.toMatchObject({ isCanceled: false, message: 'boom' });
  });
});
