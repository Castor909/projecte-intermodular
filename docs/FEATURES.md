# VinylEth — Полный обзор функциональности

**VinylEth** — интернет-магазин виниловых пластинок с оплатой в ETH (Ethereum). Покупатель просматривает каталог, добавляет товары в корзину, вводит адрес доставки и оплачивает заказ через MetaMask.

---

## Технический стек

| Слой | Технологии |
|---|---|
| Frontend | React 19, React Router v7, Vite (rolldown-vite) |
| Backend | Node.js, Express 5, MongoDB (Mongoose 9) |
| Блокчейн | MetaMask / `window.ethereum` (EIP-1193) |
| Сборка | Vite + ESLint |

---

## Страницы и маршруты

| Маршрут | Страница | Доступ |
|---|---|---|
| `/` | Каталог (CatalogPage) | Публичный |
| `/album/:id` | Детальная страница альбома | Публичный |
| `/cart` | Корзина | Публичный |
| `/wishlist` | Список избранного | Публичный |
| `/checkout/shipping` | Форма доставки | Публичный |
| `/checkout/payment` | Оплата | Публичный |
| `/orders` | История заказов пользователя | User JWT |
| `/profile` | Профиль пользователя | User JWT (AuthGuard) |
| `/login` | Вход пользователя | Публичный |
| `/register` | Регистрация пользователя | Публичный |
| `/admin/login` | Вход в панель администратора | Публичный |
| `/admin` | Панель администратора | Только авторизованный admin |

---

## Функциональность по блокам

### 1. Каталог (`/`)

**Главный банер (Featured Album)**
- Самостоятельный компонент, загружает первый альбом с `featured: true` через `GET /api/albums?featured=true`.
- Hero-секция: обложка, исполнитель, цена, кнопка «Buy Now».
- `loading="eager"` — загружается немедленно (above the fold).

**Специальные предложения (Special Offers)**
- Самостоятельный компонент, загружает альбомы со скидкой через `GET /api/albums?discounted=true`.
- На каждой карточке: бейдж «−X%», оригинальная цена (зачёркнутая), цена со скидкой, бейдж стока.
- Скрывается если нет ни одного альбома со скидкой.

**Сетка каталога (New Arrivals)**
- Отображает альбомы постранично (24 за раз).
- Показывает общий счётчик результатов («N results»).
- Кнопка «Load more (X of N)» подгружает следующую страницу и добавляет карточки в конец списка.
- При смене фильтра/поиска/сортировки список сбрасывается и загружается с первой страницы.
- Если нет совпадений — empty-state с подсказкой.

**Поиск**
- Поиск по полям: название, исполнитель, жанр.
- Выполняется на сервере (regex, регистронезависимо).
- Debounce 250 мс через `useDebounce` хук — нет лишних запросов при вводе.

**Фильтр по жанру**
- Список жанров загружается из `GET /api/albums/genres` — полный список независимо от текущей страницы.
- Вариант «All genres» всегда доступен.

**Сортировка (server-side)**
- Featured first (по умолчанию), Title A-Z / Z-A, Price low→high / high→low, Newest / Oldest first, Stock high→low.

**Недавно просмотренные (Recently Viewed)**
- Горизонтальная секция в самом низу каталога.
- Хранит последние 6 альбомов в `localStorage` (`key: vinyleth_recently_viewed`).
- Обновляется при успешной загрузке любой страницы `/album/:id`.
- Скрывается, если список пуст. На мобиле — горизонтальный скролл со snap.

---

### 2. Детальная страница альбома (`/album/:id`)

**Основная информация**
- Обложка (240×240 px), название, исполнитель, год, жанр, описание, количество на складе.
- Цена: если `discountPercent > 0` — зачёркнутая оригинальная + новая цена + бейдж «−X%»; иначе — просто цена.

**Добавление в корзину**
- Кнопка «Add to Cart»: добавляет по эффективной (сниженной) цене.
- Если `stock ≤ 0` — кнопка «Out of Stock» (заблокирована).
- После добавления — inline-сообщение об успехе.
- При превышении стока — предупреждение.

**Wishlist**
- Кнопка «♡ Save» / «♥ Saved» рядом с «Add to Cart».
- Мгновенно добавляет/убирает альбом из избранного без перезагрузки.

**Аудиоплеер (Preview)**
- Показывается только если заполнено `audioUrl`.
- Play / Pause, прогресс-бар (кликабелен), таймер, спиннер буферизации.
- Подпись «PREVIEW». Cleanup on unmount.

