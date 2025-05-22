document.addEventListener('DOMContentLoaded', () => {
	const counterElement = document.getElementById('visit-count')
	let count = localStorage.getItem('visitCount')

	if (count === null) {
		count = 1
	} else {
		count = parseInt(count, 10) + 1
	}

	localStorage.setItem('visitCount', count)
	if (counterElement) {
		counterElement.textContent = count
	}

	// Cart System
	updateCartCounter() // Update counter on every page load
})

function getCartItems() {
	return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCartItems(cartItems) {
	localStorage.setItem('cart', JSON.stringify(cartItems))
	updateCartCounter()
}

function addToCart(productId, productName, productPrice) {
	const cartItems = getCartItems()
	const existingItem = cartItems.find(item => item.id === productId)

	if (existingItem) {
		existingItem.quantity += 1
	} else {
		cartItems.push({
			id: productId,
			name: productName,
			price: productPrice,
			quantity: 1,
		})
	}
	saveCartItems(cartItems)
	alert(`${productName} добавлен в корзину!`) // Optional: user feedback
}

function updateCartCounter() {
	const cartItems = getCartItems()
	const cartCountElement = document.getElementById('cart-count')
	if (cartCountElement) {
		const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
		cartCountElement.textContent = totalItems
	}
}

function removeFromCart(productId) {
	let cartItems = getCartItems()
	cartItems = cartItems.filter(item => item.id !== productId)
	saveCartItems(cartItems)
	displayCartItems() // Re-render cart page
}

function updateQuantity(productId, newQuantity) {
	let cartItems = getCartItems()
	const item = cartItems.find(i => i.id === productId)
	if (item) {
		item.quantity = newQuantity
		if (item.quantity <= 0) {
			cartItems = cartItems.filter(i => i.id !== productId) // Remove if quantity is 0 or less
		}
	}
	saveCartItems(cartItems)
	displayCartItems() // Re-render cart page
}

function clearCart() {
	if (confirm('Вы уверены, что хотите очистить корзину?')) {
		localStorage.removeItem('cart')
		updateCartCounter()
		displayCartItems() // Re-render cart page
	}
}

function displayCartItems() {
	const cartItemsContainer = document.getElementById('cart-items-container')
	const cartTotalPriceElement = document.getElementById('cart-total-price')
	const emptyCartMessage = document.getElementById('empty-cart-message')
	const cartSummary = document.getElementById('cart-summary')

	if (!cartItemsContainer) return // Only run on cart.html

	const cartItems = getCartItems()
	cartItemsContainer.innerHTML = '' // Clear previous items

	if (cartItems.length === 0) {
		emptyCartMessage.style.display = 'block'
		cartSummary.style.display = 'none'
		cartItemsContainer.innerHTML = '<p>Ваша корзина пуста.</p>'
	} else {
		emptyCartMessage.style.display = 'none'
		cartSummary.style.display = 'block'
		const table = document.createElement('table')
		table.className = 'cart-table'
		table.innerHTML = `
      <thead>
        <tr>
          <th>Товар</th>
          <th>Цена</th>
          <th>Количество</th>
          <th>Сумма</th>
          <th>Удалить</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `
		const tbody = table.querySelector('tbody')
		let totalPrice = 0

		cartItems.forEach(item => {
			const itemTotalPrice = item.price * item.quantity
			totalPrice += itemTotalPrice
			const row = tbody.insertRow()
			row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price} руб.</td>
        <td>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}">
        </td>
        <td>${itemTotalPrice} руб.</td>
        <td><button class="remove-from-cart-btn" data-product-id="${item.id}">Удалить</button></td>
      `
		})

		cartItemsContainer.appendChild(table)
		cartTotalPriceElement.textContent = totalPrice
	}
	updateCartCounter() // Ensure counter is also updated
}

// Catalog Data and Functions
if (document.getElementById('product-grid')) {
	const products = [
		{
			id: 1,
			name: 'Полицейский участок',
			series: 'City',
			price: 5999,
			image: 'polise.png',
			description:
				'Создайте свой полицейский участок с этим увлекательным набором! В набор входят полицейский участок, полицейская машина, вертолет и 5 минифигурок. Отлично подходит для детей от 6 лет.',
			age: '6+',
			pieces: 743
		},
		{
			id: 2,
			name: 'Пожарная станция',
			series: 'City',
			price: 4999,
			image: 'fire.png',
			description:
				'Спасайте город от пожаров с этой пожарной станцией! В набор входят пожарная машина, вертолет, станция и 4 минифигурки пожарных. Рекомендуется для детей от 6 лет.',
			age: '6+',
			pieces: 509
		},
		{
			id: 3,
			name: 'Грузовой поезд',
			series: 'City',
			price: 12999,
			image: 'Atrain.png',
			description:
				'Управляйте грузовым поездом с дистанционным управлением! В набор входят локомотив, вагоны, железнодорожная станция и 3 минифигурки. Для детей от 7 лет.',
			age: '7+',
			pieces: 1226
		},
		{
			id: 4,
			name: 'Экскаватор',
			series: 'Technic',
			price: 2499,
			image: 'exkavator.png',
			description:
				'Соберите реалистичный экскаватор с подвижными элементами! В набор входят детали для сборки экскаватора с подвижной стрелой и ковшом. Для детей от 8 лет.',
			age: '8+',
			pieces: 569
		},
		{
			id: 5,
			name: 'Гоночный автомобиль',
			series: 'Technic',
			price: 3499,
			image: 'guntruk.png',
			description:
				'Создайте крутой гоночный автомобиль с подвижными элементами! В набор входят детали для сборки спортивного автомобиля с подвеской и рулевым управлением. Для детей от 9 лет.',
			age: '9+',
			pieces: 647
		},
		{
			id: 6,
			name: 'Кран',
			series: 'Technic',
			price: 8999,
			image: 'kran.png',
			description:
				'Соберите мощный строительный кран с множеством функций! В набор входят детали для сборки крана с подвижной стрелой, лебедкой и кабиной. Для детей от 10 лет.',
			age: '10+',
			pieces: 1492
		},
		{
			id: 7,
			name: 'Сокол Тысячелетия',
			series: 'Star Wars',
			price: 15999,
			image: 'sokol.png',
			description:
				'Соберите легендарный корабль Хана Соло! В набор входят детали для сборки Сокола Тысячелетия с открывающимся люком, пушками и 7 минифигурками. Для детей от 9 лет.',
			age: '9+',
			pieces: 1468
		},
		{
			id: 8,
			name: 'Истребитель X-Wing',
			series: 'Star Wars',
			price: 7999,
			image: 'x-wing.png',
			description:
				'Создайте истребитель X-Wing из Звездных войн! В набор входят детали для сборки истребителя с подвижными крыльями и 4 минифигурками. Для детей от 8 лет.',
			age: '8+',
			pieces: 474
		},
		{
			id: 9,
			name: 'Больница Хартлейк Сити',
			series: 'Friends',
			price: 4599,
			image: 'hospital.png',
			description:
				'Создайте современную больницу с множеством деталей! В набор входят здание больницы, машина скорой помощи и 4 минифигурки. Для детей от 6 лет.',
			age: '6+',
			pieces: 379
		},
		{
			id: 10,
			name: 'Дом Стефани',
			series: 'Friends',
			price: 3299,
			image: 'hous.png',
			description:
				'Постройте уютный дом для Стефани! В набор входят детали для сборки двухэтажного дома с мебелью и 2 минифигурками. Для детей от 6 лет.',
			age: '6+',
			pieces: 233
		},
	]

	const productGrid = document.getElementById('product-grid')
	const sortPriceSelect = document.getElementById('sort-price')
	const filterSeriesSelect = document.getElementById('filter-series')

	function displayProducts(productsToDisplay) {
		productGrid.innerHTML = '' // Clear existing products
		productsToDisplay.forEach(product => {
			const productCard = document.createElement('div')
			productCard.className = 'product-card'
			productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.png'; this.alt='Изображение не найдено';">
        <h3>${product.name}</h3>
        <p class="series">Серия: ${product.series}</p>
        <p class="price">Цена: ${product.price} руб.</p>
        <div class="product-description">
            <p>${product.description}</p>
        </div>
        <button class="add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">В корзину</button>
      `
			productGrid.appendChild(productCard)

			// Добавляем обработчик клика на всю карточку товара
			productCard.addEventListener('click', (event) => {
				// Проверяем, что клик не был по кнопке "В корзину"
				if (!event.target.classList.contains('add-to-cart-btn')) {
					showProductModal(product)
				}
			})
		})
	}

	function populateSeriesFilter() {
		const series = [...new Set(products.map(p => p.series))] // Get unique series
		series.sort()
		series.forEach(s => {
			const option = document.createElement('option')
			option.value = s
			option.textContent = s
			filterSeriesSelect.appendChild(option)
		})
	}

	function applyFiltersAndSort() {
		let filteredProducts = [...products]
		const series = filterSeriesSelect.value
		const sortOrder = sortPriceSelect.value

		// Filter by series
		if (series !== 'all') {
			filteredProducts = filteredProducts.filter(p => p.series === series)
		}

		// Sort by price
		if (sortOrder === 'asc') {
			filteredProducts.sort((a, b) => a.price - b.price)
		} else if (sortOrder === 'desc') {
			filteredProducts.sort((a, b) => b.price - a.price)
		}
		// Add more sorting options if needed, e.g., by name

		displayProducts(filteredProducts)
	}

	// Initial setup
	populateSeriesFilter()
	displayProducts(products)

	// Event Listeners
	sortPriceSelect.addEventListener('change', applyFiltersAndSort)
	filterSeriesSelect.addEventListener('change', applyFiltersAndSort)

	// Event listener for Add to Cart buttons (delegated from productGrid)
	productGrid.addEventListener('click', function (event) {
		if (event.target.classList.contains('add-to-cart-btn')) {
			const productId = parseInt(event.target.dataset.productId)
			const productName = event.target.dataset.productName
			const productPrice = parseFloat(event.target.dataset.productPrice)
			addToCart(productId, productName, productPrice)
		}
	})
}

