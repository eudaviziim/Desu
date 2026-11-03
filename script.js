// ======================================
// CONFIGURAÇÕES DA DESU BURGUER
// ======================================

const CONFIG = {
  whatsapp: "5589981501360",
  pixKey: "+5589981501360",
  pixName: "ANDERSON HENRIQUE BATISTA",
  pixCity: "CRISTINO CASTRO",
  mapLink: "https://maps.app.goo.gl/nPViaJ3Nayq3momMA?g_st=ac"
};

// ======================================
// CARDÁPIO
// ======================================

const products = [
  // COMBOS
  { id: 1, name: "Piscininha Desu", category: "Combos", price: 32 },
  { id: 2, name: "Combo Simples", category: "Combos", price: 34 },
  { id: 3, name: "Combo Duplo", category: "Combos", price: 80 },
  { id: 4, name: "Combo Desu", category: "Combos", price: 100 },

  // HAMBÚRGUERES
  { id: 5, name: "Burger Kids", category: "Hambúrgueres", price: 18 },
  { id: 6, name: "Filé de Frango", category: "Hambúrgueres", price: 21 },
  { id: 7, name: "Frango Duplo", category: "Hambúrgueres", price: 28 },
  { id: 8, name: "Simples", category: "Hambúrgueres", price: 23 },
  { id: 9, name: "Duplo", category: "Hambúrgueres", price: 34 },
  { id: 10, name: "Giga", category: "Hambúrgueres", price: 46 },
  { id: 11, name: "X Desu", category: "Hambúrgueres", price: 26 },
  { id: 12, name: "X Desu Duplo", category: "Hambúrgueres", price: 36 },
  { id: 13, name: "Tropical", category: "Hambúrgueres", price: 25 },
  { id: 14, name: "Tropical Duplo", category: "Hambúrgueres", price: 35 },
  { id: 15, name: "Tropical Picante", category: "Hambúrgueres", price: 26 },

  // PORÇÕES
  { id: 16, name: "Coxinha 150g", category: "Porções", price: 10 },
  { id: 17, name: "Batata Simples 300g", category: "Porções", price: 18 },
  { id: 18, name: "Batata Completa 300g", category: "Porções", price: 22 },
  { id: 19, name: "Batata Completa 400g", category: "Porções", price: 25 },

  // BEBIDAS
  { id: 20, name: "Água", category: "Bebidas", price: 5 },
  { id: 21, name: "Água com gás", category: "Bebidas", price: 5 },
  { id: 22, name: "KS", category: "Bebidas", price: 4 },

  // SUCOS
  { id: 23, name: "Suco Simples", category: "Sucos", price: 8 },
  { id: 24, name: "Suco Cremoso", category: "Sucos", price: 10 }
];

let cart = [];
let selectedCategory = "Todos";
let currentOrder = null;
let customerLocation = null;

// ======================================
// ELEMENTOS
// ======================================

const categoriesElement = document.getElementById("categories");
const productsElement = document.getElementById("products");

const cartOverlay = document.getElementById("cartOverlay");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const pixOverlay = document.getElementById("pixOverlay");
const orderOverlay = document.getElementById("orderOverlay");

const cartDrawer = document.getElementById("cartDrawer");
const checkoutDrawer = document.getElementById("checkoutDrawer");
const pixDrawer = document.getElementById("pixDrawer");
const orderDrawer = document.getElementById("orderDrawer");

const cartItemsElement = document.getElementById("cartItems");
const cartSubtotalElement = document.getElementById("cartSubtotal");
const cartBarTotalElement = document.getElementById("cartBarTotal");
const cartCountElement = document.getElementById("cartCount");

const checkoutTotalElement = document.getElementById("checkoutTotal");
const pixTotalElement = document.getElementById("pixTotal");

const deliveryFields = document.getElementById("deliveryFields");
const pickupFields = document.getElementById("pickupFields");
const changeFields = document.getElementById("changeFields");
const changeAmountField = document.getElementById("changeAmountField");

const toastElement = document.getElementById("toast");