**Vinyl specs**
- Блок с Format, Label, Country, Barcode — только если данные есть.

**Список треков (Tracklist)**
- Нумерованный список с названием и длительностью. Скрыт, если трекбист не задан.

**Похожие альбомы (You might also like)**
- Секция после трекбиста: 4 карточки того же жанра (исключая текущий альбом).
- Загружается через `GET /api/albums?genre=X&page=1&limit=5`.
- Скрывается, если альбомов того же жанра нет.
- Десктоп: 4 колонки. Мобайл: горизонтальный скролл со snap.

---

### 3. Корзина (`/cart`)

**Список товаров**
- Каждый элемент: обложка, название, исполнитель, управление количеством, цена за позицию, кнопка «Remove».
- Если альбом со скидкой — оригинальная цена показана зачёркнутой рядом с итогом по позиции.
- Кнопка «+» заблокирована при достижении лимита склада.

**Итог**
- Общая сумма считается по **эффективным ценам** (с учётом скидок).

**Действия**
- «Clear Cart», «Proceed to Checkout →».

**Персистентность**
- Корзина в `localStorage` (`key: cart`).

---

### 4. Форма доставки (`/checkout/shipping`)

- Поля: Full name, Address, City, Postal code, Country.
- Валидация при отправке, ошибки inline.
- Данные в `localStorage` (`key: vinyleth_shipping`).
- Если пользователь залогинен — форма предзаполняется из профиля.
- После отправки адрес сохраняется в профиле через `PUT /api/auth/address`.

---

### 5. Оплата (`/checkout/payment`)

**Сводка заказа**
- Список товаров: название × количество = цена (по эффективной цене).
- Если есть скидка — рядом зачёркнута полная цена.
- Итоговая сумма по сниженным ценам.

**Оплата через MetaMask**
- `eth_sendTransaction` на кошелёк магазина (`STORE_WALLET`).
- ETH → wei через `BigInt` без потери точности.
- После получения `txHash`: `POST /api/orders` (best-effort) — декремент стока, сохранение заказа с **эффективными ценами**.

**Состояния**: idle → waiting → submitted / error.

**Экран успеха**: txHash, кнопка «Back to catalog», корзина очищается.

---

### 6. Авторизация пользователей

**Регистрация / Вход** — без изменений (Email, Password, JWT 7 дней).

**Профиль (`/profile`)**
- Доступен только залогиненным (AuthGuard → редирект на `/login`).
- **Account**: отображение email (read-only).
- **Delivery address**: форма с полями fullName / address / city / postalCode / country, предзаполнена из `user.savedAddress`. При сохранении — `PUT /api/auth/address`, обновляет контекст и `localStorage`.
- **Change password**: поля «Current password», «New password», «Confirm new password». Валидация совпадения на клиенте. `PUT /api/auth/password` на сервере — проверяет текущий пароль, хэширует новый.

---

### 7. Wishlist / Избранное (`/wishlist`)

- `WishlistContext` — глобальный провайдер, хранит список в `localStorage` (`key: vinyleth_wishlist`).
- **♡ на карточке** — overlay в правом верхнем углу обложки (AlbumCard).
- **♡ Save / ♥ Saved** — кнопка рядом с «Add to Cart» на детальной странице.
- Страница `/wishlist` — сетка AlbumCard; при пустом списке — сообщение + ссылка на каталог.
- Wishlist анонимный, авторизация не требуется.

---

### 8. История заказов (`/orders`)

- Список заказов текущего пользователя через `GET /api/orders/mine`.
- Каждый заказ: дата, список товаров (название × qty), сумма ETH, ссылка на Etherscan по txHash.

---

### 9. Шапка сайта (Header)

**Навигация**
- Ссылки: Catalog, Cart, **Wishlist** (с оранжевым бейджем-счётчиком, появляется при `count > 0`), About, Contact.

**Auth-блок (залогинен)**
- Ссылки «**Profile**», «My orders», email пользователя, кнопка «Log out».

**Auth-блок (не залогинен)**
- «Log in», «Register».

**MetaMask-кошелёк**
- Connect / Disconnect, усечённый адрес, обработка `accountsChanged`.

---

### 10. Панель администратора (`/admin`)

**Дашборд статистики**
- Всегда виден над табами.
- 5 карточек: Albums · Out of stock · On sale · Orders · ETH revenue.
- Топ-5 продаваемых альбомов (по суммарному qty из коллекции Order) — скрыт если заказов ещё нет.
- Данные из `GET /api/admin/stats` (один запрос с `Promise.all` из 6 агрегаций).

