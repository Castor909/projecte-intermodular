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



---

## 🟢 Низкий приоритет


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
- Страница 404 с сообщением и кнопкой возврата
- Бейджи стока «Out of stock» / «Last copies» на AlbumCard и SpecialOffers
- BK-10 Special Offers — фильтр по `discountPercent > 0`, зачёркнутая цена, бейдж «−X%»
- История заказов `/orders` — список с датой, товарами, суммой и ссылкой на Etherscan
- Скелетоны загрузки — SkeletonCard (каталог) и SkeletonDetail (страница альбома)
- Debounce поиска 250 мс через useDebounce хук
- Поиск/фильтр по жанру в Admin Panel
