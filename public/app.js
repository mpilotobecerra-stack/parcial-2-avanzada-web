const output = document.getElementById('output');
const currentUser = document.getElementById('currentUser');
const currentRole = document.getElementById('currentRole');
const currentToken = document.getElementById('currentToken');

let authToken = '';
let userEmail = '';
let userRole = '';

function formatResult(result) {
  if (typeof result === 'string') return result;
  return JSON.stringify(result, null, 2);
}

function showResult(result) {
  output.textContent = formatResult(result);
}

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  return headers;
}

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw { status: res.status, body };
  }
  return body;
}

function updateSession(user, role, token) {
  userEmail = user;
  userRole = role;
  authToken = token;
  currentUser.textContent = userEmail || 'ninguno';
  currentRole.textContent = userRole || '-';
  currentToken.textContent = authToken ? authToken.slice(0, 30) + '...' : 'sin token';
}

async function register() {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const role = document.getElementById('registerRole').value;
  try {
    const result = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    showResult(result);
  } catch (error) {
    showResult(error.body || error);
  }
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const result = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    updateSession(result.user.email, result.user.role, result.token);
    showResult(result);
  } catch (error) {
    showResult(error.body || error);
  }
}

async function loadProducts() {
  try {
    const data = await request('/api/products');
    showResult(data);
  } catch (error) {
    showResult(error.body || error);
  }
}

async function loadLowStock() {
  try {
    const data = await request('/api/products/low-stock');
    showResult(data);
  } catch (error) {
    showResult(error.body || error);
  }
}

async function createProduct() {
  const name = document.getElementById('productName').value;
  const sku = document.getElementById('productSku').value;
  const stock = Number(document.getElementById('productStock').value);
  const minStock = Number(document.getElementById('productMinStock').value);
  const price = Number(document.getElementById('productPrice').value);
  const categoryId = Number(document.getElementById('productCategoryId').value);
  try {
    const data = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify({ name, sku, stock, minStock, price, categoryId }),
    });
    showResult(data);
  } catch (error) {
    showResult(error.body || error);
  }
}

function createItemLine() {
  const container = document.getElementById('orderItems');
  const wrapper = document.createElement('div');
  wrapper.className = 'order-item';
  wrapper.innerHTML = `
    <label>Producto ID<input type="number" class="itemProduct" min="1" /></label>
    <label>Cantidad<input type="number" class="itemQuantity" min="1" value="1" /></label>
    <button type="button" class="remove-btn">Eliminar</button>
  `;
  wrapper.querySelector('.remove-btn').addEventListener('click', () => wrapper.remove());
  container.appendChild(wrapper);
}

function getOrderItems() {
  const items = [];
  const wrappers = document.querySelectorAll('.order-item');
  wrappers.forEach((wrapper) => {
    const productId = Number(wrapper.querySelector('.itemProduct').value);
    const quantity = Number(wrapper.querySelector('.itemQuantity').value);
    if (productId && quantity) {
      items.push({ productId, quantity });
    }
  });
  return items;
}

async function createOrder() {
  const items = getOrderItems();
  try {
    const data = await request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    showResult(data);
  } catch (error) {
    showResult(error.body || error);
  }
}

async function loadOrder() {
  const id = Number(document.getElementById('orderIdInput').value);
  try {
    const data = await request(`/api/orders/${id}`);
    showResult(data);
  } catch (error) {
    showResult(error.body || error);
  }
}

async function updateOrderStatus() {
  const id = Number(document.getElementById('orderStatusId').value);
  const status = document.getElementById('orderStatusSelect').value;
  try {
    const data = await request(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    showResult(data);
  } catch (error) {
    showResult(error.body || error);
  }
}

function attachHandlers() {
  document.getElementById('registerBtn').addEventListener('click', register);
  document.getElementById('loginBtn').addEventListener('click', login);
  document.getElementById('loadProductsBtn').addEventListener('click', loadProducts);
  document.getElementById('lowStockBtn').addEventListener('click', loadLowStock);
  document.getElementById('createProductBtn').addEventListener('click', createProduct);
  document.getElementById('addItemBtn').addEventListener('click', () => createItemLine());
  document.getElementById('createOrderBtn').addEventListener('click', createOrder);
  document.getElementById('loadOrderBtn').addEventListener('click', loadOrder);
  document.getElementById('updateOrderBtn').addEventListener('click', updateOrderStatus);
}

window.addEventListener('DOMContentLoaded', () => {
  attachHandlers();
  createItemLine();
  showResult('Inicia sesión para usar las rutas protegidas.');
});
