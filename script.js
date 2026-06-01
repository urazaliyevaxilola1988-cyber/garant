// ===== GARANT — Main Script =====

// ===== LOCAL STORAGE HELPERS =====
const Store = {
  get(key, def = null) {
    try {
      const v = localStorage.getItem('garant_' + key);
      return v ? JSON.parse(v) : def;
    } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('garant_' + key, JSON.stringify(val)); } catch {}
  }
};

// ===== CATEGORY → IMAGE MAP =====
const CAT_IMAGES = {
  'Dazmollar':              'images/cat-dazmol.jpg',
  'Kolyaskalar':            'images/cat-kolyaska.jpg',
  'Tozalash texnikasi':     'images/cat-tozalash.jpg',
  'Muzlatgichlar':          'images/cat-muzlatgich.jpg',
  'Kir yuvish mashinalari': 'images/cat-kir.jpg',
  'Konditsionerlar':        'images/cat-konditsioner.jpg',
  'Televizorlar':           'images/cat-televizor.jpg',
  'Boshqalar':              'images/cat-boshqa.jpg',
};

function getProductImage(p) {
  if (p.image) return p.image;
  if (CAT_IMAGES[p.category]) return CAT_IMAGES[p.category];
  return 'images/product-default.jpg';
}

// ===== DEFAULT DATA =====
const DEFAULT_CATEGORIES = ['Dazmollar','Kolyaskalar','Tozalash texnikasi','Muzlatgichlar','Kir yuvish mashinalari','Konditsionerlar','Televizorlar','Boshqalar'];

const DEFAULT_PRODUCTS = [
  { id:1, name:'Artel SI2601 Dazmol',   brand:'Artel',   category:'Dazmollar',           price:580000,  stock:12, minStock:3, image:'images/dazmol-artel.jpg', desc:"Bug'li, 2600W, keramik tabancha", active:true },
  { id:2, name:'Chicco Best Friend Pro', brand:'Chicco',  category:'Kolyaskalar',          price:3200000, stock:5,  minStock:2, image:'', desc:"3-g'ildirakli, yengil ramka",   active:true },
  { id:3, name:'Karcher K2 Compact',    brand:'Karcher', category:'Tozalash texnikasi',   price:1450000, stock:8,  minStock:2, image:'', desc:'Bosimli yuvgich, 110 bar',        active:true },
  { id:4, name:'Samsung RB38T603DB1',   brand:'Samsung', category:'Muzlatgichlar',         price:5600000, stock:3,  minStock:1, image:'', desc:'No Frost, 384 litr',              active:true },
  { id:5, name:'LG F4WV509S0E',         brand:'LG',      category:'Kir yuvish mashinalari',price:4200000, stock:6,  minStock:2, image:'', desc:'9 kg, inverter motor',            active:true },
  { id:6, name:'Bosch WAN28281GB',      brand:'Bosch',   category:'Kir yuvish mashinalari',price:3800000, stock:4,  minStock:2, image:'', desc:'8 kg, EcoSilence Drive',          active:true },
  { id:7, name:'Tefal FV5696 Dazmol',   brand:'Tefal',   category:'Dazmollar',            price:850000,  stock:15, minStock:5, image:'', desc:"Bug'li, 2600W, SteamGlide",      active:true },
  { id:8, name:'Stokke Trailz 4W',      brand:'Stokke',  category:'Kolyaskalar',          price:6500000, stock:2,  minStock:1, image:'', desc:"Premium 4-g'ildirakli",          active:true },
];

const DEFAULT_TRANSACTIONS = [
  { id:1,  type:'income',  amount:4250000, desc:'Artel dazmol sotildi x5',     category:'Savdo',    date:'2026-05-01' },
  { id:2,  type:'expense', amount:850000,  desc:'Elektr energiya',             category:'Kommunal', date:'2026-05-02' },
  { id:3,  type:'income',  amount:9600000, desc:'Samsung muzlatgich x2',       category:'Savdo',    date:'2026-05-05' },
  { id:4,  type:'expense', amount:1200000, desc:'Yangi mahsulot zakaz',        category:'Xarid',    date:'2026-05-07' },
  { id:5,  type:'income',  amount:3200000, desc:'Chicco kolyaska',             category:'Savdo',    date:'2026-05-10' },
  { id:6,  type:'expense', amount:500000,  desc:'Reklama (Instagram)',         category:'Marketing',date:'2026-05-12' },
  { id:7,  type:'income',  amount:6300000, desc:'LG kir yuvish x3',           category:'Savdo',    date:'2026-05-15' },
  { id:8,  type:'expense', amount:2000000, desc:'Xodim maoshi',               category:'Ish haqi', date:'2026-05-20' },
  { id:9,  type:'income',  amount:2900000, desc:'Karcher, mix mahsulotlar',    category:'Savdo',    date:'2026-05-22' },
  { id:10, type:'expense', amount:300000,  desc:"Qog'oz va ofis",             category:'Ofis',     date:'2026-05-25' },
];

