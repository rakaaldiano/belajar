function kartuProduk(product) {
    return `
        <div class="shadow-lg rounded-lg cursor-pointer">
            <img src="${product.image}" class="rounded-tl-lg rounded-tr-lg h-60 w-60 object-contain p-4"/>
            <div class="p-5">
            <h3 class="font-semibold text-lg mb-2 h-30">${product.title}</h3>
            <p class="text-2xl mb-3">$${product.price}</p>
            <button class="bg-[#eb86eb] text-white p-3 cursor-pointer rounded-sm">Add to Cart</button>
            </div>
        </div>
    `;
}

function loadAndFilterProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => {
            const mensContainer = document.querySelector('.produkPria');
            const womensContainer = document.querySelector('.produkWanita');

            const mensProducts = products.filter(p => p.category.includes("men"));
            const womensProducts = products.filter(p => p.category.includes("women"));

            const isLandingPage = window.location.pathname.includes('index.html');

            mensProducts.slice(0, 4).forEach(p => {
                const card = document.createElement('div');
                card.innerHTML = kartuProduk(p);

                const addToCartBtn = card.querySelector('button');
                if (addToCartBtn) {
                    addToCartBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        addToCart(p, 1);
                        alert('Product added to cart!');
                    });
                }

               
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        if (isLandingPage) {
                            alert('Please register first');
                            window.location.href = 'register.html';
                        } else {
                            window.location.href = `product.html?id=${p.id}`;
                        }
                    }
                });

                mensContainer.appendChild(card);
            });

            womensProducts.slice(0, 4).forEach(p => {
                const card = document.createElement('div');
                card.innerHTML = kartuProduk(p);

                const addToCartBtn = card.querySelector('button');
                if (addToCartBtn) {
                    addToCartBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        addToCart(p, 1);
                        alert('Product added to cart!');
                    });
                }

                card.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        if (isLandingPage) {
                            alert('Please register to view product details!');
                            window.location.href = 'register.html';
                        } else {
                            window.location.href = `product.html?id=${p.id}`;
                        }
                    }
                });

                womensContainer.appendChild(card);
            });
        });
}


function loadProductDetail() {
    if (window.location.pathname.includes('product.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            fetch(`https://fakestoreapi.com/products/${productId}`)
                .then(res => res.json())
                .then(product => {
                    document.getElementById('product-image').src = product.image;
                    document.getElementById('product-category').textContent = product.category;
                    document.getElementById('product-title').textContent = product.title;
                    document.getElementById('product-price').textContent = `$${product.price}`;
                    document.getElementById('product-description').textContent = product.description;

                    const addToCartBtn = document.getElementById('add-to-cart-btn');
                    if (addToCartBtn) {
                        addToCartBtn.addEventListener('click', () => {
                            const amount = currentAmount;
                            addToCart(product, amount);
                            alert('Product added to cart!');
                        });
                    }
                });
        }
    }
}

function addToCart(product, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        product.quantity = quantity;
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    if (!window.location.pathname.includes('cart.html')) return;

    const cartContainer = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartContainer.innerHTML = '';

    let totalPrice = 0;

    cart.forEach((product, index) => {
        totalPrice += product.price * product.quantity;

        const item = document.createElement('div');
        item.className = "bg-white p-4 flex gap-4 text-slate-900 rounded-lg w-200 mt-5 shadow";
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="size-32 rounded-md object-contain">
            <div class="grow">
                <div class="flex justify-between mb-2">
                    <h1 class="text-xl font-semibold w-100">${product.title}</h1>
                    <p class="text-xl font-semibold">$${product.price}</p>
                </div>
                <p class="text-xs text-slate-600 w-5/6 mb-4">${product.description.substring(0, 100)}...</p>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2 items-center">
                        <button onclick="updateQuantity(${index}, -1)" class="bg-gray-200 px-2 py-1 rounded">-</button>
                        <span id="quantity-${index}" class="min-w-[24px] text-center">${product.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="bg-gray-200 px-2 py-1 rounded">+</button>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:underline cursor-pointer">Remove</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(item);
        
    });

    const checkoutDiv = document.createElement('div');
    checkoutDiv.className = "mt-10 p-5 bg-white rounded-lg shadow text-right";

    checkoutDiv.innerHTML = `
        <p class="text-xl font-semibold mb-4">Total: $${totalPrice.toFixed(2)}</p>
        <button onclick="checkoutCart()" class="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
            Checkout
        </button>
    `;

    cartContainer.appendChild(checkoutDiv);
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

loadAndFilterProducts();
loadProductDetail();
renderCart();

function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart[index]) return;

    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function checkoutCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    alert("Checkout successful!");

    localStorage.removeItem('cart');
    renderCart();
}

let currentAmount = 1;

function changeAmount(change) {
    currentAmount += change;
    if (currentAmount < 1) currentAmount = 1;
    document.getElementById('amount').textContent = currentAmount;
} 