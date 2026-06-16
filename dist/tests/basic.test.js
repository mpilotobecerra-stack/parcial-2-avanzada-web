import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from '../app.js';
test('health endpoint is available', async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const response = await fetch(`http://127.0.0.1:${address.port}/health`);
    assert.equal(response.status, 200);
    await response.json().then((body) => assert.deepEqual(body, { ok: true }));
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});
