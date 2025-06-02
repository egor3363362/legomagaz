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

	// Load products state
	loadProductsState()

	// Добавляем валидацию для поля телефона
	const phoneInput = document.getElementById('customer-phone')
	if (phoneInput) {
		phoneInput.addEventListener('input', function(e) {
			// Удаляем все нецифровые символы
			this.value = this.value.replace(/[^\d]/g, '')
		})
	}
})

function getCartItems() {
	return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCartItems(cartItems) {
	localStorage.setItem('cart', JSON.stringify(cartItems))
	updateCartCounter()
}

// Глобальный массив продуктов
const products = [
	{
		id: 1,
		name: 'Полицейский участок',
		series: 'City',
		price: 5999,
		image: 'polise.png',
		description: 'Создайте свой полицейский участок с этим увлекательным набором! В набор входят полицейский участок, полицейская машина, вертолет и 5 минифигурок. Отлично подходит для детей от 6 лет.',
		age: '6+',
		pieces: 743,
		quantity: 8
	},
	{
		id: 2,
		name: 'Пожарная станция',
		series: 'City',
		price: 4999,
		image: 'fire.png',
		description: 'Спасайте город от пожаров с этой пожарной станцией! В набор входят пожарная машина, вертолет, станция и 4 минифигурки пожарных. Рекомендуется для детей от 6 лет.',
		age: '6+',
		pieces: 509,
		quantity: 5
	},
	{
		id: 3,
		name: 'Грузовой поезд',
		series: 'City',
		price: 12999,
		image: 'Atrain.png',
		description: 'Управляйте грузовым поездом с дистанционным управлением! В набор входят локомотив, вагоны, железнодорожная станция и 3 минифигурки. Для детей от 7 лет.',
		age: '7+',
		pieces: 1226,
		quantity: 3
	},
	{
		id: 4,
		name: 'Экскаватор',
		series: 'Technic',
		price: 2499,
		image: 'exkavator.png',
		description: 'Соберите реалистичный экскаватор с подвижными элементами! В набор входят детали для сборки экскаватора с подвижной стрелой и ковшом. Для детей от 8 лет.',
		age: '8+',
		pieces: 569,
		quantity: 12
	},
	{
		id: 5,
		name: 'Гоночный автомобиль',
		series: 'Technic',
		price: 3499,
		image: 'guntruk.png',
		description: 'Создайте крутой гоночный автомобиль с подвижными элементами! В набор входят детали для сборки спортивного автомобиля с подвеской и рулевым управлением. Для детей от 9 лет.',
		age: '9+',
		pieces: 647,
		quantity: 4
	},
	{
		id: 6,
		name: 'Кран',
		series: 'Technic',
		price: 8999,
		image: 'kran.png',
		description: 'Соберите мощный строительный кран с множеством функций! В набор входят детали для сборки крана с подвижной стрелой, лебедкой и кабиной. Для детей от 10 лет.',
		age: '10+',
		pieces: 1492,
		quantity: 1
	},
	{
		id: 7,
		name: 'Сокол Тысячелетия',
		series: 'Star Wars',
		price: 11199,
		originalPrice: 15999,
		image: 'sokol.png',
		description: 'Соберите легендарный корабль Хана Соло! В набор входят детали для сборки Сокола Тысячелетия с открывающимся люком, пушками и 7 минифигурками. Для детей от 9 лет.',
		age: '9+',
		pieces: 1468,
		quantity: 6
	},
	{
		id: 8,
		name: 'Истребитель X-Wing',
		series: 'Star Wars',
		price: 7999,
		image: 'x-wing.png',
		description: 'Создайте истребитель X-Wing из Звездных войн! В набор входят детали для сборки истребителя с подвижными крыльями и 4 минифигурками. Для детей от 8 лет.',
		age: '8+',
		pieces: 474,
		quantity: 12
	},
	{
		id: 9,
		name: 'Больница Хартлейк Сити',
		series: 'Friends',
		price: 4599,
		image: 'hospital.png',
		description: 'Создайте современную больницу с множеством деталей! В набор входят здание больницы, машина скорой помощи и 4 минифигурки. Для детей от 6 лет.',
		age: '6+',
		pieces: 379,
		quantity: 7
	},
	{
		id: 10,
		name: 'Дом Стефани',
		series: 'Friends',
		price: 3299,
		image: 'hous.png',
		description: 'Постройте уютный дом для Стефани! В набор входят детали для сборки двухэтажного дома с мебелью и 2 минифигурками. Для детей от 6 лет.',
		age: '6+',
		pieces: 233,
		quantity: 2
	},
]

// Функция для сохранения состояния продуктов
function saveProductsState() {
	localStorage.setItem('productsState', JSON.stringify(products))
}

// Функция для загрузки состояния продуктов
function loadProductsState() {
	const savedState = localStorage.getItem('productsState')
	if (savedState) {
		const savedProducts = JSON.parse(savedState)
		// Обновляем количество в массиве products
		products.forEach((product, index) => {
			if (savedProducts[index]) {
				product.quantity = savedProducts[index].quantity
			}
		})
	}
}

// Функция добавления в корзину
function addToCart(productId, productName, productPrice) {
	const cartItems = getCartItems()
	
	// Найти продукт в каталоге
	const product = products.find(p => p.id === productId)
	if (!product) {
		alert('Товар не найден.')
		return
	}

	// Проверяем наличие товара на складе
	if (product.quantity === 0) {
		alert('Извините, товар закончился на складе. Склады пополнятся через 2 дня.')
		return
	}

	// Добавляем товар в корзину
	const existingItem = cartItems.find(item => item.id === productId)
	if (existingItem) {
		existingItem.quantity += 1
	} else {
		cartItems.push({
			id: productId,
			name: productName,
			price: productPrice,
			quantity: 1
		})
	}

	// Уменьшаем количество на складе
	product.quantity -= 1
	
	// Сохраняем изменения
	saveCartItems(cartItems)
	saveProductsState() // Сохраняем состояние продуктов
	
	// Обновляем отображение в каталоге
	updateProductDisplay(product)
	
	alert(`${productName} добавлен в корзину!`)
}

// Новая функция для обновления отображения товара
function updateProductDisplay(product) {
	const productCards = document.querySelectorAll('.product-card')
	productCards.forEach(card => {
		const cardProductId = parseInt(card.querySelector('.add-to-cart-btn').dataset.productId)
		if (cardProductId === product.id) {
			// Обновляем статус наличия
			const stockStatus = card.querySelector('.in-stock, .out-of-stock')
			if (stockStatus) {
				if (product.quantity > 0) {
					stockStatus.className = 'in-stock'
					stockStatus.textContent = `В наличии: ${product.quantity} шт.`
				} else {
					stockStatus.className = 'out-of-stock'
					stockStatus.textContent = 'Нет в наличии'
				}
			}

			// Обновляем кнопку
			const addToCartBtn = card.querySelector('.add-to-cart-btn')
			if (product.quantity === 0) {
				addToCartBtn.disabled = true
				addToCartBtn.textContent = 'Нет в наличии'
			}
		}
	})

	// Обновляем модальное окно, если оно открыто
	const modal = document.getElementById('product-modal')
	if (modal && modal.style.display === 'block') {
		const modalStock = modal.querySelector('.modal-stock')
		const modalAddToCartBtn = modal.querySelector('.add-to-cart-btn')
		
		if (modalStock) {
			if (product.quantity > 0) {
				modalStock.className = 'modal-stock in-stock'
				modalStock.textContent = `В наличии: ${product.quantity} шт.`
			} else {
				modalStock.className = 'modal-stock out-of-stock'
				modalStock.textContent = 'Нет в наличии'
			}
		}
		
		if (modalAddToCartBtn) {
			modalAddToCartBtn.disabled = product.quantity === 0
			modalAddToCartBtn.textContent = product.quantity === 0 ? 'Нет в наличии' : 'Добавить в корзину'
		}
	}
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
	const item = cartItems.find(item => item.id === productId)
	if (item) {
		// Возвращаем товар на склад
		const product = products.find(p => p.id === productId)
		if (product) {
			product.quantity += item.quantity
			saveProductsState() // Сохраняем обновленное состояние продуктов
		}
	}
	cartItems = cartItems.filter(item => item.id !== productId)
	saveCartItems(cartItems)
	displayCartItems() // Обновляем страницу корзины
}

function clearCart() {
	if (confirm('Вы уверены, что хотите очистить корзину?')) {
		const cartItems = getCartItems()
		// Возвращаем все товары на склад
		cartItems.forEach(item => {
			const product = products.find(p => p.id === item.id)
			if (product) {
				product.quantity += item.quantity
			}
		})
		saveProductsState() // Сохраняем обновленное состояние продуктов
		localStorage.removeItem('cart')
		updateCartCounter()
		displayCartItems()
	}
}

function displayCartItems() {
	const cartItems = getCartItems();
	const container = document.getElementById('cart-items-container');
	const cartSummary = document.getElementById('cart-summary');
	const emptyCartMessage = document.getElementById('empty-cart-message');

	if (cartItems.length === 0) {
		if (container) container.style.display = 'none';
		if (cartSummary) cartSummary.style.display = 'none';
		if (emptyCartMessage) emptyCartMessage.style.display = 'block';
		return;
	}

	if (container) {
		container.style.display = 'block';
		container.innerHTML = `
			<table class="cart-table">
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
					${cartItems.map(item => {
						const product = products.find(p => p.id === item.id);
						const maxQuantity = product ? product.quantity + item.quantity : 10;
						return `
							<tr>
								<td>${item.name}</td>
								<td>${item.price} руб.</td>
								<td>
									<div class="quantity-controls">
										<button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
										<input type="number" value="${item.quantity}" min="1" max="${maxQuantity}" 
											onchange="updateQuantity(${item.id}, this.value)"
											class="quantity-input">
										<button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
									</div>
								</td>
								<td>${item.price * item.quantity} руб.</td>
								<td>
									<button class="remove-from-cart-btn" onclick="removeFromCart(${item.id})">Удалить</button>
								</td>
							</tr>
						`;
					}).join('')}
				</tbody>
			</table>
		`;
	}

	if (cartSummary) cartSummary.style.display = 'block';
	if (emptyCartMessage) emptyCartMessage.style.display = 'none';

	updateCartTotal();
	updateCartCounter();
}

function updateQuantity(productId, newQuantity) {
	const cartItems = getCartItems();
	const item = cartItems.find(item => item.id === productId);
	if (!item) return;

	const product = products.find(p => p.id === productId);
	if (!product) return;

	// Проверяем доступное количество на складе
	const maxAvailable = product.quantity + item.quantity;
	newQuantity = Math.max(1, Math.min(maxAvailable, parseInt(newQuantity)));

	// Вычисляем разницу для обновления количества на складе
	const quantityDiff = item.quantity - newQuantity;
	product.quantity += quantityDiff;

	// Обновляем количество в корзине
	item.quantity = newQuantity;

	saveCartItems(cartItems);
	saveProductsState();
	displayCartItems();
	updateCartTotal();
}

function updateCartTotal() {
	const cartItems = getCartItems();
	const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
	const totalElement = document.getElementById('cart-total-price');
	if (totalElement) {
		totalElement.textContent = total;
	}
}

// Catalog Data and Functions
if (document.getElementById('product-grid')) {
	const productGrid = document.getElementById('product-grid')
	const sortPriceSelect = document.getElementById('sort-price')
	const filterSeriesSelect = document.getElementById('filter-series')

	function displayProducts(productsToDisplay) {
		productGrid.innerHTML = '' // Clear existing products
		productsToDisplay.forEach(product => {
			const productCard = document.createElement('div')
			productCard.className = 'product-card'
			
			const stockStatus = product.quantity <= 0 
				? '<p class="out-of-stock">Нет в наличии</p>' 
				: `<p class="in-stock">В наличии: ${product.quantity} шт.</p>`
			
			const priceDisplay = product.originalPrice 
				? `<p class="price"><s>${product.originalPrice} руб.</s> <span class="discount-price">${product.price} руб.</span></p>`
				: `<p class="price">Цена: ${product.price} руб.</p>`

			productCard.innerHTML = `
				<img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.png'; this.alt='Изображение не найдено';">
				<h3>${product.name}</h3>
				<p class="series">Серия: ${product.series}</p>
				${priceDisplay}
				${stockStatus}
				<div class="product-description">
					<p>${product.description}</p>
				</div>
				<button class="add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" ${product.quantity <= 0 ? 'disabled' : ''}>
					${product.quantity <= 0 ? 'Нет в наличии' : 'В корзину'}
				</button>
			`
			productGrid.appendChild(productCard)

			// Add click handler for product card
			productCard.addEventListener('click', (event) => {
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

		const clearCartButton = document.getElementById('clear-cart-btn')
		if (clearCartButton) {
			clearCartButton.addEventListener('click', clearCart)
		}

		const checkoutButton = document.getElementById('checkout-btn')
		if (checkoutButton) {
			checkoutButton.addEventListener('click', () => {
				const cartItems = getCartItems()
				if (cartItems.length === 0) {
					alert('Ваша корзина пуста')
					return
				}
				openCheckoutModal()
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
	const modalStock = modal.querySelector('.modal-stock')

	modalImage.src = product.image
	modalImage.alt = product.name
	modalTitle.textContent = product.name
	modalSeries.textContent = `Серия: ${product.series}`
	
	if (product.originalPrice) {
		modalPrice.innerHTML = `<s>${product.originalPrice} руб.</s> <span class="discount-price">${product.price} руб.</span>`
	} else {
		modalPrice.textContent = `Цена: ${product.price} руб.`
	}
	
	modalDescription.textContent = product.description
	modalAge.textContent = product.age
	modalPieces.textContent = product.pieces
	
	if (modalStock) {
		modalStock.textContent = product.quantity > 0 
			? `В наличии: ${product.quantity} шт.` 
			: 'Нет в наличии'
		modalStock.className = `modal-stock ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`
	}
	
	modalAddToCartBtn.disabled = product.quantity <= 0
	modalAddToCartBtn.textContent = product.quantity <= 0 ? 'Нет в наличии' : 'Добавить в корзину'
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

// Функция для открытия модального окна оформления заказа
function openCheckoutModal() {
	const modal = document.getElementById('checkout-modal')
	if (!modal) return

	// Отображаем товары в заказе
	displayOrderItems()
	
	// Обновляем итоговую стоимость
	updateOrderTotal()
	
	modal.style.display = 'block'

	// Добавляем обработчик формы
	const form = document.getElementById('checkout-form')
	if (form) {
		form.onsubmit = handleCheckoutSubmit
	}

	// Обработчик изменения способа доставки
	const deliverySelect = document.getElementById('delivery-method')
	if (deliverySelect) {
		deliverySelect.onchange = updateOrderTotal
	}
}

// Функция отображения товаров в форме заказа
function displayOrderItems() {
	const orderItems = document.getElementById('order-items')
	if (!orderItems) return

	const cartItems = getCartItems()
	let html = '<ul class="order-items-list">'
	cartItems.forEach(item => {
		html += `
			<li>
				${item.name} x ${item.quantity} шт. = ${item.price * item.quantity} руб.
			</li>
		`
	})
	html += '</ul>'
	orderItems.innerHTML = html
}

// Функция обновления итоговой стоимости
function updateOrderTotal() {
	const cartItems = getCartItems()
	const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
	const deliveryMethod = document.getElementById('delivery-method').value
	
	let deliveryCost = 0
	switch (deliveryMethod) {
		case 'courier':
			deliveryCost = 300
			break
		case 'post':
			deliveryCost = 400
			break
		case 'pickup':
			deliveryCost = 200
			break
	}
	
	const total = subtotal + deliveryCost
	
	document.getElementById('order-subtotal').textContent = subtotal
	document.getElementById('delivery-cost').textContent = deliveryCost
	document.getElementById('order-total').textContent = total
}

// Обработчик отправки формы заказа
function handleCheckoutSubmit(event) {
	event.preventDefault()
	
	const form = event.target
	const formData = {
		name: form.querySelector('#customer-name').value,
		phone: form.querySelector('#customer-phone').value,
		email: form.querySelector('#customer-email').value,
		deliveryMethod: form.querySelector('#delivery-method').value,
		address: form.querySelector('#delivery-address').value,
		paymentMethod: form.querySelector('#payment-method').value,
		comment: form.querySelector('#comment').value,
		items: getCartItems(),
		total: parseInt(document.getElementById('order-total').textContent)
	}
	
	// Проверяем заполнение обязательных полей
	if (!formData.name || !formData.phone || !formData.email || !formData.deliveryMethod || 
		!formData.address || !formData.paymentMethod) {
		alert('Пожалуйста, заполните все обязательные поля')
		return
	}
	
	// Показываем сообщение об успешном оформлении
	alert(`Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время для подтверждения заказа.`)
	
	// Очищаем корзину
	clearCart()
	
	// Закрываем модальное окно
	document.getElementById('checkout-modal').style.display = 'none'
	
	// Перенаправляем на главную страницу
	window.location.href = 'index.html'
}

// Добавляем обработчик для кнопки оформления заказа
document.addEventListener('DOMContentLoaded', () => {
	const checkoutBtn = document.getElementById('checkout-btn')
	if (checkoutBtn) {
		checkoutBtn.onclick = () => {
			const cartItems = getCartItems()
			if (cartItems.length === 0) {
				alert('Ваша корзина пуста')
				return
			}
			openCheckoutModal()
		}
	}

	// Добавляем валидацию для поля телефона
	const phoneInput = document.getElementById('customer-phone')
	if (phoneInput) {
		phoneInput.addEventListener('input', function(e) {
			// Удаляем все нецифровые символы
			this.value = this.value.replace(/[^\d]/g, '')
		})
	}

	// Обработчик закрытия модального окна
	const modal = document.getElementById('checkout-modal')
	if (modal) {
		const closeBtn = modal.querySelector('.close-modal')
		if (closeBtn) {
			closeBtn.onclick = () => {
				modal.style.display = 'none'
			}
		}

		// Закрытие по клику вне модального окна
		window.onclick = (event) => {
			if (event.target === modal) {
				modal.style.display = 'none'
			}
		}
	}
})

// Массив разделов для поиска
const sitePages = [
    { title: 'Главная', url: 'index.html', icon: '🏠' },
    { title: 'О нас', url: 'about.html', icon: 'ℹ️' },
    { title: 'Каталог', url: 'catalog.html', icon: '📦' },
    { title: 'Отзывы', url: 'reviews.html', icon: '⭐' },
    { title: 'Контакты', url: 'contact.html', icon: '📞' },
    { title: 'Доставка и оплата', url: 'delivery.html', icon: '🚚' },
    { title: 'Корзина', url: 'cart.html', icon: '🛒' }
];

// Инициализация поиска при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('site-search');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        // Обработчик ввода в поисковую строку
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm.length === 0) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                return;
            }

            // Фильтрация разделов
            const filteredPages = sitePages.filter(page => 
                page.title.toLowerCase().includes(searchTerm)
            );

            // Отображение результатов
            if (filteredPages.length > 0) {
                searchResults.innerHTML = filteredPages.map(page => `
                    <div class="search-result-item" onclick="window.location.href='${page.url}'">
                        <span>${page.icon}</span>
                        <span>${page.title}</span>
                    </div>
                `).join('');
                searchResults.classList.add('active');
            } else {
                searchResults.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
                searchResults.classList.add('active');
            }
        });

        // Закрытие результатов поиска при клике вне
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // Обработка нажатия Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const firstResult = searchResults.querySelector('.search-result-item');
                if (firstResult) {
                    const url = firstResult.getAttribute('onclick').match(/'(.+)'/)[1];
                    window.location.href = url;
                }
            }
        });
    }
});
