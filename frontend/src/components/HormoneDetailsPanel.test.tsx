import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HormoneDetailsPanel } from './HormoneDetailsPanel';
import { HormoneDetail } from '../types';

describe('HormoneDetailsPanel', () => {
  const mockHormoneDetails: HormoneDetail[] = [
    {
      code: 'AMH',
      value: 50,
      units: 'pmol/L',
      range: { min: 7.14, max: 95 },
      status: 'IN RANGE',
    },
    {
      code: 'FSH',
      value: 15,
      units: 'IU/L',
      range: { min: 6, max: 12.5 },
      status: 'TOO HIGH',
    },
  ];

  it('should render hormone details panel', () => {
    render(<HormoneDetailsPanel hormoneDetails={mockHormoneDetails} />);
    expect(screen.getByText('📊 Hormone Breakdown')).toBeInTheDocument();
  });

  it('should display hormone codes', () => {
    render(<HormoneDetailsPanel hormoneDetails={mockHormoneDetails} />);
    expect(screen.getByText('AMH')).toBeInTheDocument();
    expect(screen.getByText('FSH')).toBeInTheDocument();
  });

  it('should display hormone values with units', () => {
    render(<HormoneDetailsPanel hormoneDetails={mockHormoneDetails} />);
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should display correct status badges', () => {
    render(<HormoneDetailsPanel hormoneDetails={mockHormoneDetails} />);
    expect(screen.getByText('✅ In Range')).toBeInTheDocument();
    expect(screen.getByText('⚠️ Too High')).toBeInTheDocument();
  });

  it('should display normal ranges', () => {
    render(<HormoneDetailsPanel hormoneDetails={mockHormoneDetails} />);
    expect(screen.getByText(/7.14 - 95/)).toBeInTheDocument();
    expect(screen.getByText(/6 - 12.5/)).toBeInTheDocument();
  });

  it('should apply correct CSS classes based on status', () => {
    const { container } = render(
      <HormoneDetailsPanel hormoneDetails={mockHormoneDetails} />
    );

    const inRangeCard = container.querySelector('.inRange');
    const outOfRangeCard = container.querySelector('.outOfRange');

    expect(inRangeCard).toBeInTheDocument();
    expect(outOfRangeCard).toBeInTheDocument();
  });

  it('should show alert message for out of range hormones', () => {
    render(<HormoneDetailsPanel hormoneDetails={mockHormoneDetails} />);

    // Should show alert for FSH which is too high
    const alertMessage = screen.getByText(/2.50.*above normal range/);
    expect(alertMessage).toBeInTheDocument();
  });

  it('should handle empty hormone list', () => {
    render(<HormoneDetailsPanel hormoneDetails={[]} />);
    expect(screen.getByText('📊 Hormone Breakdown')).toBeInTheDocument();
  });
});
