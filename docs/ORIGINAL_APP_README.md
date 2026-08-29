# Scholarship Finder App

A full-stack web application that helps users discover and apply for scholarships. Built with React (frontend) and Node.js/Express with MongoDB (backend).

## Getting Started

Follow these instructions to set up the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/sujalbuilds/scholarship-finder-app
cd scholarship-finder
```

### 2. Setup the Frontend

```bash
cd frontend
npm install
```

### 3. Setup the Backend

```bash
cd ../scholarship-finder-backend
npm install
```

### 4. Create `.env` Files

#### `frontend/.env`

```
REACT_APP_API_URL=http://localhost:3001
```

#### `backend/.env`

```
PORT=3001
DB_URI=mongodb://localhost:27017/scholarship-finder
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

### 5. Scrape Scholarships (Run this before starting the backend server)

To populate the database with scholarships:

```bash
cd backend/scrapers
node index.js
```

### 6. Run the Backend Server

```bash
cd ../
node server.js
```

### 7. Start the Frontend (in a different terminal)

Open a new terminal window or tab and run:

```bash
cd frontend
npm start
```

### 8. Register and Use the App

* Visit the React app in your browser (typically at `http://localhost:3000`).
* Register a new account.
* Browse available scholarships.

---

## Tech Stack

* **Frontend**: React, Axios, React Router
* **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
* **Scraping**: Cheerio, Axios

## License

[MIT](LICENSE)

---

For any questions or contributions, feel free to open an issue or submit a pull request!
