function login() {
    let name = document.getElementById('userName').value;
    let phone = document.getElementById('userPhone').value;
    let branch = document.querySelector('input[name="branch"]:checked').value;

    if (name === "" || phone === "") {
        alert("الرجاء إدخال الاسم ورقم الهاتف للمتابعة");
        return;
    }

    localStorage.setItem('customerName', name);
    localStorage.setItem('customerPhone', phone);
    localStorage.setItem('selectedBranch', branch);
    
    window.location.href = 'menu.html';
}

// تم ربط صور المنتجات بأسماء الواتساب الفعلية في مجلد img
const products = [
    { id: 1, name: "ساندوتش طعمية محشية", price: 15, image: "img/WhatsApp Image 2026-10-14 at 1.09.04 AM.jpeg" },
    { id: 2, name: "ساندوتش فول", price: 12, image: "img/WhatsApp Image 2026-10-14 at 1.09.33 AM.jpeg" },
    { id: 3, name: "ساندوتش بطاطس", price: 15, image: "img/WhatsApp Image 2026-10-14 at 1.12.57 AM.jpeg" },
    { id: 4, name: "طبق فول مميز", price: 20, image: "img/WhatsApp Image 2026-10-14 at 1.13.54 AM.jpeg" },
    { id: 5, name: "أقراص فلافل بالسمسم", price: 20, image: "img/WhatsApp Image 2026-10-14 at 1.14.52 AM.jpeg" },
    { id: 6, name: "طبق أومليت", price: 30, image: "img/WhatsApp Image 2026-10-14 at 1.18.35 AM.jpeg" },
    { id: 7, name: "فول اسكندراني", price: 20, image: "img/WhatsApp Image 2026-10-14 at 1.09.33 AM.jpeg" },
    { id: 8, name: "ساندوتش طعمية صوابع", price: 12, image: "img/WhatsApp Image 2026-10-14 at 1.09.04 AM.jpeg" },
    { id: 9, name: "بيض بالبسطرمة", price: 35, image: "img/WhatsApp Image 2026-10-14 at 1.18.35 AM.jpeg" },
    { id: 10, name: "فول بالزيت الحار", price: 15, image: "img/WhatsApp Image 2026-10-14 at 1.13.54 AM.jpeg" }
];

let cart = {};

function renderMenu() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return; 

    let branchName = localStorage.getItem('selectedBranch');
    if(branchName) {
        document.getElementById('selectedBranchDisplay').innerText = branchName;
    }

    cart = {};
    localStorage.removeItem('cart');
    grid.innerHTML = "";

    products.forEach(product => {
        cart[product.id] = { ...product, quantity: 0 }; 
        
        let card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price} جنيه</p>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
                <span class="qty-display" id="qty-${product.id}">0</span>
                <button class="qty-btn" onclick="updateQty(${product.id}, -1)">-</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateQty(id, change) {
    if (cart[id].quantity + change >= 0) {
        cart[id].quantity += change;
        document.getElementById(`qty-${id}`).innerText = cart[id].quantity;
        calculateTotal();
    }
}

function calculateTotal() {
    let total = 0;
    for (let id in cart) {
        total += cart[id].quantity * cart[id].price;
    }
    document.getElementById('totalPrice').innerText = total;
}

function goToCheckout() {
    let total = parseInt(document.getElementById('totalPrice').innerText);
    if (total === 0) {
        alert("برجاء اختيار منتج واحد على الأقل");
        return;
    }
    
    let finalCart = Object.values(cart).filter(item => item.quantity > 0);
    localStorage.setItem('cart', JSON.stringify(finalCart));
    localStorage.setItem('totalPrice', total);
    
    window.location.href = 'checkout.html';
}

function renderCheckout() {
    let cartList = document.getElementById('cartItemsList');
    if (!cartList) return;

    let savedCart = JSON.parse(localStorage.getItem('cart'));
    let savedTotal = localStorage.getItem('totalPrice');
    let branchName = localStorage.getItem('selectedBranch');

    if (!savedCart || savedCart.length === 0) {
        window.location.href = 'menu.html';
        return;
    }

    document.getElementById('finalPrice').innerText = savedTotal;

    let branchDiv = document.createElement('div');
    branchDiv.innerHTML = `<strong>الفرع المختار:</strong> ${branchName}<br><hr>`;
    branchDiv.style.marginBottom = "10px";
    branchDiv.style.color = "#800000";
    cartList.appendChild(branchDiv);

    savedCart.forEach(item => {
        let div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<span>${item.quantity}x ${item.name}</span> <span>${item.price * item.quantity} ج</span>`;
        cartList.appendChild(div);
    });
}

let mapLink = "";

function getLocation() {
    const status = document.getElementById('locationStatus');
    const btn = document.getElementById('locationBtn');
    
    if (!navigator.geolocation) {
        status.style.display = 'block';
        status.style.color = 'red';
        status.innerText = "متصفحك لا يدعم تحديد الموقع.";
        return;
    }
    
    btn.innerText = "جاري تحديد الموقع ⏳...";
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
            
            btn.innerText = "📍 تم تحديد الموقع بنجاح";
            btn.style.backgroundColor = "#25D366";
            btn.style.color = "white";
            btn.style.borderColor = "#25D366";
            
            status.style.display = 'block';
            status.style.color = 'green';
            status.innerText = "تم حفظ موقعك على الخريطة لسهولة الوصول إليك.";
        },
        (error) => {
            status.style.display = 'block';
            status.style.color = 'red';
            status.innerText = "حدث خطأ. يرجى التأكد من تفعيل الـ GPS (الموقع) في هاتفك.";
            btn.innerText = "📍 حدد موقعي الحالي (GPS)";
        }
    );
}

function confirmOrder() {
    let address = document.getElementById('address').value;
    let extraPhone = document.getElementById('extraPhone').value;
    let paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (address === "") {
        alert("برجاء كتابة العنوان اليدوي بالتفصيل (رقم العمارة، الشقة، الخ..)");
        return;
    }

    let name = localStorage.getItem('customerName');
    let phone = localStorage.getItem('customerPhone');
    let branch = localStorage.getItem('selectedBranch');
    let savedCart = JSON.parse(localStorage.getItem('cart'));
    let total = localStorage.getItem('totalPrice');

    let message = `*طلب جديد من موقع أبو يحيى* 🔴\n\n`;
    message += `🏪 *الفرع المختار:* ${branch}\n\n`;
    message += `👤 *الاسم:* ${name}\n`;
    message += `📞 *الموبايل:* ${phone}\n`;
    if(extraPhone) message += `📞 *رقم إضافي:* ${extraPhone}\n`;
    
    message += `\n📍 *العنوان المكتوب:* ${address}\n`;
    if(mapLink !== "") {
        message += `🗺️ *رابط الموقع (GPS):* ${mapLink}\n`;
    }

    message += `\n🛒 *التفاصيل:*\n`;
    savedCart.forEach(item => {
        message += `- ${item.quantity} ${item.name} (${item.price * item.quantity} ج)\n`;
    });

    message += `\n💵 *طريقة الدفع:* ${paymentMethod}\n`;
    message += `🚚 *التوصيل:* السعر يحدد حسب المكان\n`;
    message += `💰 *إجمالي الأكل:* ${total} جنيه (غير شامل التوصيل)`;

    let encodedMessage = encodeURIComponent(message);
    let whatsappNumber = "201022197941";
    let whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
}