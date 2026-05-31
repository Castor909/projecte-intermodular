# VinylEth — TODO

Задачи упорядочены по приоритету. Бэклог-задачи помечены ID (BK-XX).

---

## 🟡 Средний приоритет

### Расширить каталог (seed)
Сейчас только 3 альбома — мало для демо поиска, фильтров и сортировки.
- Добавить 12–15 альбомов разных жанров: Jazz, Soul, Electronic, Punk, Classical, Hip-Hop
- Разнообразить ценовой диапазон (0.01 – 0.12 ETH)
- Несколько альбомов с `stock: 0` (out of stock) и `stock: 1–2` (low stock)
- Несколько с `featured: true` для секции Special Offers

### Страница 404
Сейчас несуществующий маршрут рендерит пустой экран.
- Компонент `NotFoundPage` с сообщением и кнопкой «← Back to catalog»
- Добавить `<Route path="*">` в Router.jsx

### Бейджи стока на карточках
Визуальная подсказка о наличии прямо в каталоге.
- `stock === 0` → бейдж «Out of stock» (серый)
- `stock <= 2` → бейдж «Last copies» (оранжевый)
- Отображается на `AlbumCard` и в `SpecialOffers`

### BK-10 — Special Offers: реальные скидки
Сейчас секция показывает альбомы по флагу `featured`, а не по скидке.
- Добавить поле `discountPercent` (Number, 0–100) в модель Album
- Поддержать поле в Admin Panel (форма + таблица)
- Special Offers показывает альбомы у которых `discountPercent > 0`
- На карточке — зачёркнутая старая цена и новая

### История заказов
Страница `/orders` с транзакциями пользователя.
- Инфраструктура готова: коллекция `Order` уже существует, `GET /api/orders/mine` реализован
- Нужна только страница `/orders` на фронтенде
- Показывать список с датой, суммой, товарами и ссылкой на Etherscan

---

## 🟢 Низкий приоритет

### Debounce поиска в каталоге
Сейчас `CatalogPage` фильтрует на каждый введённый символ.
- Добавить задержку 250 мс через `useDebounce` хук
- Актуально при большом каталоге

### Поиск / фильтр в Admin Panel
При разросшемся каталоге таблица становится неудобной.
- Поле поиска над таблицей (фильтрует по title / artist)
- Фильтр по жанру

### Быстрый импорт через Discogs в Admin Panel
Создать альбом без открытия полной формы.
- Поле «Discogs Release ID» прямо над таблицей
- Кнопка «Import» → фетч данных → создание записи → появление в таблице
- Сохраняет price/stock по дефолту (0 / 0), редактировать потом

### Скелетоны загрузки
Вместо текста «Loading albums...» — анимированные placeholder-карточки.
- Компонент `SkeletonCard` (серые прямоугольники с shimmer-анимацией)
- Использовать в `CatalogPage` и `AlbumDetailPage`

---

### Флоу ведения библиотеки (Navidrome → VinylEth)
Сейчас импорт — разовая операция. Нужно продумать как поддерживать каталог актуальным.
- Вариант A: повторный запуск `import:navidrome` (дубликаты пропускаются автоматически)
- Вариант B: кнопка «Sync from Navidrome» в Admin Panel — запускает инкрементальный импорт через API
- Вариант C: webhook / cron на малинке который при добавлении нового альбома отправляет данные в VinylEth API
- Приоритет: низкий, обсудить отдельно

---

## ✅ Выполнено

- BK-01 Environment Setup
- BK-02 Database Design
- BK-03 Home Page (каталог, поиск, фильтр, сортировка)
- BK-04 Product Detail Page (инфо, трекбист, vinyl specs, аудиоплеер)
- BK-05 Shopping Cart (add/remove/qty/persist)
- BK-06 Payment Gateway — MetaMask ETH
- BK-07 Audio Player (preview, seek, timer, cleanup on unmount)
- BK-08 Shipping Form (валидация, persist в localStorage + профиле)
- BK-09 User Registration & Auth (JWT, bcrypt, профиль, адрес)
- BK-11 Discogs API Integration (автофилл в Admin Panel)
- BK-12 Admin Panel (CRUD альбомов, пароль, защита маршрута)
- Авто-декремент стока после оплаты (POST /api/orders, max(0, stock-qty))
- iTunes enrich:audio — скрипт и кнопка в Admin Panel
- MusicBrainz enrich — скрипт обогащения vinyl specs
- Navidrome import — скрипт импорта каталога через Subsonic API
