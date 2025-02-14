// Product Data
const products = [
    { name: 'Classic White Long Sleeve', price: 25, image: 'img1.jpg' },
    { name: 'Casual Blue Long Sleeve', price: 30, image: 'img2.jpg' },
    { name: 'Formal Black Long Sleeve', price: 35, image: 'img3.jpg' },
    { name: 'Checkered Long Sleeve', price: 28, image: 'img4.jpg' },
    { name: 'Slim Fit Long Sleeve', price: 40, image: 'img5.jpg' },
    { name: 'Flannel Long Sleeve', price: 32, image: 'img6.jpg' },
    { name: 'Denim Long Sleeve', price: 45, image: 'img7.jpg' },
    { name: 'Hawaiian Print Long Sleeve', price: 38, image: 'img8.jpg' },
    { name: 'Layered Casual Long Sleeve', price: 50, image: 'img9.jpg' }
];

const cart = [];

// Function to display products
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous products
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px;" onclick="openImageModal('${product.image}')">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${index})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
    document.getElementById('cart-icon').style.display = 'block'; // Show cart icon on shop page
}

// Function to add products to cart
function addToCart(index) {
    const product = products[index];
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new product with quantity
    }
    updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
    const cartModalItems = document.getElementById('cart-modal-items');
    cartModalItems.innerHTML = ''; // Clear previous items
    let total = 0; // To calculate total price

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px;">
            ${item.name} - $${item.price} x 
            <button class="button-small" onclick="changeQuantity(${index}, -1)" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
            <span>${item.quantity}</span>
            <button class="button-small" onclick="changeQuantity(${index}, 1)">+</button>
            <i class="fas fa-trash delete-icon" onclick="removeFromCart('${item.name}')"></i>
        `;
        cartModalItems.appendChild(li);
        
        // Only calculate total for selected items
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.onchange = () => {
            total = checkbox.checked ? total + (item.price * item.quantity) : total - (item.price * item.quantity);
            document.getElementById('total-price').innerText = `Total: $${total}`;
            document.getElementById('checkout-button').disabled = total === 0; // Disable checkout button if total is 0
        };
        
        li.prepend(checkbox); // Add checkbox to the beginning of the list item
    });

    document.getElementById('total-price').innerText = `Total: $${total}`; // Update total price
    document.getElementById('checkout-button').style.display = cart.length > 0 ? 'inline-block' : 'none'; // Show checkout button if items are present
    document.getElementById('checkout-button').disabled = true; // Initially disable the checkout button
}

// Function to change quantity of items in cart
function changeQuantity(index, delta) {
    cart[index].quantity += delta; // Increment or decrement quantity
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Remove item if quantity is 0
    }
    updateCartDisplay(); // Update the display
}

// Function to show the selected section
function showSection(section) {
    document.getElementById('home').classList.remove('active');
    document.getElementById('shop').classList.remove('active');
    document.getElementById('cart-modal').style.display = 'none'; // Close cart modal if visible
    document.getElementById('checkout-form').classList.remove('active'); // Hide checkout form
    document.getElementById('confirmation').classList.remove('active'); // Hide confirmation

    // Show the requested section
    document.getElementById(section).classList.add('active');

    if (section === 'shop') {
        document.getElementById('navigation').style.display = 'none'; // Hide navigation in shop
        displayProducts(); // Display products when entering the shop
    } else if (section === 'home' || section === 'confirmation') {
        document.getElementById('navigation').style.display = 'flex'; // Show navigation in home and confirmation
    }
}

// Function to toggle the cart modal
function toggleCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const isVisible = cartModal.style.display === 'block';

    if (isVisible) {
        cartModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    } else {
        updateCartDisplay(); // Update the cart display
        cartModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }
}

// Function to remove product from cart
function removeFromCart(productName) {
    const productIndex = cart.findIndex(item => item.name === productName);
    if (productIndex > -1) {
        cart.splice(productIndex, 1); // Remove from cart
    }
    updateCartDisplay(); // Update display
}

// Function to show the checkout form
function showCheckoutPage() {
    document.getElementById('cart-modal').style.display = 'none'; // Close cart modal
    document.getElementById('checkout-form').classList.add('active'); // Show checkout form
}

// Function to confirm the order
function confirmOrder() {
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const address = document.getElementById('address').value;

    // Validation
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
    const contactRegex = /^[0-9]+$/; // Only numbers

    if (!nameRegex.test(name)) {
        alert('Name must contain only letters and spaces.');
        return;
    }
    if (!contactRegex.test(contact)) {
        alert('Contact number must contain only digits.');
        return;
    }

    const orderSummary = document.getElementById('order-summary');
    orderSummary.innerHTML = `
        <h3>Order Confirmed!</h3>
        <p>Name: ${name}</p>
        <p>Contact: ${contact}</p>
        <p>Address: ${address}</p>
        <h4>Items:</h4>
        <ul>
            ${cart.map(item => `<li>${item.name} - $${item.price} x ${item.quantity}</li>`).join('')}
        </ul>
        <h4>Total: $${cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</h4>
    `;
    cart.length = 0; // Clear the cart
    showSection('confirmation'); // Show the confirmation section
}

// Function to open the image modal
function openImageModal(imageSrc) {
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageSrc; // Set the source of the modal image
    document.getElementById('image-modal').style.display = 'block'; // Show the image modal
}

// Function to close the image modal
function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none'; // Hide the image modal
}