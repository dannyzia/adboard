import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
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

// Mock fetch for API calls
global.fetch = vi.fn((url: string) => {
  if (url.includes('/api/currencies')) {
    return Promise.resolve({
      json: () => Promise.resolve({ currencies: [{ code: 'USD', name: 'US Dollar' }] })
    } as Response);
  }
  if (url.includes('/api/form-config')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        categories: ['TestCat'],
        specificFields: {
          TestCat: [
            { name: 'Brand', label: 'Brand', type: 'text' },
            { name: 'Model', label: 'Model', type: 'text' }
          ]
        }
      })
    } as Response);
  }
  return Promise.reject(new Error('Unknown URL'));
}) as any;

// mock location utils that would otherwise attempt network calls
vi.mock('../../utils/constants', () => ({
  getCountries: async () => ['USA'],
  getStates: async (_country?: string) => ['California'],
  getCities: async (_state?: string) => ['Los Angeles'],
}));

vi.mock('../../components/ui/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() })
}));

// Minimal mock for react-router-dom hooks used in the component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useLocation: () => ({ pathname: '/', search: '', hash: '' }),
  };
});

import { PostAdPage } from '../PostAdPage';

describe('PostAdPage (basic)', () => {
  it('renders and shows dynamic fields when category selected', async () => {
    render(<PostAdPage />);

    // Wait for async effects to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit ad/i })).toBeInTheDocument();
    });

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

    // Wait for async effects to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit ad/i })).toBeInTheDocument();
    });

    const submit = screen.getByRole('button', { name: /submit ad/i });
    await userEvent.click(submit);

    // The form uses native HTML5 validation, so we check if the title input has the required attribute
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toHaveAttribute('required');
  });
});
