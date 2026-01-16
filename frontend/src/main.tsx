import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import original CSS exactly (copy your css/style.css content to src/assets/css/style.css)
import './assets/css/style.css';

// Optional: tailwind base (won't override because original CSS is specific)
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
