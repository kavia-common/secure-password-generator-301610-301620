import { render, screen } from '@testing-library/react';
import App from './App';

test('renders password generator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Secure Password Generator/i);
  expect(titleElement).toBeInTheDocument();
});
