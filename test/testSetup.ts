import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const ResizeObserverMock = vi.fn(function () {
    return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    };
});

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
