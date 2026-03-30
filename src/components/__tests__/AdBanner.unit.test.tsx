/**
 * Unit tests for AdBanner component
 * Tags: unit
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import AdBanner from '../AdBanner';

describe('AdBanner', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Reset adsbygoogle mock
    Object.defineProperty(window, 'adsbygoogle', {
      value: [],
      writable: true,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('renders nothing when ad config is missing', () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    delete process.env.NEXT_PUBLIC_ADSENSE_SLOT;

    const { container } = render(<AdBanner />);

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when only client is set', () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = 'ca-pub-123';
    delete process.env.NEXT_PUBLIC_ADSENSE_SLOT;

    const { container } = render(<AdBanner />);

    expect(container.firstChild).toBeNull();
  });

  it('renders ins element when both env vars are set', () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = 'ca-pub-123';
    process.env.NEXT_PUBLIC_ADSENSE_SLOT = '456789';

    render(<AdBanner />);

    const ins = document.querySelector('ins.adsbygoogle');
    expect(ins).toBeInTheDocument();
    expect(ins).toHaveAttribute('data-ad-client', 'ca-pub-123');
    expect(ins).toHaveAttribute('data-ad-slot', '456789');
  });

  it('applies custom className to wrapper', () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = 'ca-pub-123';
    process.env.NEXT_PUBLIC_ADSENSE_SLOT = '456789';

    const { container } = render(<AdBanner className="my-custom-class" />);

    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('renders ad with horizontal format and full-width responsive', () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = 'ca-pub-123';
    process.env.NEXT_PUBLIC_ADSENSE_SLOT = '456789';

    render(<AdBanner />);

    const ins = document.querySelector('ins.adsbygoogle');
    expect(ins).toHaveAttribute('data-ad-format', 'horizontal');
    expect(ins).toHaveAttribute('data-full-width-responsive', 'true');
  });
});