// ======================================
// FUNÇÕES GERAIS
// ======================================

function money(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");

  setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2600);
}

function openDrawer(name) {
  closeAllDrawers();

  const elements = {
    cart: [cartDrawer, cartOverlay],
    checkout: [checkoutDrawer, checkoutOverlay],
    pix: [pixDrawer, pixOverlay],
    order: [orderDrawer, orderOverlay]
  };

  const selected = elements[name];

  if (selected) {
    selected[0].classList.add("open");
    selected[1].classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeAllDrawers() {
  [
    cartDrawer,
    checkoutDrawer,
    pixDrawer,
    orderDrawer
  ].forEach(element => element.classList.remove("open"));

  [
    cartOverlay,
    checkoutOverlay,
    pixOverlay,
    orderOverlay
  ].forEach(element => element.classList.remove("open"));

  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", closeAllDrawers);
});

[cartOverlay, checkoutOverlay, pixOverlay, orderOverlay].forEach(overlay => {
  overlay.addEventListener("click", closeAllDrawers);
});

// ======================================
// LOCAL STORAGE
// ======================================

function saveCart() {
  localStorage.setItem("desuBurguerCart", JSON.stringify(cart));
}

function restoreCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("desuBurguerCart"));

    if (Array.isArray(saved)) {
      cart = saved.filter(item =>
        products.some(product => product.id === item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
    }
  } catch {
    cart = [];
  }
}

// ======================================
// CATEGORIAS E PRODUTOS
// ======================================

function renderCategories() {
  const categories = [
    "Todos",
    ...new Set(products.map(product => product.category))
  ];

  categoriesElement.innerHTML = categories.map(category => `
    <button
      class="category-button ${selectedCategory === category ? "active" : ""}"
      data-category="${category}"
      type="button">
      ${category}
    </button>
  `).join("");

  categoriesElement.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const filtered = selectedCategory === "Todos"
    ? products
    : products.filter(product => product.category === selectedCategory);

  productsElement.innerHTML = filtered.map(product => `
    <article class="product-card">
      <span class="product-category">${product.category}</span>
      <h3>${product.name}</h3>
      <p>Prepare-se para aproveitar essa opção da Desu Burguer.</p>
      <div class="product-bottom">
        <span class="product-price">${money(product.price)}</span>
        <button class="add-button" data-add="${product.id}" type="button">
          + ADICIONAR
        </button>
      </div>
    </article>
  `).join("");

  productsElement.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.add));
    });
  });
}

// ======================================
// CARRINHO
// ======================================

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  updateCart();
  showToast("Produto adicionado ao pedido!");
}

function changeQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  updateCart();
}

function getSubtotal() {
  return cart.reduce((total, item) => {
    const product = products.find(product => product.id === item.id);
    return total + product.price * item.quantity;
  }, 0);
}

function getTotalItems() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCart() {
  saveCart();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  cartCountElement.textContent =
    `${totalItems} ${totalItems === 1 ? "item" : "itens"}`;

  cartBarTotalElement.textContent = money(subtotal);
  cartSubtotalElement.textContent = money(subtotal);
  checkoutTotalElement.textContent = money(subtotal);

  if (cart.length === 0) {
    cartItemsElement.innerHTML = `
      <div class="empty-cart">
        Seu carrinho está vazio.<br>
        Escolha alguma coisa gostosa no cardápio!
      </div>
    `;
    return;
  }

  cartItemsElement.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    const itemTotal = product.price * item.quantity;

    return `
      <div class="cart-item">
        <div>
          <h4>${product.name}</h4>
          <small>${money(product.price)} cada · ${money(itemTotal)}</small>
        </div>

        <div class="quantity-controls">
          <button type="button" data-minus="${product.id}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-plus="${product.id}">+</button>
        </div>
      </div>
    `;
  }).join("");

  cartItemsElement.querySelectorAll("[data-minus]").forEach(button => {
    button.addEventListener("click", () => {
      changeQuantity(Number(button.dataset.minus), -1);
    });
  });

  cartItemsElement.querySelectorAll("[data-plus]").forEach(button => {
    button.addEventListener("click", () => {
      changeQuantity(Number(button.dataset.plus), 1);
    });
  });
}

