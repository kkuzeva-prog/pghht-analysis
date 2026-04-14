# ПГХТ Анализ — Система за анализ на образователни резултати

Уеб приложение за генериране на AI-базирани педагогически доклади за училище.

---

## Технологичен стек

| Компонент | Технология |
|-----------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes (Node.js) |
| Автентикация | Firebase Authentication (Google Sign-In) |
| База данни | Firebase Firestore |
| Централна БД | Google Sheets API |
| AI анализ | Anthropic Claude API |
| PDF генерация | jsPDF + jspdf-autotable |
| Deployment | Vercel |

---

## Структура на проекта

```
pghht-analysis/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts        # Главен API за анализ
│   │   │   ├── reports/route.ts        # API за доклади
│   │   │   ├── sheets/
│   │   │   │   ├── assignments/route.ts
│   │   │   │   ├── metadata/route.ts
│   │   │   │   └── students/route.ts
│   │   │   └── users/route.ts
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Sidebar навигация
│   │   │   ├── page.tsx                # Начална страница
│   │   │   ├── new/page.tsx            # Нов анализ
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx            # Списък доклади
│   │   │   │   └── [id]/page.tsx       # Детайлен доклад
│   │   │   ├── users/page.tsx          # Управление потребители
│   │   │   └── settings/page.tsx       # Настройки
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── hooks/
│   │   └── useAuth.tsx                 # Auth контекст
│   ├── lib/
│   │   ├── firebase.ts                 # Firebase клиент
│   │   ├── firebase-admin.ts           # Firebase Admin SDK
│   │   ├── sheets.ts                   # Google Sheets интеграция
│   │   ├── analysis.ts                 # Статистически изчисления
│   │   ├── ai.ts                       # Claude AI интеграция
│   │   └── pdf.ts                      # PDF генерация
│   └── types/index.ts
├── firestore.rules
├── firestore.indexes.json
├── vercel.json
├── .env.local.example
└── README.md
```

---

## Инструкции за инсталация и деплой

### Стъпка 1: Настройка на Firebase