// ===== INIT DATA =====
function initData() {
  if (!Store.get('products'))     Store.set('products',     DEFAULT_PRODUCTS);
  if (!Store.get('transactions')) Store.set('transactions', DEFAULT_TRANSACTIONS);
  if (!Store.get('categories'))   Store.set('categories',   DEFAULT_CATEGORIES);
  if (!Store.get('nextProductId'))Store.set('nextProductId', 9);
  if (!Store.get('nextTransId'))  Store.set('nextTransId',  11);
  if (!Store.get('comments'))     Store.set('comments', [
    { id:1, name:'Barno Toshmatova', avatar:'BT', stars:5, text:"Artel dazmolni sotib oldim. Juda sifatli va narxi ham qulay. Rahmat!", date:'15.05.2026' },
    { id:2, name:'Jasur Raximov',    avatar:'JR', stars:5, text:"Karcher yuvgich zor ekan. 3 kunda yetkazib berishdi. 10/10!",          date:'20.05.2026' }
  ]);
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  let c = document.getElementById('toastContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = '<span>' + ({success:'✓',error:'✕',info:'ℹ'}[type]||'✓') + '</span> ' + msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ===== FORMAT PRICE =====
function fmtPrice(n) {
  return new Intl.NumberFormat('uz-UZ').format(n) + " so'm";
}

// ===== MODAL =====
function openModal(id)  { const m=document.getElementById(id); if(m) m.classList.add('open'); }
function closeModal(id) { const m=document.getElementById(id); if(m) m.classList.remove('open'); }

// ===== NAV =====
function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('open');
}
function scrollToContact() {
  const el = document.getElementById('contact');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== REVEAL =====
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ===== RENDER HOME CATALOG =====
function renderHomeCatalog() {
  const grid = document.getElementById('homeProductsGrid');
  if (!grid) return;
  const products = Store.get('products', []).filter(p => p.active).slice(0, 8);
  grid.innerHTML = '';
  if (!products.length) {
    grid.innerHTML = '<p style="color:var(--gray);text-align:center;grid-column:1/-1;padding:40px 0">Hozircha mahsulotlar yo\'q.</p>';
    return;
  }
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    const stockClass = p.stock===0 ? 'out' : p.stock<=p.minStock ? 'low-stock' : 'in-stock';
    const stockText  = p.stock===0 ? 'Tugagan' : p.stock<=p.minStock ? 'Kam qoldi' : 'Mavjud';
    card.innerHTML = `
      <div class="product-img" style="background:#eee">
        <img src="${getProductImage(p)}" alt="${p.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">
        <div style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:56px;background:#f0f0f0">${p.emoji||'📦'}</div>
        <div class="product-tag-badge ${p.stock===0?'out-of-stock':''}">${p.category}</div>
      </div>
      <div class="product-body">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-stock ${stockClass}">${stockText} — ${p.stock} dona</div>
        <div class="product-info">${p.desc||''}</div>
        <div class="product-footer">
          <div class="product-price">${fmtPrice(p.price)}</div>
          ${p.stock===0
            ? `<button class="product-btn" style="background:var(--gray);cursor:not-allowed;font-size:11px" disabled>Tugagan</button>`
            : `<button class="product-btn" onclick="addToCart(${p.id})" title="Savatchaga qo'shish">🛒 Savatcha</button>`
          }
        </div>
      </div>`;
    grid.appendChild(card);
  });
  initReveal();
}