document.getElementById("cartBar").addEventListener("click", () => {
  openDrawer("cart");
});

document.getElementById("goCheckout").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Adicione pelo menos um produto.");
    return;
  }

  openDrawer("checkout");
});

// ======================================
// ENTREGA OU RETIRADA
// ======================================

document.querySelectorAll('input[name="fulfillment"]').forEach(input => {
  input.addEventListener("change", updateFulfillment);
});

function updateFulfillment() {
  const fulfillment = document.querySelector(
    'input[name="fulfillment"]:checked'
  ).value;

  const isDelivery = fulfillment === "delivery";

  deliveryFields.classList.toggle("hidden", !isDelivery);
  pickupFields.classList.toggle("hidden", isDelivery);

  document.getElementById("customerAddress").required = isDelivery;
}

// ======================================
// PAGAMENTO
// ======================================

document.querySelectorAll('input[name="payment"]').forEach(input => {
  input.addEventListener("change", updatePayment);
});

function updatePayment() {
  const payment = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  const isCash = payment === "cash";

  changeFields.classList.toggle("hidden", !isCash);

  if (!isCash) {
    document.getElementById("needsChange").checked = false;
    document.getElementById("changeAmount").value = "";
    changeAmountField.classList.add("hidden");
  }
}

document.getElementById("needsChange").addEventListener("change", event => {
  changeAmountField.classList.toggle("hidden", !event.target.checked);
});

// ======================================
// LOCALIZAÇÃO DO CLIENTE
// ======================================

document.getElementById("locationButton").addEventListener("click", () => {
  const status = document.getElementById("locationStatus");

  if (!navigator.geolocation) {
    status.textContent = "Seu navegador não permite compartilhar localização.";
    return;
  }

  status.textContent = "Obtendo sua localização...";

  navigator.geolocation.getCurrentPosition(
    position => {
      customerLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      status.textContent = "Localização obtida com sucesso!";
      showToast("Localização adicionada ao pedido.");
    },
    () => {
      status.textContent = "Não foi possível obter sua localização. Você pode informar o endereço manualmente.";
      customerLocation = null;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000
    }
  );
});
// ======================================
// PIX - BR CODE ESTÁTICO COM VALOR DO PEDIDO
// ======================================

// O tamanho dos campos Pix é calculado em bytes UTF-8.
function tlv(id, value) {
  const text = String(value);
  const byteLength = new TextEncoder().encode(text).length;

  if (byteLength > 99) {
    throw new Error(`Campo Pix ${id} excede o limite de 99 bytes.`);
  }

  return id + String(byteLength).padStart(2, "0") + text;
}

// CRC-16/CCITT-FALSE
function crc16(payload) {
  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000)
        ? ((crc << 1) ^ 0x1021)
        : (crc << 1);

      crc &= 0xFFFF;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function generatePixPayload(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("O valor do Pix precisa ser maior que zero.");
  }

  const pixKey = String(CONFIG.pixKey || "").trim();

  if (!pixKey) {
    throw new Error("A chave Pix da loja não foi configurada.");
  }

  // Dados da chave Pix.
  const merchantAccount =
    tlv("00", "br.gov.bcb.pix") +
    tlv("01", pixKey);

  // Identificador da transação.
  const additionalData = tlv("05", "***");

  // Montagem do BR Code.
  let payload =
    tlv("00", "01") +
    tlv("01", "11") +
    tlv("26", merchantAccount) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", numericAmount.toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", CONFIG.pixName) +
    tlv("60", CONFIG.pixCity) +
    tlv("62", additionalData) +
    "6304";

  payload += crc16(payload);

  return payload;
}

// ======================================
// GERAR QR CODE
// ======================================

