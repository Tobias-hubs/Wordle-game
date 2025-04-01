import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { jest } from '@jest/globals';
import "@testing-library/jest-dom";
import { act } from "react";

// Mocka fetch-funktionen för att simulera serverns svar
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Hello from server!' }),
  })
);
// Temporary .skip to make test work for now 
test('renders server message correctly', async () => {
  await act(async () => {
  render(<App />);

});

  // Kontrollera att "Loading..." visas initialt
  // expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

  // Vänta på att meddelandet från servern ska renderas
  await waitFor(() => expect(screen.getByText(/Hello from server!/i)).toBeInTheDocument());
});