1. Отидете на [Firebase Console](https://console.firebase.google.com/)
2. Създайте нов проект (напр. `pghht-analysis`)
3. Активирайте **Authentication** → Sign-in methods → **Google**
   - Добавете домейна на училището в "Authorized domains"
4. Активирайте **Firestore Database** в production mode
5. Копирайте конфигурацията от Project Settings → General → Your apps

**Firebase Admin SDK:**
1. Project Settings → Service accounts
2. Generate new private key
3. Запазете JSON файла — ще ви трябват `client_email` и `private_key`

**Деплойнете Firestore правилата:**
```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # изберете вашия проект
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

### Стъпка 2: Централна Google Sheets таблица

Създайте Google Sheets файл с 4 листа:

#### Лист "Students" (Ученици)
| A: ID | B: Name | C: Class | D: Gender |
|-------|---------|----------|-----------|
| 2024001 | Иван Иванов | 10А | М |
| 2024002 | Мария Петрова | 10А | Ж |

#### Лист "Teachers" (Учители)
| A: Email | B: Name | C: Role |
|----------|---------|---------|
| ivan@school.bg | Иван Учителов | teacher |
| maria@school.bg | Мария Директорова | director |

Роли: `admin`, `director`, `assistant_director`, `teacher`

#### Лист "Assignments" (Назначения)
| A: Class | B: Subject | C: Teacher Email |
|----------|------------|-----------------|
| 10А | Химия | ivan@school.bg |
| 10Б | Физика | petar@school.bg |

#### Лист "Metadata" (Метаданни)
| A: School Name | B: Address | C: Phone | D: Email | E: Logo URL |
|----------------|------------|----------|----------|-------------|
| ПГХТ "Проф. д-р Асен Златаров" | ул. Училищна 1, Пловдив | 032-123-456 | office@school.bg | https://... |

**Споделете таблицата** с Google Service Account email (от следващата стъпка) с роля **Viewer**.

---

### Стъпка 3: Google Cloud Service Account

1. Отидете на [Google Cloud Console](https://console.cloud.google.com/)
2. Изберете Firebase проекта
3. APIs & Services → Enable APIs → **Google Sheets API**
4. IAM & Admin → Service Accounts → Create Service Account
5. Изтеглете JSON ключ
6. Копирайте `client_email` и `private_key`

---

### Стъпка 4: Anthropic API Key

1. Отидете на [console.anthropic.com](https://console.anthropic.com/)
2. API Keys → Create Key
3. Копирайте ключа (започва с `sk-ant-`)

---

### Стъпка 5: Локална разработка

```bash
# Клонирайте проекта
git clone <your-repo>
cd pghht-analysis

# Инсталирайте зависимостите
npm install

# Създайте .env.local от примера
cp .env.local.example .env.local

# Попълнете всички стойности в .env.local (вижте по-долу)

# Стартирайте dev сървъра
npm run dev
```

Приложението ще е достъпно на `http://localhost:3000`

---

### Стъпка 6: Попълване на .env.local

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pghht-analysis.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pghht-analysis
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pghht-analysis.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Домейн на училището (само акаунти от този домейн могат да влязат)
NEXT_PUBLIC_ALLOWED_DOMAIN=yourschool.bg

# Firebase Admin (от service account JSON)
FIREBASE_ADMIN_PROJECT_ID=pghht-analysis
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@pghht-analysis.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvg...\n-----END PRIVATE KEY-----\n"

# Google Sheets API (от service account)
GOOGLE_SERVICE_ACCOUNT_EMAIL=sheets-reader@pghht-analysis.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvg...\n-----END PRIVATE KEY-----\n"

# ID от URL-а на централната Google Sheets таблица
CENTRAL_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Важно за PRIVATE_KEY:** Ако ключът е в JSON файл, копирайте `private_key` стойността буквално (с `\n` символите) и го оградете с двойни кавички.

---

### Стъпка 7: Деплой на Vercel

```bash
# Инсталирайте Vercel CLI
npm install -g vercel

# Логнете се
vercel login

# Деплойнете
vercel

# За production
vercel --prod
```

**Или чрез Vercel Dashboard:**
1. Push кода в GitHub
2. Отидете на [vercel.com](https://vercel.com) → Import Project
3. Изберете репото
4. В Environment Variables добавете всички стойности от `.env.local`
5. Deploy

**Добавете deployment URL-а в Firebase:**
- Firebase Console → Authentication → Authorized domains → Add domain (напр. `pghht-analysis.vercel.app`)

---

## Формат на таблицата с резултати

Когато учителите поставят линк към резултатите, таблицата трябва да има следния формат:

```
| ID      | Име           | Зад.1 | Зад.2 | Зад.3 | Общо | %    | Оценка |
|---------|---------------|-------|-------|-------|------|------|--------|
| 2024001 | Иван Иванов   | 8     | 6     | 10    | 24   | 80   | 5.00   |
| 2024002 | Мария Петрова | 5     | 4     | 7     | 16   | 53.3 | 3.50   |
```

Заглавията на колоните трябва да включват:
- `Общо` или `Total` или `Точки` — за общия брой точки
- `%` или `Процент` — за процента
- `Оценка` или `Grade` — за оценката

Таблицата трябва да е **публично достъпна** ("Anyone with the link can view") или споделена с Google Service Account.

---

## Ролеви права

| Действие | Teacher | Asst. Director | Director | Admin |
|----------|---------|----------------|----------|-------|
| Вижда своите анализи | ✓ | ✓ | ✓ | ✓ |
| Вижда всички анализи | ✗ | ✓ | ✓ | ✓ |
| Създава анализ | ✓ | ✓ | ✓ | ✓ |
| Изтрива анализ | ✗ | ✓ | ✓ | ✓ |
| Управлява потребители | ✗ | ✗ | ✗ | ✓ |
| Системни настройки | ✗ | ✗ | ✗ | ✓ |

**Първи потребител:** Първият потребител, който влезе, получава роля `teacher`. Трябва ръчно да промените ролята му на `admin` директно в Firestore Console (колекция `users`).

---

## Оценъчна система

Приложението използва **българска 6-степенна скала**:

| Процент | Оценка |
|---------|--------|
| ≥ 92% | 6.00 |
| ≥ 84% | 5.50 |
| ≥ 76% | 5.00 |
| ≥ 68% | 4.50 |
| ≥ 60% | 4.00 |
| ≥ 52% | 3.50 |
| ≥ 44% | 3.00 |
| ≥ 36% | 2.50 |
| < 36% | 2.00 |

Успеваемостта се изчислява като процент ученици с оценка ≥ 3.00.

---

## Локално тестване без реален Google Sheets

За тестване можете да използвате публична Google Sheets таблица.
Примерна тестова таблица с резултати можете да създадете с данните:

```
ID       | Ime             | Zad.1 | Zad.2 | Zad.3 | Obshto | %   | Otsenka
2024001  | Test Uchenik 1  | 9     | 8     | 10    | 27     | 90  | 6.00
2024002  | Test Uchenik 2  | 6     | 5     | 7     | 18     | 60  | 4.00
2024003  | Test Uchenik 3  | 3     | 2     | 4     | 9      | 30  | 2.00
```

---

## Поддръжка

При проблеми проверете:
1. Всички environment variables са правилно зададени
2. Google Service Account има достъп до централната таблица
3. Firebase Authorized Domains включва вашия deployment URL
4. Firestore rules са деплойнати
5. Google Sheets API е активирана в Google Cloud Console
