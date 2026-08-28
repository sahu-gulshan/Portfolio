import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global safety shield against circular structure JSON serialization errors (e.g. DOM nodes, React Fiber nodes)
if (typeof window !== 'undefined') {
  const originalStringify = JSON.stringify;
  JSON.stringify = function (value: any, replacer?: any, space?: any) {
    try {
      return originalStringify.call(this, value, replacer, space);
    } catch (err: any) {
      if (err && typeof err.message === 'string' && err.message.toLowerCase().includes('circular')) {
        const seen = new WeakSet();
        const safeReplacer = (key: string, val: any) => {
          if (val !== null && typeof val === 'object') {
            if (seen.has(val)) {
              return '[Circular]';
            }
            seen.add(val);
            if (typeof Element !== 'undefined' && val instanceof Element) {
              return `[${val.constructor?.name || 'Element'}]`;
            }
            if (typeof Event !== 'undefined' && val instanceof Event) {
              return `[${val.constructor?.name || 'Event'}]`;
            }
          }
          if (typeof replacer === 'function') {
            return replacer(key, val);
          }
          return val;
        };
        try {
          return originalStringify.call(this, value, safeReplacer, space);
        } catch {
          return '{}';
        }
      }
      throw err;
    }
  } as typeof JSON.stringify;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