// Event listeners for Cart Page (if on cart.html)
document.addEventListener('DOMContentLoaded', () => {
	if (document.getElementById('cart-items-container')) {
		displayCartItems()

		const cartItemsContainer = document.getElementById('cart-items-container')
		cartItemsContainer.addEventListener('click', event => {
			if (event.target.classList.contains('remove-from-cart-btn')) {
				const productId = parseInt(event.target.dataset.productId)
				removeFromCart(productId)
			}
		})

		cartItemsContainer.addEventListener('change', event => {
			if (event.target.classList.contains('quantity-input')) {
				const productId = parseInt(event.target.dataset.productId)
				const newQuantity = parseInt(event.target.value)
				if (newQuantity > 0) {
					updateQuantity(productId, newQuantity)
				} else {
					// Restore old value or remove item if desired
					event.target.value =
						getCartItems().find(i => i.id === productId)?.quantity || 1
				}
			}
		})

		const clearCartButton = document.getElementById('clear-cart-btn')
		if (clearCartButton) {
			clearCartButton.addEventListener('click', clearCart)
		}

		const checkoutButton = document.getElementById('checkout-btn')
		if (checkoutButton) {
			checkoutButton.addEventListener('click', () => {
				alert('Функционал оформления заказа пока не реализован.')
			})
		}
	}
})

