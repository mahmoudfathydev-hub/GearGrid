import '@testing-library/jest-dom';

const jest = require('jest');

expect.extend({
  toHaveClass: (received, className) => {
    const hasClass = received.classList.contains(className);
    return {
      pass: hasClass,
      message: () => `expected element to have class "${className}"`,
    };
  },
});
