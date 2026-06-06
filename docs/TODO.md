# VinylEth — TODO

Задачи упорядочены по приоритету внутри каждого раздела.

---

---

## 🟠 Высокий приоритет

---

## 🟡 Средний приоритет

---

## 🟢 Низкий приоритет

### Wishlist / Избранное
Кнопка «♡» на AlbumCard и странице альбома.
- localStorage-based, без бэкенда
- Страница `/wishlist` со списком отложенных альбомов
- Badge с количеством в Header

### Недавно просмотренные
Секция «Recently viewed» в нижней части каталога или главной.
- Хранится в localStorage (последние 6 альбомов)
- Обновляется при заходе на страницу `/album/:id`

### Массовые операции в Admin Panel
При 350 альбомах редактировать по одному неудобно.
- Чекбоксы в таблице, кнопка «Select all»
- Batch actions: установить скидку X% / сбросить скидку / удалить / переключить featured
- Подтверждение перед деструктивными операциями

### CSV-экспорт каталога из Admin Panel
- Кнопка «Export CSV» скачивает текущую таблицу (с учётом фильтра)
- Поля: title, artist, year, genre, priceEth, discountPercent, stock, featured

### Быстрый импорт через Discogs в Admin Panel
Создать альбом без открытия полной формы.
- Поле «Discogs Release ID» прямо над таблицей
- Кнопка «Import» → фетч данных → создание записи → появление в таблице
- Price/stock по дефолту (0/0), редактировать потом

### PWA manifest
Делает сайт устанавливаемым на телефон / рабочий стол.
- `manifest.json`: name, short_name, theme_color, icons (192/512)
- `<link rel="manifest">` в `index.html`
- Service Worker — опционально, только для оффлайн-каталога

---

### Флоу ведения библиотеки (Navidrome → VinylEth)
Сейчас импорт — разовая операция. Нужно продумать как поддерживать каталог актуальным.
- Вариант A: повторный запуск `import:navidrome` (дубликаты пропускаются автоматически)
- Вариант B: кнопка «Sync from Navidrome» в Admin Panel — инкрементальный импорт через API
- Вариант C: webhook / cron на малинке при добавлении нового альбома
- Обсудить отдельно

---

## ✅ Выполнено

- Цена со скидкой на странице альбома, в корзине и PaymentPage (`effectivePrice` утилита)
- Server-side пагинация каталога — `GET /api/albums?page&limit&search&genre&sort`, «Load more», genres endpoint
- Страница профиля `/profile` — email, адрес доставки, смена пароля; ссылка в Header
- Заказы в Admin Panel — вкладка Orders, таблица с фильтром по дате и поиском по txHash
- Расширен seed — 15 альбомов: Jazz, Soul, Electronic, Punk, Classical, Hip-Hop; upsert по title+artist
- Похожие альбомы на странице альбома — SimilarAlbums компонент, grid→горизонтальный скролл на мобиле
- Image lazy loading — `loading="lazy"` на все img, FeaturedAlbum получил `eager` (above the fold)
- Error Boundary — class component, оборачивает Routes, показывает сообщение + кнопку Reload
- Статистика в Admin Panel — карточки (albums/out of stock/on sale/orders/ETH), топ-5 продаваемых

- BK-01 Environment Setup
- BK-02 Database Design
- BK-03 Home Page (каталог, поиск, фильтр, сортировка)
- BK-04 Product Detail Page (инфо, трекбист, vinyl specs, аудиоплеер)
- BK-05 Shopping Cart (add/remove/qty/persist)
- BK-06 Payment Gateway — MetaMask ETH
- BK-07 Audio Player (preview, seek, timer, cleanup on unmount)
- BK-08 Shipping Form (валидация, persist в localStorage + профиле)
- BK-09 User Registration & Auth (JWT, bcrypt, профиль, адрес)
- BK-10 Special Offers — фильтр по `discountPercent > 0`, зачёркнутая цена, бейдж «−X%»
- BK-11 Discogs API Integration (автофилл в Admin Panel)
- BK-12 Admin Panel (CRUD альбомов, пароль, защита маршрута)
- Авто-декремент стока после оплаты (`POST /api/orders`, `max(0, stock−qty)`)
- iTunes enrich:audio — скрипт и кнопка в Admin Panel
- MusicBrainz enrich — скрипт обогащения vinyl specs
- Navidrome import — скрипт импорта каталога через Subsonic API
- Страница 404
- Бейджи стока «Out of stock» / «Last copies» на AlbumCard и SpecialOffers
- История заказов `/orders` — дата, товары, сумма, ссылка на Etherscan
- Скелетоны загрузки — SkeletonCard (каталог) и SkeletonDetail (страница альбома)
- Debounce поиска 250 мс через `useDebounce` хук
- Поиск/фильтр по жанру в Admin Panel