// Accessibility Mode
document.addEventListener('DOMContentLoaded', () => {
	console.log('Accessibility mode script loaded')
	const accessibilityToggleBtn = document.getElementById(
		'accessibility-toggle-btn'
	)
	console.log('Accessibility button found:', accessibilityToggleBtn)
	const body = document.body
	const ACCESSIBILITY_MODE_KEY = 'accessibilityModeEnabled'

	const applyAccessibilityMode = isEnabled => {
		console.log('Applying accessibility mode:', isEnabled)
		if (isEnabled) {
			body.classList.add('accessibility-mode')
			if (accessibilityToggleBtn) {
				accessibilityToggleBtn.textContent = 'Обычная версия'
			}
		} else {
			body.classList.remove('accessibility-mode')
			if (accessibilityToggleBtn) {
				accessibilityToggleBtn.textContent = 'Версия для слабовидящих'
			}
		}
	}

	// Check localStorage on page load
	let isAccessibilityModeEnabled =
		localStorage.getItem(ACCESSIBILITY_MODE_KEY) === 'true'
	console.log('Initial accessibility mode state:', isAccessibilityModeEnabled)
	applyAccessibilityMode(isAccessibilityModeEnabled)

	// Toggle on button click
	if (accessibilityToggleBtn) {
		accessibilityToggleBtn.addEventListener('click', () => {
			console.log('Accessibility button clicked')
			isAccessibilityModeEnabled = !isAccessibilityModeEnabled
			localStorage.setItem(ACCESSIBILITY_MODE_KEY, isAccessibilityModeEnabled)
			console.log('New accessibility mode state:', isAccessibilityModeEnabled)
			applyAccessibilityMode(isAccessibilityModeEnabled)
		})
	}
})

// Reviews functionality
function initializeReviews() {
	const reviewForm = document.getElementById('review-form')
	const reviewsList = document.getElementById('reviews-list')

	if (reviewForm) {
		reviewForm.addEventListener('submit', handleReviewSubmit)
	}

	if (reviewsList) {
		displayReviews()
	}
}

