# jsd24-Databaser-25yhp-Individuell-Examination2-noSQL-Filmrecensionsplattform

## 👥 Roller

### 🔐 Roller & Behörighet

- När du registrerar en användare får den automatiskt rollen `user`.
- Första admin skapas **manuellt** i MongoDB Atlas:
  - Exempel:
    ```json
    {
      "username": "Mimmi",
      "email": "mimmi@example.com",
      "role": "admin"
    }
    ```
- Efter det kan endast andra **admins** uppgradera vanliga användare till `admin` med:
  ```
  PATCH /auth/:id/promote
  ```

---

## 🔑 Auth – Användare & Inloggning

### ✅ Öppet för alla (utan token)

#### 🟢 POST `/auth/register`
Registrerar en ny användare.

**Request body:**
```json
{
  "username": "Mimmi",
  "email": "mimmi@example.com",
  "password": "hemligt123"
}
```

**Svar:**
```json
{
  "success": true,
  "message": "Användaren har skapats",
  "data": {
    "user": {
      "id": "68441f13adaa8a37bbaa4c0a",
      "username": "Mimmi",
      "email": "mimmi@example.com",
      "role": "user"
    },
    "token": "JWT-TOKEN"
  }
}
```

#### 🟢 POST `/auth/login`
Loggar in en användare.

**Request body:**
```json
{
  "email": "mimmi@example.com",
  "password": "hemligt123"
}
```

---

### 🔒 Endast för admin

#### 🟡 PATCH `/auth/:id/promote`
Uppgraderar en användare till `admin`.

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Exempel:**
```
PATCH /auth/68441f13adaa8a37bbaa4c0a/promote
```

---

## 🎬 Movies – Filmer

### 🟢 Öppet för alla

#### ✅ GET `/movies`
Hämtar alla filmer.

#### ✅ GET `/movies/:id`
Hämtar detaljer för en specifik film.

#### ✅ GET `/movies/:id/reviews`
Hämtar recensioner för en film.

#### ✅ GET `/movies/ratings`
Returnerar betygsstatistik.

---

### 🔒 Endast admin

#### 🟡 POST `/movies`
Skapar en ny film.

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Body:**
```json
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "releaseYear": 2010,
  "genre": ["sci-fi", "thriller"]
}
```

**Svar:**
```json
{
  "success": true,
  "message": "Filmen har lagts till",
  "data": {
    "title": "Inception",
    "director": "Christopher Nolan",
    "releaseYear": 2010,
    "genre": ["sci-fi", "thriller"],
    "id": "6844240badaa8a37bbaa4c10"
  }
}
```

**🗂️ MongoDB Atlas visar:**
```json
{
  "_id": "6844240badaa8a37bbaa4c10",
  "title": "Inception",
  "director": "Christopher Nolan",
  "releaseYear": 2010,
  "genre": ["sci-fi", "thriller"]
}
```

#### 🟡 PUT `/movies/:id`
Uppdaterar en film.

#### 🟡 DELETE `/movies/:id`
Tar bort en film.

---

## 📝 Reviews – Recensioner

### 🟢 Öppet för alla

#### ✅ GET `/reviews`
Hämtar alla recensioner.

#### ✅ GET `/reviews/:id`
Hämtar en specifik recension.

---

### 🔐 Endast inloggade användare (user/admin)

#### 🟢 POST `/reviews`
Skapa en ny recension.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Body:**
```json
{
  "movieId": "6844240badaa8a37bbaa4c10",
  "rating": 5,
  "text": "En fantastisk film!"
}
```

#### 🟡 PUT `/reviews/:id`
Uppdaterar en recension (endast din egen).

#### 🟡 DELETE `/reviews/:id`
Tar bort en recension (endast din egen).

---

## 🧪 Exempel på MongoDB-data

### 🎞️ Film
```json
{
  "_id": "6844240badaa8a37bbaa4c10",
  "title": "Inception",
  "director": "Christopher Nolan",
  "releaseYear": 2010,
  "genre": ["sci-fi", "thriller"],
  "createdAt": "2025-06-07T11:35:39.122Z"
}
```

### 👤 Användare
```json
{
  "_id": "68441f13adaa8a37bbaa4c0a",
  "username": "Mimmi",
  "email": "mimmi@example.com",
  "role": "admin"
}
```
