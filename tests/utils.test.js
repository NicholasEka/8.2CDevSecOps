const test = require('node:test');
const assert = require('node:assert');
const utils = require('../utils');

test('ran_no returns a number within the requested range', () => {
  const result = utils.ran_no(1, 10);

  assert.ok(result >= 1);
  assert.ok(result <= 10);
});

test('uid returns the requested number of characters', () => {
  const result = utils.uid(12);

  assert.strictEqual(result.length, 12);
});

test('uid only contains letters and numbers', () => {
  const result = utils.uid(20);

  assert.match(result, /^[A-Za-z0-9]+$/);
});