function generateQRCode(payload) {
  const qrElement = document.getElementById("pixQrCode");

  qrElement.innerHTML = "";

  if (!payload) {
    qrElement.textContent =
      "Não foi possível gerar o Pix. Confira os dados da loja.";
    return;
  }

  if (typeof QRCode === "undefined") {
    qrElement.textContent =
      "A biblioteca do QR Code não carregou. Use o código Pix copia e cola.";
    return;
  }

  new QRCode(qrElement, {
    text: payload,
    width: 200,
    height: 200,
    correctLevel: QRCode.CorrectLevel.M
  });
}

// ======================================
// COPIAR PIX
// ======================================

document.getElementById("copyPix").addEventListener("click", async () => {
  const textarea = document.getElementById("pixCode");
  const pixCode = textarea.value.trim();

  if (!pixCode) {
    showToast("Gere o Pix antes de copiar.");
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(pixCode);
    } else {
      textarea.focus();
      textarea.select();

      const copied = document.execCommand("copy");

      if (!copied) {
        throw new Error("Falha ao copiar");
      }
    }

    showToast("Código Pix copiado!");
  } catch {
    showToast("Não foi possível copiar. Selecione e copie o código.");
  }
});

// ======================================
// MONTAR PEDIDO
// ======================================

function createOrderFromForm() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();

  const fulfillment = document.querySelector(
    'input[name="fulfillment"]:checked'
  ).value;

  const payment = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  const address = document.getElementById("customerAddress").value.trim();
  const reference = document.getElementById("addressReference").value.trim();

  const needsChange = document.getElementById("needsChange").checked;
  const changeAmount = document.getElementById("changeAmount").value;

  if (!name || !phone) {
    showToast("Preencha seu nome e telefone.");
    return null;
  }

  if (fulfillment === "delivery" && !address) {
    showToast("Informe o endereço para entrega.");
    return null;
  }

  if (
    payment === "cash" &&
    needsChange &&
    (!changeAmount || Number(changeAmount) <= 0)
  ) {
    showToast("Informe para quanto precisa de troco.");
    return null;
  }

  const items = cart.map(item => {
    const product = products.find(product => product.id === item.id);

    return {
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      total: product.price * item.quantity
    };
  });

  return {
    name,
    phone,
    fulfillment,
    payment,
    address,
    reference,
    needsChange,
    changeAmount,
    location: customerLocation,
    items,
    total: getSubtotal()
  };
}

// ======================================
// ENVIAR FORMULÁRIO
// ======================================

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    showToast("Seu carrinho está vazio.");
    return;
  }

  const order = createOrderFromForm();

  if (!order) return;

  currentOrder = order;

  if (order.payment === "pix") {
    showPixPayment(order);
  } else {
    showOrderReady(order);
  }
});

// ======================================
// FLUXO PIX
// ======================================

function showPixPayment(order) {
  try {
    const payload = generatePixPayload(order.total);

    document.getElementById("pixTotal").textContent = money(order.total);
    document.getElementById("pixCode").value = payload;

    generateQRCode(payload);
    openDrawer("pix");
  } catch (error) {
    console.error("Erro ao gerar Pix:", error);
    showToast(error.message || "Não foi possível gerar o Pix.");
  }
}

document.getElementById("pixPaidButton").addEventListener("click", () => {
  if (!currentOrder || currentOrder.payment !== "pix") {
    showToast("Não foi possível localizar seu pedido.");
    return;
  }

  const message = buildWhatsAppMessage(currentOrder, true);
  openWhatsApp(message);
});

// ======================================
// FLUXO CARTÃO E DINHEIRO
// ======================================

