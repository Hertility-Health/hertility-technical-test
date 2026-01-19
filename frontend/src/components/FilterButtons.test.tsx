import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterButtons } from './FilterButtons';
import { FilterOption } from '../types';

describe('FilterButtons', () => {
  const mockResultCounts = {
    all: 15,
    inRange: 10,
    notInRange: 5,
  };

  const mockOnFilterChange = vi.fn();

  it('should render all filter buttons', () => {
    render(
      <FilterButtons
        activeFilter="ALL"
        onFilterChange={mockOnFilterChange}
        resultCounts={mockResultCounts}
      />
    );

    expect(screen.getByText('All Results')).toBeInTheDocument();
    expect(screen.getByText('In Range')).toBeInTheDocument();
    expect(screen.getByText('Needs Review')).toBeInTheDocument();
  });

  it('should display correct result counts', () => {
    render(
      <FilterButtons
        activeFilter="ALL"
        onFilterChange={mockOnFilterChange}
        resultCounts={mockResultCounts}
      />
    );

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should highlight active filter', () => {
    const { rerender } = render(
      <FilterButtons
        activeFilter="ALL"
        onFilterChange={mockOnFilterChange}
        resultCounts={mockResultCounts}
      />
    );

    const allButton = screen.getByText('All Results').closest('button');
    expect(allButton).toHaveClass('active');

    rerender(
      <FilterButtons
        activeFilter="IN RANGE"
        onFilterChange={mockOnFilterChange}
        resultCounts={mockResultCounts}
      />
    );

    const inRangeButton = screen.getByText('In Range').closest('button');
    expect(inRangeButton).toHaveClass('active');
  });

  it('should call onFilterChange when button is clicked', () => {
    render(
      <FilterButtons
        activeFilter="ALL"
        onFilterChange={mockOnFilterChange}
        resultCounts={mockResultCounts}
      />
    );

    const inRangeButton = screen.getByText('In Range').closest('button');
    fireEvent.click(inRangeButton!);

    expect(mockOnFilterChange).toHaveBeenCalledWith('IN RANGE');
  });

  it('should handle "Needs Review" button click', () => {
    render(
      <FilterButtons
        activeFilter="ALL"
        onFilterChange={mockOnFilterChange}
        resultCounts={mockResultCounts}
      />
    );

    const needsReviewButton = screen.getByText('Needs Review').closest('button');
    fireEvent.click(needsReviewButton!);

    expect(mockOnFilterChange).toHaveBeenCalledWith('NOT IN RANGE');
  });
});