function handleReviewSubmit(event) {
	event.preventDefault()

	const name = document.getElementById('review-name').value
	const rating = document.getElementById('review-rating').value
	const text = document.getElementById('review-text').value

	const review = {
		id: Date.now(), // Add unique ID for each review
		name,
		rating,
		text,
		date: new Date().toISOString(),
		replies: [] // Array to store replies
	}

	// Get existing reviews
	let reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
	reviews.unshift(review) // Add new review at the beginning
	localStorage.setItem('reviews', JSON.stringify(reviews))

	// Clear form
	event.target.reset()

	// Update display
	displayReviews()
}

function handleReplySubmit(event, reviewId) {
	event.preventDefault()
	const replyText = event.target.querySelector('.reply-text').value
	
	const reply = {
		id: Date.now(),
		name: "Администратор", // Always use "Администратор" as the name
		text: replyText,
		date: new Date().toISOString()
	}

	let reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
	const review = reviews.find(r => r.id === reviewId)
	if (review) {
		if (!review.replies) {
			review.replies = []
		}
		review.replies.push(reply)
		localStorage.setItem('reviews', JSON.stringify(reviews))
		displayReviews()
	}

	// Hide the reply form after submission
	const replyForm = event.target
	replyForm.style.display = 'none'
	replyForm.reset()
}

function toggleReplyForm(reviewId) {
	const replyForm = document.getElementById(`reply-form-${reviewId}`)
	if (replyForm.style.display === 'none' || !replyForm.style.display) {
		replyForm.style.display = 'block'
	} else {
		replyForm.style.display = 'none'
	}
}

function displayReviews() {
	const reviewsList = document.getElementById('reviews-list')
	if (!reviewsList) return

	const reviews = JSON.parse(localStorage.getItem('reviews') || '[]')

	if (reviews.length === 0) {
		reviewsList.innerHTML = '<p class="no-reviews">Пока нет отзывов. Будьте первым!</p>'
		return
	}

	reviewsList.innerHTML = reviews
		.map(review => `
			<div class="review-item">
				<div class="review-header">
					<div>
						<span class="review-author">${review.name}</span>
						<span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
					</div>
					<span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
				</div>
				<div class="review-text">${review.text}</div>
				
				<!-- Replies section -->
				<div class="review-replies">
					${(review.replies || []).map(reply => `
						<div class="reply-item">
							<div class="reply-header">
								<span class="reply-author">${reply.name}</span>
								<span class="reply-date">${new Date(reply.date).toLocaleDateString()}</span>
							</div>
							<div class="reply-text">${reply.text}</div>
						</div>
					`).join('')}
				</div>

				<!-- Reply form -->
				<button onclick="toggleReplyForm(${review.id})" class="reply-button">Ответить</button>
				<form id="reply-form-${review.id}" class="reply-form" style="display: none;" onsubmit="handleReplySubmit(event, ${review.id})">
					<div class="form-group">
						<textarea class="reply-text" placeholder="Ваш ответ" required></textarea>
					</div>
					<button type="submit" class="submit-reply-btn">Отправить ответ</button>
				</form>
			</div>
		`)
		.join('')
}

// Initialize reviews when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	initializeReviews()
	// ... existing initialization code ...
})

// Clock functionality
function updateClock() {
	const now = new Date()
	const timeString = now.toLocaleTimeString('ru-RU')
	const dateString = now.toLocaleDateString('ru-RU')
	const clockElement = document.querySelector('.clock')
	if (clockElement) {
		clockElement.textContent = `${dateString} ${timeString}`
	}
}

// Initialize clock
function initializeClock() {
	const sidebar = document.querySelector('.sidebar')
	if (sidebar) {
		const clockContainer = document.createElement('div')
		clockContainer.className = 'clock-container'
		clockContainer.innerHTML = '<div class="clock"></div>'
		sidebar.insertBefore(clockContainer, sidebar.firstChild)
		updateClock()
		setInterval(updateClock, 1000)
	}
}

// Theme toggle functionality
function initializeThemeToggle() {
	const header = document.querySelector('.header')
	if (header) {
		const themeToggleBtn = document.createElement('button')
		themeToggleBtn.className = 'theme-toggle-btn'
		themeToggleBtn.textContent = 'Темная тема'
		header.appendChild(themeToggleBtn)

		// Check saved theme preference
		const isDarkTheme = localStorage.getItem('darkTheme') === 'true'
		if (isDarkTheme) {
			document.body.classList.add('dark-theme')
			themeToggleBtn.textContent = 'Светлая тема'
		}

		themeToggleBtn.addEventListener('click', () => {
			const isDark = document.body.classList.toggle('dark-theme')
			themeToggleBtn.textContent = isDark ? 'Светлая тема' : 'Темная тема'
			localStorage.setItem('darkTheme', isDark)
		})
	}
}

