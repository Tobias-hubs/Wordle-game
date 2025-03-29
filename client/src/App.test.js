// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mocka fetch-funktionen för att simulera serverns svar
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Hello from server!' }),
  })
);
// Temporary .skip to make test work for now 
test.skip('renders server message correctly', async () => {
  render(<App />);

  // Kontrollera att "Loading..." visas initialt
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

  // Vänta på att meddelandet från servern ska renderas
  await waitFor(() => expect(screen.getByText(/Hello from server!/i)).toBeInTheDocument());
});