// ===== FORM SUBMIT =====
function formSubmit(btn) {
  btn.textContent = '✓ Yuborildi!';
  btn.style.background = '#1a6b2f';
  setTimeout(() => { btn.textContent = 'Yuborish →'; btn.style.background = ''; }, 3000);
}

// ===== TELEGRAM TOKEN =====
const TG_BOT_TOKEN_CART = '8811327198:AAEqc0QRhDAtB13vTlqXTC-16o1LAxnIyx8';

// ===========================
// ===== SAVATCHA TIZIMI =====
// ===========================

// Savatchani localStorage dan olish
function getCart() {
  return Store.get('cart', []);
}

// Savatchani saqlash + badge yangilash
function saveCart(cart) {
  Store.set('cart', cart);
  updateCartBadge();
}

// Nav badge yangilash
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'flex' : 'none';
  });
}

// Savatchaga qo'shish
function addToCart(productId) {
  const products = Store.get('products', []);
  const p = products.find(x => x.id == productId);
  if (!p || p.stock === 0) { showToast("Mahsulot mavjud emas!", 'error'); return; }

  const cart = getCart();
  const existing = cart.find(i => i.id == productId);
  if (existing) {
    if (existing.qty >= p.stock) {
      showToast(`Omborda faqat ${p.stock} dona mavjud!`, 'error'); return;
    }
    existing.qty += 1;
  } else {
    cart.push({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      image: getProductImage(p),
      emoji: p.emoji || '📦',
      qty: 1,
      stock: p.stock
    });
  }
  saveCart(cart);
  showToast(`"${p.brand} ${p.name}" savatchaga qo'shildi 🛒`, 'success');
  renderCartModal();
}

// Savatcha miqdorini o'zgartirish
function changeCartQty(productId, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id == productId);
  if (idx === -1) return;
  cart[idx].qty = Math.max(1, Math.min(cart[idx].qty + delta, cart[idx].stock));
  saveCart(cart);
  renderCartModal();
}

// Savatchadan o'chirish
function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id != productId);
  saveCart(cart);
  renderCartModal();
}

// Savatchani render qilish
function renderCartModal() {
  const cart = getCart();
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <div class="cart-empty-title">Savatcha bo'sh</div>
        <div class="cart-empty-sub">Mahsulotlarni savatchaga qo'shing</div>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(i => `
    <div class="citem" id="citem-${i.id}">
      <div class="citem-img">
        <img src="${i.image}" alt="${i.name}" onerror="this.src='images/product-default.jpg'">
      </div>
      <div class="citem-info">
        <div class="citem-name">${i.brand} ${i.name}</div>
        <div class="citem-price">${fmtPrice(i.price * i.qty)}</div>
      </div>
      <div class="citem-ctrl">
        <button class="cqty-btn" onclick="changeCartQty(${i.id}, -1)">−</button>
        <span class="cqty-num">${i.qty}</span>
        <button class="cqty-btn" onclick="changeCartQty(${i.id}, 1)">+</button>
        <button class="cdel-btn" onclick="removeFromCart(${i.id})" title="O'chirish">🗑️</button>
      </div>
    </div>`).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  if (footer) {
    footer.style.display = 'block';
    footer.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-top:1px solid #eee;background:#f8f8f8">
        <div style="font-size:13px;color:#888">${count} ta mahsulot</div>
        <div style="font-size:18px;font-weight:900;color:var(--red)">${fmtPrice(total)}</div>
      </div>
      <div style="padding:14px 20px">
        <button onclick="openCheckout()" style="width:100%;background:var(--red);color:#fff;border:none;border-radius:100px;padding:16px;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);letter-spacing:0.05em;text-transform:uppercase;transition:background 0.2s" onmouseover="this.style.background='var(--red-dark)'" onmouseout="this.style.background='var(--red)'">
          ✅ Buyurtma berish
        </button>
        <button onclick="clearCart()" style="width:100%;background:none;border:none;color:#aaa;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-body);margin-top:8px;padding:4px">
          Savatchani tozalash
        </button>
      </div>`;
  }
}

// Savatchani ochish
function openCart() {
  renderCartModal();
  const m = document.getElementById('cartModal');
  if (m) m.classList.add('open');
}

// Savatchani yopish
function closeCart() {
  const m = document.getElementById('cartModal');
  if (m) m.classList.remove('open');
}

