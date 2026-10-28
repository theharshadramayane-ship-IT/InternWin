import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the SkillGate Student login screen', () => {
  render(<App />);
  const heading = screen.getByText(/SkillGate/i);
  expect(heading).toBeInTheDocument();
});