**Таб Albums**

*Быстрый импорт из Discogs*
- Поле «Discogs Release ID» + кнопка «Import from Discogs» над таблицей.
- Создаёт альбом с `priceEth: 0, stock: 0` без открытия формы.
- Успех/ошибка — inline сообщение.

*Фильтр и сортировка*
- Поиск по названию/исполнителю, фильтр по жанру.

*Batch-операции*
- Чекбокс в каждой строке + «Select all» в заголовке таблицы.
- Batch bar появляется при `selection > 0`: счётчик выбранных, поле `%` + «Set discount», «Clear discount», «Toggle featured», «Delete» (с `window.confirm`), «Deselect all».
- Выбранные строки подсвечены. Выбор сбрасывается при смене фильтра.

*CSV-экспорт*
- Кнопка «Export CSV» — скачивает `vinyleth-albums-YYYY-MM-DD.csv`.
- Экспортирует **видимые** альбомы с учётом текущего фильтра.
- Поля: title, artist, year, genre, priceEth, discountPercent, stock, featured.
- Клиентский Blob, RFC 4180 (экранирование запятых и кавычек).

*CRUD-операции*
- «+ Add Album» / Edit / Delete — без изменений.
- Автозаполнение из Discogs, кнопка «♪ iTunes» — без изменений.

**Таб Orders**
- Таблица всех заказов: дата, покупатель (email или *anonymous*), товары (название × qty), total ETH, txHash → Etherscan.
- Поиск по txHash, фильтр по диапазону дат (from / to), кнопка «Clear».
- Данные из `GET /api/orders` (admin).

---

## Бэкенд и база данных

### REST API

| Метод | Путь | Авторизация | Описание |
|---|---|---|---|
| GET | `/api/albums` | — | Список альбомов; поддерживает `?page&limit&search&genre&sort&featured&discounted` |
| GET | `/api/albums/genres` | — | Массив уникальных жанров |
| GET | `/api/albums/:id` | — | Один альбом по MongoDB ObjectId |
| POST | `/api/albums` | Admin | Создать альбом |
| PUT | `/api/albums/:id` | Admin | Обновить альбом |
| DELETE | `/api/albums/:id` | Admin | Удалить альбом |
| POST | `/api/admin/login` | — | Вход администратора |
| GET | `/api/admin/stats` | Admin | Статистика: счётчики + топ-5 + выручка |
| POST | `/api/auth/register` | — | Регистрация, возвращает JWT |
| POST | `/api/auth/login` | — | Вход, возвращает JWT |
| GET | `/api/auth/me` | User JWT | Данные текущего пользователя |
| PUT | `/api/auth/address` | User JWT | Сохранить адрес доставки |
| PUT | `/api/auth/password` | User JWT | Сменить пароль (проверяет текущий) |
| POST | `/api/orders` | Опционально | Подтвердить заказ, декрементировать сток |
| GET | `/api/orders/mine` | User JWT | История заказов пользователя |
| GET | `/api/orders` | Admin | Все заказы; поддерживает `?search&from&to` |
| GET | `/api/discogs/release/:id` | Admin | Прокси к Discogs API |
| GET | `/api/itunes/preview` | Admin | Прокси к iTunes Search API |

**Пагинация `GET /api/albums`**
- При наличии параметра `page` возвращает `{ albums, total, page, pages }`.
- Без `page` — возвращает массив (обратная совместимость для Admin Panel).
- Поддерживаемые параметры: `page`, `limit` (макс. 100), `search` (regex по title/artist/genre), `genre`, `sort`, `featured=true`, `discounted=true`.

### Модель данных (Album)

| Поле | Тип | Описание |
|---|---|---|
| `title` | String | Название альбома |
| `artist` | String | Исполнитель |
| `year` | Number | Год выпуска |
| `genre` | String | Жанр |
| `priceEth` | Number | Полная цена в ETH |
| `discountPercent` | Number | Скидка 0–100% (0 = нет скидки) |
| `coverUrl` | String | URL обложки |
| `stock` | Number | Количество на складе |
| `featured` | Boolean | Помечен как избранный |
| `description` | String | Описание |
| `audioUrl` | String | URL 30-сек аудиопревью |
| `tracks` | Array | `[{title, duration}]` |
| `label` | String | Лейбл |
| `country` | String | Страна издания |
| `vinylFormat` | String | Формат: «Vinyl, LP, Album» и др. |
| `barcode` | String | Штрихкод |
| `mbid` | String | MusicBrainz Release ID |