// Savatchani tozalash
function clearCart() {
  if (!confirm("Savatchani tozalashni tasdiqlaysizmi?")) return;
  saveCart([]);
  renderCartModal();
}

// ===== CHECKOUT MODAL =====
function openCheckout() {
  const cart = getCart();
  if (!cart.length) { showToast("Savatcha bo'sh!", 'error'); return; }

  const box = document.getElementById('checkoutBox');
  if (!box) return;

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemsHtml = cart.map(i => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px">
      <span style="color:#333;font-weight:600">${i.brand} ${i.name} <span style="color:#aaa">×${i.qty}</span></span>
      <span style="font-weight:800;color:#111">${fmtPrice(i.price * i.qty)}</span>
    </div>`).join('');

  box.innerHTML = `
    <div style="background:linear-gradient(135deg,#1a1a1a,#2d2d2d);padding:22px 24px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="color:#fff;font-family:var(--font-display);font-size:18px;font-weight:900">✅ Buyurtmani rasmiylashtirish</div>
        <div style="color:rgba(255,255,255,0.45);font-size:12px;margin-top:2px">${cart.reduce((s,i)=>s+i.qty,0)} ta mahsulot</div>
      </div>
      <button onclick="closeCheckout()" style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
    </div>
    <div style="padding:20px 24px;max-height:60vh;overflow-y:auto">
      <div style="background:#f8f8f8;border-radius:12px;padding:14px 16px;margin-bottom:18px">
        ${itemsHtml}
        <div style="display:flex;justify-content:space-between;padding-top:10px;font-family:var(--font-display);font-size:16px;font-weight:900">
          <span>Jami:</span>
          <span style="color:var(--red)">${fmtPrice(total)}</span>
        </div>
      </div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:14px">Aloqa ma'lumotlari</div>
      <div style="margin-bottom:12px">
        <label style="display:block;font-size:12px;font-weight:700;color:#333;margin-bottom:5px">Ismingiz <span style="color:var(--red)">*</span></label>
        <input id="coName" type="text" placeholder="Ism Familiya"
          style="width:100%;border:2px solid #e8e8e8;border-radius:10px;padding:11px 13px;font-size:14px;font-family:var(--font-body);outline:none;box-sizing:border-box;transition:border-color 0.2s"
          onfocus="this.style.borderColor='var(--red)'" onblur="this.style.borderColor='#e8e8e8'">
      </div>
      <div style="margin-bottom:12px">
        <label style="display:block;font-size:12px;font-weight:700;color:#333;margin-bottom:5px">Telefon <span style="color:var(--red)">*</span></label>
        <input id="coPhone" type="tel" placeholder="+998 XX XXX XX XX"
          style="width:100%;border:2px solid #e8e8e8;border-radius:10px;padding:11px 13px;font-size:14px;font-family:var(--font-body);outline:none;box-sizing:border-box;transition:border-color 0.2s"
          onfocus="this.style.borderColor='var(--red)'" onblur="this.style.borderColor='#e8e8e8'">
      </div>
      <div style="margin-bottom:18px">
        <label style="display:block;font-size:12px;font-weight:700;color:#333;margin-bottom:5px">Manzil / Izoh <span style="color:#aaa;font-weight:400">(ixtiyoriy)</span></label>
        <textarea id="coNote" rows="2" placeholder="Yetkazib berish manzili yoki izoh..."
          style="width:100%;border:2px solid #e8e8e8;border-radius:10px;padding:11px 13px;font-size:14px;font-family:var(--font-body);outline:none;resize:none;box-sizing:border-box;transition:border-color 0.2s"
          onfocus="this.style.borderColor='var(--red)'" onblur="this.style.borderColor='#e8e8e8'"></textarea>
      </div>
      <button id="coSubmitBtn" onclick="submitCheckout(this)"
        style="width:100%;background:var(--red);color:#fff;border:none;border-radius:100px;padding:16px;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);letter-spacing:0.05em;text-transform:uppercase;transition:background 0.2s">
        ✅ Buyurtmani yuborish
      </button>
      <div style="text-align:center;margin-top:10px;font-size:11px;color:#aaa">🔒 Ma'lumotlaringiz xavfsiz</div>
    </div>`;

  const m = document.getElementById('checkoutModal');
  if (m) m.classList.add('open');
}

function closeCheckout() {
  const m = document.getElementById('checkoutModal');
  if (m) m.classList.remove('open');
}

async function submitCheckout(btn) {
  const name  = document.getElementById('coName')?.value.trim();
  const phone = document.getElementById('coPhone')?.value.trim();
  const note  = document.getElementById('coNote')?.value.trim();
  const cart  = getCart();

  if (!name)  { const el=document.getElementById('coName');  el.style.borderColor='var(--red)'; el.style.background='#fff5f5'; el.addEventListener('input',()=>{el.style.borderColor='#e8e8e8';el.style.background='';},{once:true}); }
  if (!phone) { const el=document.getElementById('coPhone'); el.style.borderColor='var(--red)'; el.style.background='#fff5f5'; el.addEventListener('input',()=>{el.style.borderColor='#e8e8e8';el.style.background='';},{once:true}); }
  if (!name || !phone) { showToast("Ism va telefon raqamini kiriting!", 'error'); return; }
  if (!cart.length) { showToast("Savatcha bo'sh!", 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '⏳ Yuborilmoqda...';
  btn.style.background = '#888';

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const today = new Date().toISOString().slice(0, 10);

  // 1) Buyurtmani saqlash
  const orders = Store.get('orders', []);
  orders.unshift({
    id: Date.now(),
    name, phone,
    address: note || '',
    note: '',
    total,
    items: cart.map(i => ({ brand: i.brand, name: i.name, price: i.price, qty: i.qty, variant: {} })),
    status: 'new',
    date: new Date().toLocaleString('uz-UZ')
  });
  Store.set('orders', orders);

  // 2) Har bir mahsulot stockini kamaytirish
  const products = Store.get('products', []);
  cart.forEach(item => {
    const idx = products.findIndex(p => p.id == item.id);
    if (idx > -1) {
      products[idx].stock = Math.max(0, products[idx].stock - item.qty);
    }
  });
  Store.set('products', products);

  // 3) Moliyaga kirim tranzaksiya qo'shish
  const trans = Store.get('transactions', []);
  let transId = Store.get('nextTransId', 11);
  const itemsDesc = cart.map(i => `${i.brand} ${i.name} ×${i.qty}`).join(', ');
  trans.push({
    id: transId++,
    type: 'income',
    amount: total,
    desc: `Buyurtma: ${itemsDesc} (${name})`,
    category: 'Savdo',
    date: today
  });
  Store.set('transactions', trans);
  Store.set('nextTransId', transId);

  // 4) Telegram xabar
  const itemsTg = cart.map(i => `  • ${i.brand} ${i.name} ×${i.qty} — ${fmtPrice(i.price * i.qty)}`).join('\n');
  const tgText = `🛒 <b>Yangi buyurtma (Savatcha)!</b>\n\n👤 <b>Ism:</b> ${name}\n📞 <b>Telefon:</b> ${phone}\n${note?`📍 <b>Manzil:</b> ${note}\n`:''}\n📦 <b>Mahsulotlar:</b>\n${itemsTg}\n\n💰 <b>Jami:</b> ${fmtPrice(total)}\n🕐 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n🌐 <b>Manba:</b> Garant veb-sayt`;

  let sent = false;
  try {
    const upd = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN_CART}/getUpdates`);
    const ud  = await upd.json();
    if (ud.ok && ud.result.length) {
      const last = ud.result[ud.result.length - 1];
      const chatId = last.message?.chat?.id || last.channel_post?.chat?.id;
      if (chatId) {
        const r = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN_CART}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: tgText, parse_mode: 'HTML' })
        });
        sent = (await r.json()).ok;
      }
    }
  } catch(e) {}

  // 5) Savatchani tozalash
  saveCart([]);

  btn.innerHTML = '✓ Buyurtma qabul qilindi!';
  btn.style.background = '#1a7a38';
  showToast("Buyurtmangiz qabul qilindi! Tez orada bog'lanamiz ✅", 'success');

  setTimeout(() => {
    closeCheckout();
    closeCart();
    renderCartModal();
  }, 2000);

  if (!sent) setTimeout(() => window.open('https://t.me/garant_admin_chat_bot','_blank'), 1500);
}