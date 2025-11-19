import { render, screen } from '@testing-library/react';
import HabitForm from './HabitForm';
test('renders input', () => {
  render(<HabitForm onAdd={()=>{}} />);
  expect(screen.getByPlaceholderText(/Enter sustainable habit/i)).toBeInTheDocument();
});