// Initialize new features when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	initializeClock()
	initializeThemeToggle()
	// ... existing initialization code ...
})

function showProductModal(product) {
	const modal = document.getElementById('product-modal')
	const modalImage = modal.querySelector('.modal-image')
	const modalTitle = modal.querySelector('.modal-title')
	const modalSeries = modal.querySelector('.modal-series')
	const modalPrice = modal.querySelector('.modal-price')
	const modalDescription = modal.querySelector('.modal-description')
	const modalAge = modal.querySelector('.modal-age span')
	const modalPieces = modal.querySelector('.modal-pieces span')
	const modalAddToCartBtn = modal.querySelector('.add-to-cart-btn')

	modalImage.src = product.image
	modalImage.alt = product.name
	modalTitle.textContent = product.name
	modalSeries.textContent = `Серия: ${product.series}`
	modalPrice.textContent = `Цена: ${product.price} руб.`
	modalDescription.textContent = product.description
	modalAge.textContent = product.age
	modalPieces.textContent = product.pieces
	
	modalAddToCartBtn.textContent = 'Добавить в корзину'
	modalAddToCartBtn.onclick = () => {
		addToCart(product.id, product.name, product.price)
		modal.style.display = 'none'
	}

	modal.style.display = 'block'
}

// Закрытие модального окна
document.addEventListener('DOMContentLoaded', () => {
	const modal = document.getElementById('product-modal')
	const closeBtn = document.querySelector('.close-modal')

	if (closeBtn && modal) {
		closeBtn.onclick = () => {
			modal.style.display = 'none'
		}

		window.onclick = (event) => {
			if (event.target === modal) {
				modal.style.display = 'none'
			}
		}
	}
})

// Функционал кнопки "Наверх"
document.addEventListener('DOMContentLoaded', () => {
	const scrollToTopBtn = document.getElementById('scroll-to-top');
	
	// Плавная прокрутка наверх при клике
	scrollToTopBtn.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});
});

// Информация о магазинах
const storeInfo = {
	muti: {
		title: 'LEGO Store Мытищи',
		floor: '3 этаж',
		phone: '+7 (495) 777-88-99',
		email: 'mytischi@legostore.ru',
		image: 'muti.png'
	},
	serg: {
		title: 'LEGO Store Сергиев Посад',
		floor: '2 этаж',
		phone: '+7 (495) 555-66-77',
		email: 'sergiev@legostore.ru',
		image: 'serg.png'
	}
};

// Функция для отображения модального окна
function showStoreModal(storeId) {
	const modal = document.getElementById('store-modal');
	const store = storeInfo[storeId];
	
	if (!store) return;

	// Заполняем информацию о магазине
	modal.querySelector('.store-title').textContent = store.title;
	modal.querySelector('.store-floor').textContent = `Этаж: ${store.floor}`;
	modal.querySelector('.store-phone').textContent = store.phone;
	modal.querySelector('.store-email').textContent = store.email;
	modal.querySelector('.store-image').src = store.image;
	modal.querySelector('.store-image').alt = store.title;

	// Показываем модальное окно
	modal.style.display = 'block';

	// Закрытие по клику на крестик
	const closeBtn = modal.querySelector('.close-modal');
	closeBtn.onclick = function() {
		modal.style.display = 'none';
	};

	// Закрытие по клику вне модального окна
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
}

// Функция для создания визуальных маркеров
function createStoreMarkers() {
	const mapContainer = document.querySelector('.map-container');
	const storeMap = document.querySelector('.store-map');
	
	// Создаем маркеры для каждого магазина
	const stores = [
		{ id: 'muti', x: 171, y: 107, name: 'Мытищи' },
		{ id: 'serg', x: 187, y: 76, name: 'Сергиев Посад' }
	];

	stores.forEach(store => {
		const marker = document.createElement('div');
		marker.className = 'store-marker';
		marker.style.left = `${store.x}px`;
		marker.style.top = `${store.y}px`;
		marker.setAttribute('data-store', store.id);
		marker.title = store.name;
		
		marker.addEventListener('click', () => {
			showStoreModal(store.id);
		});
		
		mapContainer.appendChild(marker);
	});
}

// Вызываем функцию после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
	createStoreMarkers();
});
