# React Pizza

React Pizza - pitsa menyusini ko'rish, mahsulot tanlash, savatni boshqarish va
buyurtma berish imkonini beruvchi React SPA (Single Page Application). Loyiha
admin panel orqali pitsalarni boshqarish va buyurtmalar holatini yangilash
imkoniyatlarini ham taqdim etadi.

## Imkoniyatlar

### Mijozlar uchun

- Barcha pitsalarni ko'rish.
- Pitsalarni kategoriya bo'yicha filtrlash: go'shtli, vegetarian, gril, achchiq
  va yopiq.
- Pitsalarni mashhurlik, narx va alifbo bo'yicha saralash.
- Pitsa uchun xamir turi va o'lcham tanlash.
- Tanlangan mahsulotlarni savatga qo'shish.
- Savatda miqdorni oshirish, kamaytirish yoki mahsulotni o'chirish.
- Buyurtma uchun ism, manzil va telefon raqamini yuborish.
- Buyurtma yaratilgandan keyin uning ID'sini brauzerda saqlash.
- "Mening buyurtmalarim" sahifasida buyurtma holatini ko'rish.
- Yetkazilmagan buyurtmani bekor qilish.

### Admin uchun

- Admin panelga demo login orqali kirish.
- Pitsalar ro'yxatini ko'rish va nom bo'yicha qidirish.
- Yangi pitsa qo'shish, mavjud pitsani tahrirlash va o'chirish.
- Faol, yetkazilgan va bekor qilingan buyurtmalarni alohida ko'rish.
- Buyurtmani yetkazilgan deb belgilash yoki bekor qilish.

## Texnologiyalar

- React 18
- TypeScript
- Vite
- React Router DOM
- Zustand
- Axios
- MockAPI
- CSS

## Talablar

- Node.js 18 yoki undan yuqori
- npm

## O'rnatish

```bash
git clone <repository-url>
cd react-pizza
npm install
```

## Environment sozlamalari

Root papkada `.env` fayli bo'lishi kerak:

```env
VITE_API_BASE_URL=https://6aaaa1efff4dd5698b4eda62.mockapi.io
```

`VITE_API_BASE_URL` quyidagi endpoint'lar uchun umumiy manzil sifatida
ishlatiladi:

- `GET/POST/PUT/DELETE /pizzas`
- `GET/POST/PUT /orders`

`.env` fayli `.gitignore`ga kiritilgan. `VITE_` prefiksli qiymatlar frontend
bundle'ga qo'shiladi, shuning uchun bu faylga maxfiy token yoki parol
yozilmasligi kerak.

## Ishga tushirish

Development server:

```bash
npm run dev
```

Odatda ilova `http://localhost:5173` manzilida ochiladi.

Production build:

```bash
npm run build
```

Build natijasini lokal ko'rish:

```bash
npm run preview
```

## Demo admin kirishi

Hozirgi versiyada admin autentifikatsiyasi frontend ichidagi demo tekshiruv
orqali amalga oshiriladi:

```text
Login: admin
Parol: admin123
```

Bu ma'lumotlar xavfsiz autentifikatsiya hisoblanmaydi. Production muhitida login
backend API, session yoki token asosidagi haqiqiy autentifikatsiya bilan
almashtirilishi kerak.

## Sahifalar va route'lar

| Route        | Vazifasi                              |
| ------------ | ------------------------------------- |
| `/`          | Pitsa menyusi, kategoriya va saralash |
| `/cart`      | Savat va buyurtma berish              |
| `/my-orders` | Mijoz buyurtmalari va ularning holati |
| `/admin`     | Admin panel                           |

Admin panelga ruxsatsiz kirish bosh sahifaga qaytariladi. Admin holati hozircha
`localStorage`dagi `isAdmin` qiymati orqali belgilanadi.

## Ma'lumotlar modeli

### Pitsa

```ts
interface Pizza {
	id: number;
	imageUrl: string;
	title: string;
	types: number[];
	sizes: number[];
	price: number;
	category: number;
	rating: number;
}
```

Narx o'lchamga qarab hisoblanadi:

- 26 sm: `1x`
- 30 sm: `1.2x`
- 40 sm: `1.6x`

### Buyurtma

Buyurtmada mijozning ismi, manzili, telefoni, savatdagi mahsulotlar, umumiy
summa, yaratilgan vaqt va holat flaglari saqlanadi:

- `delivered` - buyurtma yetkazilganligi
- `cancelled` - buyurtma bekor qilinganligi

## Ma'lumotlarni saqlash

- Pitsalar va buyurtmalar MockAPI orqali saqlanadi.
- Savat holati Zustand store'da saqlanadi.
- Mijoz buyurtmalarining ID'lari brauzer `localStorage`ida `myOrderIds` kaliti
  bilan saqlanadi.
- Admin holati `localStorage`dagi `isAdmin` kaliti bilan saqlanadi.
- Brauzer ma'lumotlari tozalansa, mijozning buyurtmalar ro'yxati ham yo'qoladi,
  lekin MockAPI'dagi buyurtmalar saqlanib qoladi.

## Loyiha tuzilmasi

```text
.
├── public/                 # Statik fayllar
├── src/
│   ├── api/                # Axios orqali pizza va order API funksiyalari
│   ├── Components/         # Header, modal va pizza komponentlari
│   ├── pages/              # Menu, Cart, MyOrders va Admin sahifalari
│   ├── store/              # Zustand cart store
│   ├── App.tsx             # Route'lar
│   ├── index.css           # Global stillar
│   ├── main.tsx            # Ilova entry point'i
│   └── types.ts            # Umumiy TypeScript tiplari
├── .env                   # Lokal API sozlamasi
├── .gitignore             # Gitga kiritilmaydigan fayllar
├── index.html
├── package.json
├── package-lock.json
├── tsconfig*.json
└── vite.config.ts
```

## Mavjud script'lar

| Buyruq            | Vazifasi                                   |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Vite development serverini ishga tushiradi |
| `npm run build`   | TypeScript tekshiruvi va production build  |
| `npm run preview` | Production buildni lokal ko'rsatadi        |

## Muhim cheklovlar

- Alohida test va lint script'lari hozircha `package.json`da mavjud emas.
- Admin login/paroli frontend kodida ochiq saqlangan.
- API manzili MockAPI'ga bog'langan.
- Savat refresh qilinganda Zustand store konfiguratsiyasiga qarab qayta
  tiklanmasligi mumkin.
- To'lov integratsiyasi mavjud emas; "To'lash" tugmasi buyurtmani API'ga
  yuborish jarayonini boshlaydi.

## Keyingi rivojlantirish yo'nalishlari

- Haqiqiy backend autentifikatsiyasini qo'shish.
- To'lov provayderi integratsiyasini qo'shish.
- Form validatsiyasi va umumiy error handling'ni kuchaytirish.
- Savatni persistent storage orqali tiklash.
- Unit va end-to-end testlar qo'shish.
- API URL'lari va endpoint'larini alohida konfiguratsiya qatlamiga ajratish.