function showOrderReady(order) {
  const title = document.getElementById("orderReadyTitle");
  const description = document.getElementById("orderReadyText");
  const summary = document.getElementById("orderPaymentSummary");

  if (order.payment === "card") {
    title.textContent = "Pagamento no cartão";

    description.textContent =
      "Seu pedido está pronto. Envie pelo WhatsApp e pague com cartão pessoalmente na entrega ou retirada.";

    summary.innerHTML = `
      <strong>Forma de pagamento:</strong> Cartão<br>
      <strong>Valor dos produtos:</strong> ${money(order.total)}<br>
      <strong>Pagamento:</strong> Na entrega ou retirada.
    `;
  }

  if (order.payment === "cash") {
    title.textContent = "Pagamento em dinheiro";

    description.textContent =
      "Seu pedido está pronto. Envie pelo WhatsApp e pague pessoalmente na entrega ou retirada.";

    let changeText = "Não precisa de troco.";

    if (order.needsChange) {
      changeText =
        `Precisa de troco para ${money(Number(order.changeAmount))}.`;
    }

    summary.innerHTML = `
      <strong>Forma de pagamento:</strong> Dinheiro<br>
      <strong>Valor dos produtos:</strong> ${money(order.total)}<br>
      <strong>Troco:</strong> ${changeText}<br>
      <strong>Pagamento:</strong> Na entrega ou retirada.
    `;
  }

  openDrawer("order");
}

document.getElementById("sendOrderButton").addEventListener("click", () => {
  if (!currentOrder || currentOrder.payment === "pix") {
    showToast("Não foi possível localizar seu pedido.");
    return;
  }

  const message = buildWhatsAppMessage(currentOrder, false);
  openWhatsApp(message);
});

// ======================================
// MENSAGEM DO WHATSAPP
// ======================================

function buildWhatsAppMessage(order, pixProofExpected) {
  const lines = [];

  lines.push("🍔 *NOVO PEDIDO — DESU BURGUER*");
  lines.push("");
  lines.push("*ITENS DO PEDIDO*");

  order.items.forEach(item => {
    lines.push(
      `• ${item.quantity}x ${item.name} — ${money(item.price)} cada`
    );

    lines.push(`  Subtotal: ${money(item.total)}`);
  });

  lines.push("");
  lines.push(`*TOTAL DOS PRODUTOS: ${money(order.total)}*`);
  lines.push("Taxa de entrega: a confirmar pela loja.");
  lines.push("");

  lines.push("*DADOS DO CLIENTE*");
  lines.push(`Nome: ${order.name}`);
  lines.push(`Telefone: ${order.phone}`);
  lines.push("");

  if (order.fulfillment === "delivery") {
    lines.push("*TIPO: ENTREGA*");
    lines.push(`Endereço: ${order.address}`);
    lines.push(`Referência: ${order.reference || "Não informado"}`);

    if (order.location) {
      const locationUrl =
        `https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}`;

      lines.push(`Localização: ${locationUrl}`);
    }
  } else {
    lines.push("*TIPO: RETIRADA NA LOJA*");
    lines.push(`Localização da loja: ${CONFIG.mapLink}`);
  }

  lines.push("");

  if (order.payment === "pix") {
    lines.push("*PAGAMENTO: PIX*");
    lines.push("Cliente informa que realizou o pagamento.");
    lines.push(
      "Comprovante será enviado nesta conversa para conferência da loja."
    );
  }

  if (order.payment === "card") {
    lines.push("*PAGAMENTO: CARTÃO*");
    lines.push("Pagamento pessoalmente na entrega ou retirada.");
  }

  if (order.payment === "cash") {
    lines.push("*PAGAMENTO: DINHEIRO*");

    if (order.needsChange) {
      lines.push(
        `Precisa de troco para: ${money(Number(order.changeAmount))}`
      );
    } else {
      lines.push("Não precisa de troco.");
    }

    lines.push("Pagamento pessoalmente na entrega ou retirada.");
  }

  lines.push("");
  lines.push("Pedido enviado pelo cardápio online da Desu Burguer.");

  return lines.join("\n");
}

// ======================================
// ABRIR WHATSAPP
// ======================================

function openWhatsApp(message) {
  const url =
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  showToast("Abrindo WhatsApp...");

  // Mantém o carrinho salvo até o cliente decidir limpar.
}

// ======================================
// INICIALIZAÇÃO
// ======================================

restoreCart();
renderCategories();
renderProducts();
updateCart();
updateFulfillment();
updatePayment();