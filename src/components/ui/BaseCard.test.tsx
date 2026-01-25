/**
 * Unit tests for BaseCard component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BaseCard } from '../ui/BaseCard';

describe('BaseCard', () => {
  it('should render children', () => {
    render(<BaseCard>Test Content</BaseCard>);
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply default variant and padding', () => {
    const { container } = render(<BaseCard>Content</BaseCard>);
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('p-6'); // default md padding
  });

  it('should apply custom className', () => {
    const { container } = render(
      <BaseCard className="custom-class">Content</BaseCard>
    );
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveClass('custom-class');
  });

  it('should apply different padding variants', () => {
    const { container: container1 } = render(
      <BaseCard padding="sm">Content</BaseCard>
    );
    const { container: container2 } = render(
      <BaseCard padding="lg">Content</BaseCard>
    );
    
    expect(container1.firstChild).toHaveClass('p-4');
    expect(container2.firstChild).toHaveClass('p-8');
  });

  it('should apply different card variants', () => {
    const { container: container1 } = render(
      <BaseCard variant="default">Content</BaseCard>
    );
    const { container: container2 } = render(
      <BaseCard variant="elevated">Content</BaseCard>
    );
    
    const card1 = container1.firstChild as HTMLElement;
    const card2 = container2.firstChild as HTMLElement;
    
    expect(card1.className).not.toContain('shadow');
    expect(card2.className).toContain('shadow');
  });
});
