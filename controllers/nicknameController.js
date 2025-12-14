// Словари для разных стилей никнеймов
const nicknameDictionaries = {
    casual: {
        prefixes: ['Cool', 'Chill', 'Sleepy', 'Happy', 'Lucky', 'Quick', 'Smart', 'Bright', 'Sharp', 'Swift'],
        suffixes: ['Dude', 'Guy', 'Player', 'Master', 'King', 'Pro', 'Star', 'Hero', 'Legend', 'Ninja'],
        words: ['Fox', 'Wolf', 'Bear', 'Eagle', 'Tiger', 'Dragon', 'Phoenix', 'Storm', 'Thunder', 'Shadow']
    },
    epic: {
        prefixes: ['Dark', 'Void', 'Chaos', 'Ancient', 'Mystical', 'Eternal', 'Cosmic', 'Infinite', 'Deadly', 'Cursed'],
        suffixes: ['Slayer', 'Reaper', 'Destroyer', 'Warrior', 'Assassin', 'Blade', 'Fury', 'Wrath', 'Doom', 'Abyss'],
        words: ['Demon', 'Dragon', 'Necro', 'Spectre', 'Phantom', 'Venom', 'Inferno', 'Blaze', 'Hex', 'Curse']
    },
    tech: {
        prefixes: ['Cyber', 'Pixel', 'Nano', 'Quantum', 'Digital', 'Binary', 'Hex', 'Byte', 'Code', 'Sync'],
        suffixes: ['Bot', 'Core', 'Net', 'Code', 'Sync', 'Ware', 'Tech', 'Matrix', 'Grid', 'System'],
        words: ['Nexus', 'Protocol', 'Algorithm', 'Vector', 'Kernel', 'Cache', 'Router', 'Socket', 'Signal', 'Node']
    },
    fantasy: {
        prefixes: ['Elf', 'Dark', 'Mystic', 'Ancient', 'Royal', 'Silver', 'Golden', 'Crystal', 'Shadow', 'Twilight'],
        suffixes: ['Mage', 'Seeker', 'Wanderer', 'Guardian', 'Sentinel', 'Knight', 'Sage', 'Lore', 'Oath', 'Spirit'],
        words: ['Elven', 'Druid', 'Wizard', 'Paladin', 'Ranger', 'Rogue', 'Archer', 'Mage', 'Cleric', 'Bard']
    }
};

// Функция для получения случайного элемента из массива
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Функция для получения случайного числа
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Основная функция генерации никнейма
function generateNickname(length, style, options) {
    if (!nicknameDictionaries[style]) {
        throw new Error('Неизвестный стиль: ' + style);
    }

    if (isNaN(length) || length < 5 || length > 30) {
        throw new Error('Длина должна быть от 5 до 30 символов');
    }

    const dict = nicknameDictionaries[style];
    let nickname = '';

    // Случайно выбираем способ генерации никнейма
    const method = Math.random();

    if (method < 0.4) {
        // Метод 1: Prefix + Word
        nickname = getRandomElement(dict.prefixes) + getRandomElement(dict.words);
    } else if (method < 0.7) {
        // Метод 2: Word + Suffix
        nickname = getRandomElement(dict.words) + getRandomElement(dict.suffixes);
    } else {
        // Метод 3: Prefix + Word + Suffix
        nickname = getRandomElement(dict.prefixes) + 
                  getRandomElement(dict.words) + 
                  getRandomElement(dict.suffixes);
    }

    // Усечение до нужной длины
    nickname = nickname.substring(0, length);

    // Добавляем цифры если нужно
    if (options.withNumbers && nickname.length < length) {
        while (nickname.length < length) {
            nickname += getRandomInt(0, 9);
        }
    }

    // Добавляем символы если нужно
    if (options.withSymbols && nickname.length < length) {
        const symbols = ['_', '-'];
        while (nickname.length < length) {
            nickname += getRandomElement(symbols);
        }
    }

    // Смешанный регистр
    if (options.mixedCase) {
        nickname = nickname.split('').map(char => {
            return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
        }).join('');
    }

    return nickname;
}

