const express = require('express');
const path = require('path');
const requestLogger = require('./middleware/logger');
const nicknameRoutes = require('./routes/nicknameRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Раздача статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// API маршруты
app.use('/api', nicknameRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка ошибок 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`✓ Генератор никнеймов запущен на http://localhost:${PORT}`);
});