**Эффективная цена** (`effectivePrice` в `utils/price.js`):
`priceEth * (1 - discountPercent / 100)` — используется в AlbumCard, AlbumDetailPage, CartPage, PaymentPage и при сохранении заказа.

### Модель данных (User)

| Поле | Тип | Описание |
|---|---|---|
| `email` | String | Уникальный email (lowercase) |
| `passwordHash` | String | bcrypt-хэш пароля (10 rounds) |
| `savedAddress` | Object | `{fullName, address, city, postalCode, country}` |

### Модель данных (Order)

| Поле | Тип | Описание |
|---|---|---|
| `txHash` | String | Хэш Ethereum-транзакции |
| `items` | Array | `[{albumId, title, artist, qty, priceEth}]` — `priceEth` = эффективная цена |
| `totalEth` | Number | Итоговая сумма по эффективным ценам |
| `shippingAddress` | Object | Адрес доставки на момент покупки |
| `userId` | ObjectId | Ссылка на User (null для анонимных) |

### Автосид (seed)

- При запуске сервера проверяет наличие каждого альбома по `title + artist` (upsert-логика).
- Вставляет только отсутствующие — не затрагивает существующие данные (Navidrome-импорт безопасен).
- 15 альбомов охватывают жанры: Progressive Rock, Rock, Soft Rock, Jazz, Soul, Electronic, Punk, Classical, Hip-Hop.
- Диапазон цен: 0.028–0.08 ETH. Несколько со скидкой, несколько out of stock / low stock.

---

## Клиентская архитектура

### Контексты (провайдеры)

| Контекст | Ключ localStorage | Данные |
|---|---|---|
| `AuthContext` | `auth_token`, `auth_user` | token, user, login/logout/updateUser |
| `CartContext` | `cart` | cart[], addToCart, removeFromCart, qty-операции, clearCart |
| `WishlistContext` | `vinyleth_wishlist` | wishlist[], isInWishlist(id), toggleWishlist(album) |

### Утилиты (`src/utils/`)

| Файл | Назначение |
|---|---|
| `price.js` | `effectivePrice(album)` — цена с учётом скидки |
| `mapDiscogs.js` | Маппинг Discogs API response → поля альбома (shared между AdminAlbumForm и quick import) |
| `recentlyViewed.js` | `addToRecentlyViewed(album)`, `getRecentlyViewed()` — localStorage, макс. 6 |

### Error Boundary

- `ErrorBoundary` (class component) оборачивает `<Routes>`.
- Перехватывает необработанные ошибки рендера, показывает заголовок + сообщение + кнопку «Reload page».
- Header при этом остаётся видимым.

---

## PWA

- **`public/icon.svg`** — иконка виниловой пластинки (чёрный диск, оранжевый лейбл).
- **`public/manifest.json`** — `name: VinylEth`, `display: standalone`, `background_color: #fdfbf7`, `theme_color: #D35400`.
- **`index.html`** — `<link rel="manifest">`, `<meta name="theme-color">`, корректный title и description.
- Chrome/Android предлагает установить сайт после нескольких визитов. iOS Safari — через «Поделиться → На экран Домой».
- Service Worker не используется.

---

## Инструменты разработчика

### Обогащение метаданных — MusicBrainz (`npm run enrich`)
- Скрипт `server/scripts/enrich-albums.js` — label, country, vinylFormat, barcode, mbid. Rate-limit: 1200 мс.

### Обогащение аудио — iTunes (`npm run enrich:audio`)
- Скрипт `server/scripts/enrich-audio.js` — заполняет `audioUrl` для альбомов без превью. Rate-limit: 400 мс.

### Импорт из Navidrome (`npm run import:navidrome`)
- Импортирует альбомы из личной библиотеки Navidrome через Subsonic API.
- Скачивает обложки в `server/public/covers/`.
- Дубликаты пропускаются автоматически.

### API contract-тесты (`npm test` — сервер)
- `GET /api/albums` → 200 + массив.
- `GET /api/albums/abc` → 400.
- `GET /api/albums/<несуществующий ObjectId>` → 404.

### Unit-тесты корзины (`npm test` — клиент)
- Чистые функции `cartState.js`: добавление, дедупликация, лимит стока, удаление.
