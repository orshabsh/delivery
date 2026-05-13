// Инициализация карты Leaflet
document.addEventListener('DOMContentLoaded', function() {
    // Координаты школы (примерные координаты для д. Бабиничи, Оршанский район)
    const schoolCoords = [54.4833, 30.3667];
    
    // Создаем карту
    const map = L.map('map').setView(schoolCoords, 12);
    
    // Добавляем слой OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Данные маршрутов
    const routes = {
        route1: {
            name: 'Маршрут №1',
            color: '#e74c3c',
            coordinates: [
                [54.4833, 30.3667], // Школа
                [54.4900, 30.3800], // д. Коптевичи
                [54.4950, 30.3900], // д. Замошье
                [54.5000, 30.4000]  // д. Бабиничи (начало)
            ],
            stops: [
                {name: 'Школа', coords: [54.4833, 30.3667]},
                {name: 'д. Коптевичи', coords: [54.4900, 30.3800]},
                {name: 'д. Замошье', coords: [54.4950, 30.3900]},
                {name: 'д. Бабиничи', coords: [54.5000, 30.4000]}
            ]
        },
        route2: {
            name: 'Маршрут №2',
            color: '#3498db',
            coordinates: [
                [54.4833, 30.3667], // Школа
                [54.4750, 30.3500], // д. Митьково
                [54.4700, 30.3400], // д. Сущево
                [54.4650, 30.3300]  // д. Гришино (начало)
            ],
            stops: [
                {name: 'Школа', coords: [54.4833, 30.3667]},
                {name: 'д. Митьково', coords: [54.4750, 30.3500]},
                {name: 'д. Сущево', coords: [54.4700, 30.3400]},
                {name: 'д. Гришино', coords: [54.4650, 30.3300]}
            ]
        },
        route3: {
            name: 'Маршрут №3',
            color: '#2ecc71',
            coordinates: [
                [54.4833, 30.3667], // Школа
                [54.4900, 30.3500], // д. Старое Село
                [54.4950, 30.3400], // д. Липовка
                [54.5000, 30.3300]  // д. Высокое (начало)
            ],
            stops: [
                {name: 'Школа', coords: [54.4833, 30.3667]},
                {name: 'д. Старое Село', coords: [54.4900, 30.3500]},
                {name: 'д. Липовка', coords: [54.4950, 30.3400]},
                {name: 'д. Высокое', coords: [54.5000, 30.3300]}
            ]
        }
    };
    
    // Хранилище для маркеров и линий
    let markers = [];
    let polylines = [];
    
    // Функция для добавления маркера на карту
    function addMarker(stop, routeColor) {
        const marker = L.marker(stop.coords).addTo(map);
        marker.bindPopup(`<b>${stop.name}</b><br>Остановка подвоза`);
        markers.push(marker);
        return marker;
    }
    
    // Функция для добавления линии маршрута
    function addPolyline(routeData) {
        const polyline = L.polyline(routeData.coordinates, {
            color: routeData.color,
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10'
        }).addTo(map);
        
        polyline.bindPopup(`<b>${routeData.name}</b>`);
        polylines.push(polyline);
        return polyline;
    }
    
    // Функция для отображения маршрута
    function showRoute(routeKey) {
        // Очищаем текущие маркеры и линии
        markers.forEach(marker => map.removeLayer(marker));
        polylines.forEach(polyline => map.removeLayer(polyline));
        markers = [];
        polylines = [];
        
        if (routeKey === 'all') {
            // Показываем все маршруты
            Object.keys(routes).forEach(key => {
                const route = routes[key];
                route.stops.forEach(stop => addMarker(stop, route.color));
                addPolyline(route);
            });
            
            // Устанавливаем зум для отображения всех маршрутов
            const allCoords = [];
            Object.values(routes).forEach(route => {
                allCoords.push(...route.coordinates);
            });
            const group = new L.featureGroup(polylines);
            map.fitBounds(group.getBounds(), {padding: [50, 50]});
        } else {
            // Показываем выбранный маршрут
            const route = routes[routeKey];
            route.stops.forEach(stop => addMarker(stop, route.color));
            addPolyline(route);
            
            // Устанавливаем зум для текущего маршрута
            const group = new L.featureGroup(polylines);
            map.fitBounds(group.getBounds(), {padding: [50, 50]});
        }
    }
    
    // Обработчики кнопок переключения маршрутов
    const routeButtons = document.querySelectorAll('.route-btn');
    routeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            routeButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            // Показываем выбранный маршрут
            showRoute(this.dataset.route);
        });
    });
    
    // Инициализация - показываем все маршруты
    showRoute('all');
    
    // Добавляем маркер школы
    const schoolMarker = L.marker(schoolCoords).addTo(map);
    schoolMarker.bindPopup('<b>Бабиничская средняя школа</b><br>Конечная точка всех маршрутов');
    markers.push(schoolMarker);
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Обработка формы обратной связи
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Здесь можно добавить отправку данных на сервер
            // Для демонстрации просто покажем сообщение
            alert('Спасибо за ваш вопрос! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }
    
    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками информации
    document.querySelectorAll('.info-card, .contact-card, .route-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
});

// Дополнительные интерактивные функции
function highlightRoute(routeName) {
    const routeItems = document.querySelectorAll('.route-item');
    routeItems.forEach(item => {
        if (item.dataset.route === routeName || routeName === 'all') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Экспорт функций для использования в консоли
window.highlightRoute = highlightRoute;

console.log('Сайт организации подвоза учащихся успешно загружен!');
console.log('Карта инициализирована с использованием Leaflet.js');
