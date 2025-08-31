// Team Shop — Collaborative JS Project
// Covers: DOM (Ch10), Events (Ch11), Arrays/Loops (Ch12), Forms & RegEx, If/Else, Functions

// ---------- Data (arrays of objects) ----------
const items = [
  { name: 'Apple', type: 'fruit', qty: 3, done: false },
  { name: 'Banana', type: 'fruit', qty: 5, done: false },
  { name: 'Carrot', type: 'veg',   qty: 2, done: false },
  { name: 'Bread',  type: 'other', qty: 1, done: false },
];

// ---------- DOM references ----------
const listEl   = document.getElementById('list');
const stats = {
  total:  document.getElementById('totalCount'),
  fruit:  document.getElementById('fruitCount'),
  veg:    document.getElementById('vegCount'),
  other:  document.getElementById('otherCount')
};
const form = document.getElementById('addItemForm');
const nameInput = document.getElementById('itemName');
const typeInput = document.getElementById('itemType');
const qtyInput  = document.getElementById('itemQty');
const errorBox  = document.getElementById('formError');
const pills     = document.querySelectorAll('.pill');
const searchBox = document.getElementById('searchBox');

let currentFilter = 'all';
let searchQuery = '';

// ---------- Utility: validation (Regex + if/else) ----------
function validateItem(name, qty){
  const nameOk = /^[A-Za-z0-9 ]{3,30}$/.test(name);
  const qtyOk  = Number.isInteger(Number(qty)) && Number(qty) >= 1;
  if(!nameOk && !qtyOk){
    return 'Name must be 3–30 letters/numbers/spaces, quantity must be ≥ 1.';
  } else if(!nameOk){
    return 'Invalid name. Use 3–30 letters/numbers/spaces.';
  } else if(!qtyOk){
    return 'Invalid quantity. Use a number ≥ 1.';
  }
  return '';
}

// ---------- Render (DOM manipulation + loops) ----------
function render(){
  listEl.innerHTML = '';

  const visible = items.filter(it => {
    const matchesType = (currentFilter === 'all') || (it.type === currentFilter);
    const matchesText = it.name.toLowerCase().includes(searchQuery);
    return matchesType && matchesText;
  });

  visible.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} (${item.type}) — x${item.qty}`;
    li.dataset.name = item.name;

    if(item.done) li.classList.add('complete');

    const rm = document.createElement('button');
    rm.textContent = 'Remove';
    rm.className = 'pill';
    rm.style.marginLeft = '8px';
    rm.dataset.action = 'remove';
    rm.dataset.name = item.name;
    li.appendChild(rm);

    listEl.appendChild(li);
  });

  updateStats();
}

// ---------- Stats (reduce) ----------
function updateStats(){
  stats.total.textContent = `Total: ${items.length}`;
  const counts = items.reduce((acc, it) => {
    acc[it.type] = (acc[it.type] || 0) + 1;
    return acc;
  }, {});
  stats.fruit.textContent = `Fruit: ${counts.fruit || 0}`;
  stats.veg.textContent   = `Veg: ${counts.veg || 0}`;
  stats.other.textContent = `Other: ${counts.other || 0}`;
}

// ---------- Events ----------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const type = typeInput.value;
  const qty  = qtyInput.value.trim();

  // Prevent duplicates (case-insensitive)
  const dup = items.find(it => it.name.toLowerCase() == name.toLowerCase());
  if(dup){
    errorBox.textContent = 'Duplicate item name. Choose a different name.';
    return;
  }

  const err = validateItem(name, qty);
  if(err){
    errorBox.textContent = err;
    return;
  }
  errorBox.textContent = '';

  items.push({ name, type, qty: Number(qty), done: false });
  form.reset();
  nameInput.focus();
  render();
});

// Event delegation on the list: toggle done OR remove
listEl.addEventListener('click', (e) => {
  const target = e.target;
  if(target.tagName === 'LI'){
    const name = target.dataset.name;
    const idx = items.findIndex(i => i.name === name);
    if(idx !== -1){
      items[idx].done = !items[idx].done;
      target.classList.toggle('complete');
    }
  } else if(target.dataset.action === 'remove'){
    const name = target.dataset.name;
    const idx = items.findIndex(i => i.name === name);
    if(idx !== -1){
      items.splice(idx, 1);
      render();
    }
  }
});

// Filter pills
pills.forEach(btn => {
  btn.addEventListener('click', () => {
    pills.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Search box
searchBox.addEventListener('input', () => {
  searchQuery = searchBox.value.trim().toLowerCase();
  render();
});

// Initial paint
render();

// ---------- Stretch (Student C): localStorage ----------
// TODO(C): Save 'items' to localStorage on change and load on startup.
// Hint:
// localStorage.setItem('items', JSON.stringify(items));
// const saved = JSON.parse(localStorage.getItem('items')||'[]');
