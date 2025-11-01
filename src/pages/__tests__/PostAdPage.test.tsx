import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock Navbar and ImageUploadZone to keep the test focused on PostAdPage logic
vi.mock('../../components/layout/Navbar', () => ({ Navbar: () => <div data-testid="mock-navbar" /> }));
vi.mock('../../components/forms/ImageUploadZone', () => ({
  ImageUploadZone: ({ images, onUpload, onRemove }: any) => (
    <div>
      <input data-testid="mock-uploader" onChange={(e: any) => onUpload(e.target.files)} />
      <div data-testid="mock-images">{(images || []).length} images</div>
      <button onClick={() => onRemove && onRemove(0)}>remove</button>
    </div>
  ),
}));

// Mock categoryFields to a controlled test fixture
vi.mock('../../config/categoryFields', () => ({
  categoryFields: {
    TestCat: ['Brand', 'Model'],
  },
}));

// Mock hooks and services used by the page
vi.mock('../../hooks/useAuth', () => ({ useAuth: () => ({ user: { _id: 'u1' } }) }));
vi.mock('../../services/upload.service', () => ({
  uploadService: {
    uploadImages: async (_files: File[], onProgress?: (pct: number) => void) => {
      // simulate simple progress
      if (onProgress) {
        onProgress(25);
        onProgress(60);
        onProgress(100);
      }
      return Promise.resolve([{ url: 'http://img', publicId: 'p1' }]);
    },
  },
}));
vi.mock('../../services/ad.service', () => ({
  adService: {
    createAd: async (payload: any) => ({ _id: 'fake-ad-1', ...payload }),
  },
}));

// mock location utils that would otherwise attempt network calls
vi.mock('../../utils/constants', () => ({
  getCountries: async () => [],
  getStates: async (_country?: string) => [],
  getCities: async (_state?: string) => [],
}));

// Minimal mock for react-router-dom hooks used in the component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

import { PostAdPage } from '../PostAdPage';

describe('PostAdPage (basic)', () => {
  it('renders and shows dynamic fields when category selected', async () => {
    render(<PostAdPage />);

    // find the correct combobox which contains our TestCat option
    const selects = screen.getAllByRole('combobox');
    const select = selects.find((s) => {
      try {
        within(s).getByRole('option', { name: 'TestCat' });
        return true;
      } catch (e) {
        return false;
      }
    });
    if (!select) throw new Error('Category select not found');
    await userEvent.selectOptions(select, 'TestCat');

  // Brand and Model fields should appear
  expect(await screen.findByLabelText('Brand')).toBeTruthy();
  expect(screen.getByLabelText('Model')).toBeTruthy();
  });

  it('shows validation error when title missing on submit', async () => {
    render(<PostAdPage />);

    const submit = screen.getByRole('button', { name: /post ad/i });
    await userEvent.click(submit);

  expect(await screen.findByText(/Title is required/i)).toBeTruthy();
  });
});
