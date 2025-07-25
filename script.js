let menuItems = [];
let currentOrder = [];
let orderHistory = [];
let orderCounter = 1;

function addMenuItem() {
  const name = document.getElementById('menuName').value.trim();
  const price = parseInt(document.getElementById('menuPrice').value);

  if (!name || isNaN(price)) {
    alert('Please enter both a valid menu name and price!');
    return;
  }

  if (price < 0) {
    alert('Price cannot be negative!');
    return;
  }

  menuItems.push({ name, price });
  updateMenuList();
  document.getElementById('menuName').value = '';
  document.getElementById('menuPrice').value = '';
}

function updateMenuList() {
  const menuList = document.getElementById('menuList');
  if (menuItems.length === 0) {
    menuList.innerHTML = '<p>No menu items added yet. Add some menu items to get started!</p>';
    return;
  }

  menuList.innerHTML = menuItems.map((item, index) => `
    <div class="menu-item">
      <span>${item.name} - Rp.${item.price.toLocaleString()}</span>
      <button class="delete-btn" onclick="deleteMenuItem(${index})">Delete</button>
    </div>
  `).join('');
}

function deleteMenuItem(index) {
  menuItems.splice(index, 1);
  updateMenuList();
}

function startPOS() {
  if (menuItems.length === 0) {
    alert('Please add at least one menu item before starting!');
    return;
  }

  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('posInterface').style.display = 'block';
  generateMenuGrid();
}

function generateMenuGrid() {
  const menuGrid = document.getElementById('menuGrid');
  menuGrid.innerHTML = menuItems.map((item) => `
    <button class="menu-button" onclick="addToOrder('${item.name}', ${item.price})">
      <div class="menu-name">${item.name}</div>
      <div class="menu-price">Rp.${item.price.toLocaleString()}</div>
    </button>
  `).join('');
}

function addToOrder(name, price) {
  const existingItem = currentOrder.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.total = existingItem.price * existingItem.quantity;
  } else {
    currentOrder.push({
      name: name,
      price: price,
      quantity: 1,
      total: price
    });
  }
  updateOrderDisplay();
}

function updateOrderDisplay() {
  const orderList = document.getElementById('orderList');
  const totalTransaction = document.getElementById('totalTransaction');

  if (currentOrder.length === 0) {
    orderList.innerHTML = '<p>No items selected</p>';
    totalTransaction.textContent = '0';
    return;
  }

  orderList.innerHTML = currentOrder.map(item => `
    <div class="order-item">
      <span>${item.name} x${item.quantity}</span>
      <span>Rp.${item.total.toLocaleString()}</span>
    </div>
  `).join('');

  const total = currentOrder.reduce((sum, item) => sum + item.total, 0);
  totalTransaction.textContent = total.toLocaleString();
}

function saveTransaction() {
  const paymentMethod = document.getElementById('paymentMethod').value;
  const status = document.getElementById('status').value;

  if (currentOrder.length === 0) {
    alert('No items in the order!');
    return;
  }

  if (!paymentMethod) {
    alert('Please select a payment method!');
    return;
  }

  if (!status) {
    alert('Please select a status!');
    return;
  }

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);

  const orderData = {
    number: orderCounter++,
    order: currentOrder.map(item => `${item.name} x${item.quantity}`).join(', '),
    total: currentOrder.reduce((sum, item) => sum + item.total, 0),
    date: new Date(today).toLocaleDateString('en-GB'),
    time: currentTime,
    payment: paymentMethod,
    status: status
  };

  orderHistory.unshift(orderData);
  currentOrder = [];
  document.getElementById('paymentMethod').value = '';
  document.getElementById('status').value = '';
  updateOrderDisplay();

  alert('Transaction saved successfully!');
}

function clearTransaction() {
  currentOrder = [];
  document.getElementById('paymentMethod').value = '';
  document.getElementById('status').value = '';
  updateOrderDisplay();
}

function showHistory() {
  document.getElementById('posInterface').style.display = 'none';
  document.getElementById('historyPage').style.display = 'block';
  updateHistoryDisplay();
}

function backToPOS() {
  document.getElementById('historyPage').style.display = 'none';
  document.getElementById('posInterface').style.display = 'block';
}

function updateHistoryDisplay(filteredHistory = null) {
  const historyData = filteredHistory || orderHistory;
  const historyTableBody = document.getElementById('historyTableBody');
  const totalOrders = document.getElementById('totalOrders');
  const totalSum = document.getElementById('totalSum');

  if (historyData.length === 0) {
    historyTableBody.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No transactions found</p>';
    totalOrders.textContent = '0';
    totalSum.textContent = '0';
    return;
  }

  historyTableBody.innerHTML = historyData.map(order => `
    <div class="table-row">
      <div>${order.number}</div>
      <div>${order.order}</div>
      <div>Rp.${order.total.toLocaleString()}</div>
      <div>${order.date}</div>
      <div>${order.time}</div>
      <div>${order.payment}</div>
      <div>${order.status}</div>
    </div>
  `).join('');

  totalOrders.textContent = historyData.length;
  const sum = historyData.reduce((total, order) => total + order.total, 0);
  totalSum.textContent = sum.toLocaleString();
}

function filterByDate() {
  const filterDate = document.getElementById('filterDate').value;
  if (!filterDate) {
    alert('Please select a date to filter');
    return;
  }

  const selectedDate = new Date(filterDate).toLocaleDateString('en-GB');
  const filteredHistory = orderHistory.filter(order => order.date === selectedDate);
  updateHistoryDisplay(filteredHistory);
}

function showAllHistory() {
  document.getElementById('filterDate').value = '';
  updateHistoryDisplay();
}
