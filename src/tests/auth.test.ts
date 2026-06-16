import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from '../app.js';

async function startServer() {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  return { server, port: address.port };
}

async function stopServer(server: http.Server) {
  await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
}

test('register and login flow works', async () => {
  const { server, port } = await startServer();
  try {
    const email = `student+${Date.now()}@stockflow.test`;

    const registerResponse = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'secret123', role: 'OPERATOR' }),
    });

    assert.equal(registerResponse.status, 201);

    const loginResponse = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'secret123' }),
    });

    assert.equal(loginResponse.status, 200);
    const loginBody = await loginResponse.json();
    assert.ok(loginBody.token);
    assert.equal(loginBody.user.email, email);
  } finally {
    await stopServer(server);
  }
});

test('low-stock report requires authentication', async () => {
  const { server, port } = await startServer();
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/reports/low-stock`);
    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.message, 'Token de acceso requerido');
  } finally {
    await stopServer(server);
  }
});
