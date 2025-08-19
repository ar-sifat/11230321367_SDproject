let cartItems = [];
const form = document.getElementById('signup-form');

// Form functions
function openForm() {
    if (form) form.style.display = 'block';
}

function closeForm() {
    if (form) form.style.display = 'none';
}

if (form) {
    window.onclick = function(event) {
        if (event.target === form) {
            closeForm();
        }
    }
}

function handleSignup(event) {
    event.preventDefault();
    alert("Sign up successful!");
    closeForm();
}

// Cart functions
function addToCart(category, imageNum) {
    const itemId = `${category}-${imageNum}`;
    const itemName = `${category.charAt(0).toUpperCase() + category.slice(1)} Design ${imageNum}`;
    
    if (!cartItems.some(item => item.id === itemId)) {
        cartItems.push({
            id: itemId,
            name: itemName,
            category: category,
            image: imageNum
        });
        updateCartDisplay();
        showCartNotification(itemName);
    } else {
        alert('This item is already in your cart!');
    }
}

function showCartNotification(itemName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${itemName} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function toggleCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    if (cartDropdown.style.display === 'flex') {
        cartDropdown.style.animation = 'cartSlideOut 0.3s forwards';
        setTimeout(() => {
            cartDropdown.style.display = 'none';
        }, 300);
    } else {
        cartDropdown.style.display = 'flex';
        cartDropdown.style.animation = 'cartSlideIn 0.3s forwards';
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    
    cartCount.textContent = cartItems.length;
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="images/${item.category}/${item.category}${item.image}.jpg" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
            </div>
            <span class="remove-item" onclick="removeFromCart(${index})">✕</span>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartDisplay();
    showCartNotification('Item removed from cart');
}

function checkout() {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout with ' + cartItems.length + ' items');
    toggleCart();
    cartItems = [];
    updateCartDisplay();
}

// Gallery functions
function initGallery(category, imageCount) {
    const galleryContainer = document.getElementById('gallery-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const imageCounter = document.getElementById('image-counter');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentIndex = 0;
    const images = [];
    
    for (let i = 1; i <= imageCount; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `images/${category}/${category}${i}.jpg`;
        img.alt = `${category} design ${i}`;
        img.dataset.index = i-1;
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart';
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.dataset.category = category;
        addToCartBtn.dataset.image = i;
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(addToCartBtn);
        galleryContainer.appendChild(galleryItem);
        images.push(`images/${category}/${category}${i}.jpg`);
        
        img.addEventListener('click', function() {
            currentIndex = parseInt(this.dataset.index);
            updateLightbox();
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        addToCartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(this.dataset.category, this.dataset.image);
        });
    }
    
    document.querySelector('.close-btn').addEventListener('click', closeLightbox);
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
    }

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
    
    function updateLightbox() {
        lightboxImg.src = images[currentIndex];
        imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    
    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }
    
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}