// Функция для оценки "крутости" никнейма
function rateNickname(nickname, style) {
    let score = 0;

    // Базовые баллы за стиль
    const styleScores = {
        casual: 15,
        epic: 25,
        tech: 20,
        fantasy: 22
    };
    score += styleScores[style] || 15;

    // Баллы за длину
    score += nickname.length * 2;

    // Баллы за наличие цифр
    if (/\d/.test(nickname)) score += 10;

    // Баллы за наличие спецсимволов
    if (/[_\-]/.test(nickname)) score += 15;

    // Баллы за смешанный регистр
    if (/[A-Z]/.test(nickname) && /[a-z]/.test(nickname)) score += 10;

    // Определяем уровень "крутости"
    if (score < 40) return { level: 'boring', label: 'Скучный' };
    if (score < 60) return { level: 'cool', label: 'Крутой' };
    if (score < 80) return { level: 'awesome', label: 'Потрясающий' };
    return { level: 'legendary', label: 'Легендарный' };
}

// GET обработчик
exports.generateNicknameGet = (req, res) => {
    try {
        const length = parseInt(req.query.length, 10) || 10;
        const style = req.query.style || 'casual';
        const withNumbers = req.query.numbers === 'true';
        const withSymbols = req.query.symbols === 'true';
        const mixedCase = req.query.mixedCase === 'true';

        if (!nicknameDictionaries[style]) {
            return res.status(400).json({ error: 'Неизвестный стиль: ' + style });
        }

        if (isNaN(length) || length < 5 || length > 30) {
            return res.status(400).json({ error: 'Длина должна быть от 5 до 30 символов' });
        }

        const options = {
            withNumbers,
            withSymbols,
            mixedCase
        };

        const nickname = generateNickname(length, style, options);
        const rating = rateNickname(nickname, style);

        res.json({
            nickname,
            style,
            length: nickname.length,
            rating
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при генерации: ' + error.message });
    }
};

// POST обработчик
exports.generateNicknamePost = (req, res) => {
    try {
        const { length, style, withNumbers, withSymbols, mixedCase } = req.body;

        const len = parseInt(length, 10) || 10;

        if (!nicknameDictionaries[style]) {
            return res.status(400).json({ error: 'Неизвестный стиль: ' + style });
        }

        if (isNaN(len) || len < 5 || len > 30) {
            return res.status(400).json({ error: 'Длина должна быть от 5 до 30 символов' });
        }

        const options = {
            withNumbers: withNumbers || false,
            withSymbols: withSymbols || false,
            mixedCase: mixedCase || false
        };

        const nickname = generateNickname(len, style, options);
        const rating = rateNickname(nickname, style);

        res.json({
            nickname,
            style,
            length: nickname.length,
            rating
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при генерации: ' + error.message });
    }
};

// Функция для генерации множественных никнеймов
exports.generateMultipleNicknames = (req, res) => {
    try {
        const { count, length, style, withNumbers, withSymbols, mixedCase } = req.body;

        const cnt = parseInt(count, 10) || 5;
        const len = parseInt(length, 10) || 10;

        if (cnt < 1 || cnt > 50) {
            return res.status(400).json({ error: 'Количество должно быть от 1 до 50' });
        }

        const options = {
            withNumbers: withNumbers || false,
            withSymbols: withSymbols || false,
            mixedCase: mixedCase || false
        };

        const nicknames = [];
        for (let i = 0; i < cnt; i++) {
            const nickname = generateNickname(len, style, options);
            const rating = rateNickname(nickname, style);
            nicknames.push({
                nickname,
                rating
            });
        }

        res.json({
            count: nicknames.length,
            style,
            nicknames
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при генерации: ' + error.message });
    }
};