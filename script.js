if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
} else {
    console.warn('Telegram Web App не доступен, работаем в оффлайн-режиме');
}

let balance = 0;
let orderCount = 0;
let referralCount = 0;
let orderHistory = [];
let selectedCity = 'all';
let selectedDistrict = 'all';
let currentUser = null;
let userLanguage = 'ru';
let mailMessages = [];
let pendingPayments = {};
const MIN_DEPOSIT = 1000;
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

let cryptoRates = {
    BTC: 2000000,
    ETH: 100000,
    USDT: 33,
    SOL: 5000,
    TON: 200
};

const BOT_B_TOKEN = '7589545725:AAHoedAqoGh_k0WWdUs1rcBN1yddUtBFhsk';
const ADMIN_CHAT_ID = '5956080955';

const testAddresses = {
    BTC: "bc1qxk53npp2g3gt3x93k93vqgq93v5nwp5cvuk7fn",
    ETH: "0x0d6b8E631b6c99e5184d492F4bcf22c8B5F96009",
    USDT: "TCZUbqocgdwWx7AJVf6Kk5bq6cQETbWu54",
    SOL: "HadNG2gWHYiep7GfuP9UzxZQdeKuhCfPQ6qqBNo19B3B",
    TON: "UQAXS4W2EW4gTFvpZqf-zR1zDrnLcNkjpZOkh-2EXFjwQ2Vh"
};

const cryptoNetworks = {
    BTC: "BEP20",
    ETH: "ERC20",
    USDT: "TRC20",
    SOL: "Solana",
    TON: "TON"
};

const translations = {
    en: {
        promoBanner: "Invite friends and get bonuses! 5 friends = 0.5g amphetamine, 10 friends = 0.5g cocaine (MQ), 25 friends = 1g cocaine (VHQ)!",
        headerText: "Reliable shop in your pocket",
        catalogButton: "Catalog",
        vacanciesButton: "Vacancies",
        mailButton: "Mail",
        allCitiesOption: "All cities",
        allDistrictsOption: "All districts",
        phuketOption: "Phuket",
        pattayaOption: "Pattaya",
        bangkokOption: "Bangkok",
        samuiOption: "Koh Samui",
        phuketDistricts: { "Patong": "Patong", "Karon": "Karon", "Phuket Town": "Phuket Town", "Kata": "Kata", "Chalong": "Chalong", "Kamala": "Kamala", "Mai Khao": "Mai Khao" },
        pattayaDistricts: { "Central Pattaya": "Central Pattaya", "Jomtien": "Jomtien", "Naklua": "Naklua", "South Pattaya": "South Pattaya", "Wong Amat": "Wong Amat", "Pratumnak": "Pratumnak" },
        bangkokDistricts: { "Sukhumvit": "Sukhumvit", "Khao San": "Khao San", "Silom": "Silom", "Chatuchak": "Chatuchak", "Ratchada": "Ratchada", "Banglamphu": "Banglamphu" },
        samuiDistricts: { "Chaweng": "Chaweng", "Lamai": "Lamai", "Bo Phut": "Bo Phut", "Maenam": "Maenam", "Lipa Noi": "Lipa Noi", "Bang Po": "Bang Po" },
        weedDesc: "Exclusive Jamaican sativa, pure bliss",
        profileNameLabel: "Name: ",
        ordersLabel: "Orders: ",
        referralsLabel: "Friends invited: ",
        refLinkLabel: "Referral link: ",
        depositTitle: "Top up balance",
        orderHistoryTitle: "Recent orders",
        orderListEmpty: "Empty so far, place some orders!",
        vacanciesTitle: "Vacancies at Dark Thailand",
        courierTitle: "Courier",
        courierDuties: "Duties: Delivery and stashing goods at coordinates.",
        courierPay: "Pay: 500-1000 ฿ per stash (depends on volume).",
        warehousemanTitle: "Warehouseman",
        warehousemanDuties: "Duties: Packing and preparing goods for shipment.",
        warehousemanPay: "Pay: 2000-3000 ฿ per shift.",
        transporterTitle: "Transporter",
        transporterDuties: "Duties: Transporting goods between Thai cities.",
        transporterPay: "Pay: 5000-10000 ฿ per trip.",
        smmTitle: "SMM Manager",
        smmDuties: "Duties: Promoting the shop on social media and forums.",
        smmPay: "Pay: 3000-5000 ฿ per week + activity bonuses.",
        applyButton: "Apply",
        mailTitle: "Mail",
        mailListEmpty: "No messages yet.",
        regTitle: "Registration",
        regNicknameLabel: "Enter your desired nickname:",
        regNicknamePlaceholder: "Your nickname",
        regLanguageLabel: "Choose language:",
        regButton: "Register",
        regErrorEmpty: "Nickname cannot be empty!",
        regErrorTaken: "This nickname is already taken!",
        welcomeMessage: "Welcome, {user}! Your account has been created.",
        insufficientFunds: "Insufficient funds! Top up your balance?",
        yes: "Yes",
        no: "No",
        paymentSuccess: "Payment successful!",
        preorderTitle: "Preorder",
        preorderPlaced: "Preorder placed!",
        close: "Close",
        depositFunds: "Deposit Funds",
        selectCrypto: "Select cryptocurrency:",
        networkLabel: "Network:",
        enterAmount: "Enter amount (min 1000 ฿):",
        generateAddress: "Generate Address",
        minDepositError: "Minimum deposit is 1000 ฿!",
        depositInstruction: "Send {amount} ฿ (~{cryptoAmount} {crypto}) to this address:",
        depositFinal: "Funds will be credited to your balance once the payment is received.",
        depositExpiry: "Address expires in 30 minutes.",
        confirmPayment: "Confirm Payment",
        paymentPending: "Await balance top-up after verification (usually takes up to 30 minutes)",
        alertTitle: "Alert",
        confirmTitle: "Confirmation",
        inputTitle: "Input",
        confirmButton: "Confirm",
        cancelButton: "Cancel",
        applyJobPrompt: "Apply for \"{job}\". Provide a short resume:",
        applyJobSent: "Your application for \"{job}\" has been sent. Await admin response.",
        applyJobAlert: "Application for \"{job}\" sent!",
        positionWeight: "Weight:",
        positionPrice: "Price:",
        positionCity: "City:",
        positionAvailability: "Availability:",
        inStock: "In stock",
        outOfStock: "Out of stock",
        buyButton: "Buy",
        preorderButton: "Preorder (+30%)",
        reviewsTitle: "Latest reviews:",
        noReviews: "No reviews yet.",
        promoInfo: "Invite friends and get free stuff!"
    },
    ru: {
        promoBanner: "Приглашай друзей и получай стафф! 5 друзей = 0.5 г амфетамина, 10 друзей = 0.5 г кокаина (MQ), 25 друзей = 1 г кокаина (VHQ)!",
        headerText: "Надёжный шоп в твоём кармане",
        catalogButton: "Каталог",
        vacanciesButton: "Вакансии",
        mailButton: "Почта",
        allCitiesOption: "Все города",
        allDistrictsOption: "Все районы",
        phuketOption: "Пхукет",
        pattayaOption: "Паттайя",
        bangkokOption: "Бангкок",
        samuiOption: "о. Самуи",
        phuketDistricts: { "Patong": "Патонг", "Karon": "Карон", "Phuket Town": "Пхукет-таун", "Kata": "Ката", "Chalong": "Чалонг", "Kamala": "Камала", "Mai Khao": "Май Кхао" },
        pattayaDistricts: { "Central Pattaya": "Центральная Паттайя", "Jomtien": "Джомтьен", "Naklua": "Наклуа", "South Pattaya": "Южная Паттайя", "Wong Amat": "Вонг Амат", "Pratumnak": "Пратамнак" },
        bangkokDistricts: { "Sukhumvit": "Сукхумвит", "Khao San": "Каосан", "Silom": "Силом", "Chatuchak": "Чатучак", "Ratchada": "Ратчада", "Banglamphu": "Банглампху" },
        samuiDistricts: { "Chaweng": "Чавенг", "Lamai": "Ламай", "Bo Phut": "Бо Пхут", "Maenam": "Маенам", "Lipa Noi": "Липа Ной", "Bang Po": "Банг По" },
        weedDesc: "Эксклюзивная ямайская сатива, чистейший кайф",
        profileNameLabel: "Имя: ",
        ordersLabel: "Заказов: ",
        referralsLabel: "Приглашено друзей: ",
        refLinkLabel: "Реферальная ссылка: ",
        depositTitle: "Пополнить баланс",
        orderHistoryTitle: "Последние заказы",
        orderListEmpty: "Пока пусто, делай заказы!",
        vacanciesTitle: "Вакансии в Dark Thailand",
        courierTitle: "Кладмен",
        courierDuties: "Обязанности: Доставка и закладка товара по координатам.",
        courierPay: "Оплата: 500-1000 ฿ за клад (зависит от объёма).",
        warehousemanTitle: "Складмен",
        warehousemanDuties: "Обязанности: Упаковка и подготовка товара к отправке.",
        warehousemanPay: "Оплата: 2000-3000 ฿ за смену.",
        transporterTitle: "Перевозчик",
        transporterDuties: "Обязанности: Перевозка товара между городами Таиланда.",
        transporterPay: "Оплата: 5000-10000 ฿ за рейс.",
        smmTitle: "SMMщик",
        smmDuties: "Обязанности: Продвижение шопа в соцсетях и форумах.",
        smmPay: "Оплата: 3000-5000 ฿ в неделю + бонусы за активность.",
        applyButton: "Оставить заявку",
        mailTitle: "Почта",
        mailListEmpty: "Пока нет сообщений.",
        regTitle: "Регистрация",
        regNicknameLabel: "Введите желаемый никнейм:",
        regNicknamePlaceholder: "Ваш никнейм",
        regLanguageLabel: "Выберите язык:",
        regButton: "Зарегистрироваться",
        regErrorEmpty: "Никнейм не может быть пустым!",
        regErrorTaken: "Этот никнейм уже занят!",
        welcomeMessage: "Добро пожаловать, {user}! Ваш аккаунт успешно создан.",
        insufficientFunds: "Недостаточно средств на балансе! Пополнить баланс?",
        yes: "Да",
        no: "Нет",
        paymentSuccess: "Оплата прошла!",
        preorderTitle: "Предзаказ",
        preorderPlaced: "Предзаказ оформлен!",
        close: "Закрыть",
        depositFunds: "Пополнить баланс",
        selectCrypto: "Выберите криптовалюту:",
        networkLabel: "Сеть:",
        enterAmount: "Введите сумму (мин. 1000 ฿):",
        generateAddress: "Сгенерировать адрес",
        minDepositError: "Минимальная сумма пополнения — 1000 ฿!",
        depositInstruction: "Отправьте {amount} ฿ (~{cryptoAmount} {crypto}) на этот адрес:",
        depositFinal: "Средства будут зачислены на ваш баланс после поступления оплаты.",
        depositExpiry: "Адрес действителен 30 минут.",
        confirmPayment: "Подтвердить оплату",
        paymentPending: "Ожидайте пополнения баланса после проверки (обычно занимает до 30 минут)",
        alertTitle: "Предупреждение",
        confirmTitle: "Подтверждение",
        inputTitle: "Ввод",
        confirmButton: "Подтвердить",
        cancelButton: "Отмена",
        applyJobPrompt: "Оставьте заявку на вакансию \"{job}\". Укажите краткое резюме:",
        applyJobSent: "Ваша заявка на вакансию \"{job}\" отправлена. Ожидайте ответа от администрации.",
        applyJobAlert: "Заявка на \"{job}\" отправлена!",
        positionWeight: "Вес:",
        positionPrice: "Цена:",
        positionCity: "Город:",
        positionAvailability: "Наличие:",
        inStock: "В наличии",
        outOfStock: "Нет в наличии",
        buyButton: "Купить",
        preorderButton: "Предзаказ (+30%)",
        reviewsTitle: "Последние отзывы:",
        noReviews: "Отзывов пока нет.",
        promoInfo: "Приглашай друзей и получай стафф!"
    }
};

const cities = {
    "phuket": {
        "Patong": { lat: "7.891", lon: "98.298", desc: "Под пальмой у третьего шезлонга, закопано в песке, чёрный пакет." },
        "Karon": { lat: "7.846", lon: "98.295", desc: "Под камнем у забора, магнит в синей изоленте." },
        "Phuket Town": { lat: "7.883", lon: "98.391", desc: "В кустах за старой палаткой, завёрнуто в зелёную плёнку." },
        "Kata": { lat: "7.820", lon: "98.299", desc: "Под скамейкой у пляжа, завёрнуто в чёрную плёнку." },
        "Chalong": { lat: "7.831", lon: "98.339", desc: "За вывеской у пирса, магнит в красной изоленте." },
        "Kamala": { lat: "7.952", lon: "98.284", desc: "Под кустом у дороги, завёрнуто в серую ткань." },
        "Mai Khao": { lat: "8.130", lon: "98.298", desc: "В песке у заброшенной палатки, чёрный пакет." }
    },
    "pattaya": {
        "Central Pattaya": { lat: "12.935", lon: "100.887", desc: "В трещине стены у бара, магнит в красной изоленте." },
        "Jomtien": { lat: "12.903", lon: "100.869", desc: "Под кустом у дороги, завёрнуто в серую ткань." },
        "Naklua": { lat: "12.970", lon: "100.900", desc: "За мусоркой на рынке, чёрный пакет." },
        "South Pattaya": { lat: "12.923", lon: "100.882", desc: "Под камнем у пирса, завёрнуто в зелёную плёнку." },
        "Wong Amat": { lat: "12.963", lon: "100.885", desc: "Под скамейкой у пляжа, магнит в жёлтой изоленте." },
        "Pratumnak": { lat: "12.918", lon: "100.865", desc: "В кустах на холме, завёрнуто в чёрную плёнку." }
    },
    "bangkok": {
        "Sukhumvit": { lat: "13.736", lon: "100.561", desc: "В трещине стены у метро, магнит в жёлтой изоленте." },
        "Khao San": { lat: "13.759", lon: "100.497", desc: "Под скамейкой у хостела, завёрнуто в чёрную плёнку." },
        "Silom": { lat: "13.723", lon: "100.535", desc: "За вывеской у бара, магнит в синей изоленте." },
        "Chatuchak": { lat: "13.799", lon: "100.548", desc: "В кустах у рынка, завёрнуто в серую ткань." },
        "Ratchada": { lat: "13.779", lon: "100.573", desc: "Под мостом у метро, магнит в зелёной изоленте." },
        "Banglamphu": { lat: "13.760", lon: "100.501", desc: "За палаткой у канала, чёрный пакет." }
    },
    "samui": {
        "Chaweng": { lat: "9.520", lon: "100.057", desc: "Под шезлонгом у бара, завёрнуто в чёрный пакет." },
        "Lamai": { lat: "9.470", lon: "100.047", desc: "В кустах у дороги, магнит в зелёной изоленте." },
        "Bo Phut": { lat: "9.560", lon: "100.031", desc: "Под камнем у пирса, завёрнуто в серую ткань." },
        "Maenam": { lat: "9.573", lon: "100.000", desc: "За мусоркой у пляжа, чёрный пакет." },
        "Lipa Noi": { lat: "9.498", lon: "99.935", desc: "Под пальмой у берега, магнит в синей изоленте." },
        "Bang Po": { lat: "9.580", lon: "99.970", desc: "В песке у забора, завёрнуто в зелёную плёнку." }
    }
};

const weights = {
    default: [1, 2, 3, 5, 10, 15, 20],
    cokeMephAlphaMdma: [0.5, 1, 2, 3, 5, 10, 15, 20],
    lsd: [1, 2, 5, 10],
    mdmaTabs: [1, 2, 5]
};

const basePrices = {
    weed: { 1: 1500 },
    hash: { 1: 900, 2: 700, 3: 500, 4: 400, 5: 1000 },
    coke: { 1: 4000, 2: 3600, 3: 3000, 4: 2400, 5: 4500 },
    amph: { 1: 1300, 2: 1000, 3: 900, 4: 700, 5: 1500 },
    meth: { 1: 1500, 2: 1200, 3: 1000, 4: 800, 5: 1800 },
    meph: { 1: 1400, 2: 1100, 3: 900, 4: 700, 5: 1600 },
    alpha: { 1: 1200, 2: 1000, 3: 800, 4: 600, 5: 1400 },
    lsd: { 1: 500, 2: 450, 3: 400, 4: 350, 5: 600 },
    mdma: { 1: 1500, 2: 1200, 3: 600, 4: 1000, 5: 400 },
    heroin: { 1: 2000, 2: 1800, 3: 1500, 4: 1200, 5: 2500 }
};

function getRandomDate() {
    const start = new Date(2024, 11, 15); // 15 декабря 2024
    const end = new Date(2025, 2, 14);   // 14 марта 2025
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('ru-RU');
}

const products = {
    weed: {
        1: { 
            name: "Jamaican Haze (VHQ)", 
            positions: generatePositions('weed', 1, 'default'), 
            reviews: [
                { text: "Трава огонь, лучший кайф в Тае! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Нормально, но за такие бабки ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Долбит как надо, чистое удовольствие! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Слабая, местная шняга лучше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Два косяка — и я в космосе! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    hash: {
        1: { 
            name: "Afghan Black Gold (VHQ)", 
            positions: generatePositions('hash', 1, 'default'), 
            reviews: [
                { text: "Мягкий и мощный, просто кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Липкий пиздец, тяжело работать. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Идеальный гаш, чистое золото! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Слабый приход, ждал большего. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бархатный кайф, топ качество! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "Moroccan Spice (HQ)", 
            positions: generatePositions('hash', 2, 'default'), 
            reviews: [
                { text: "Пряный аромат, кайф стабильный! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Слишком сухой, крошится в пыль. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший гаш за свои деньги! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Ничего особенного, слабовато. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный вкус, мягкий приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Nepal Temple (MQ)", 
            positions: generatePositions('hash', 3, 'default'), 
            reviews: [
                { text: "Сбалансированный приход, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Пыльный какой-то, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный гаш, среднячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Хорошо расслабляет, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Local Dust (LQ)", 
            positions: generatePositions('hash', 4, 'default'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный гаш, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и грязный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Himalayan Storm (VHQ)", 
            positions: generatePositions('hash', 5, 'default'), 
            reviews: [
                { text: "Мощный шторм, топовый гаш! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Элитный гаш, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Чистый кайф, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    coke: {
        1: { 
            name: "Bolivian Fishscale (VHQ)", 
            positions: generatePositions('coke', 1, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Топовый кокос, чистейший кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Боливийский снег, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный заряд, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "Colombian Snow (HQ)", 
            positions: generatePositions('coke', 2, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Колумбийский снег, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший кокос, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Чистый кайф, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Peruvian Dust (MQ)", 
            positions: generatePositions('coke', 3, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Средний кайф, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный кокос, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой приход, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Street Mix (LQ)", 
            positions: generatePositions('coke', 4, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный кокос, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и грязный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Cartel Gold (VHQ)", 
            positions: generatePositions('coke', 5, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Золото картеля, элитный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Топовый кокос, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    amph: {
        1: { 
            name: "Crystal Surge (VHQ)", 
            positions: generatePositions('amph', 1, 'default'), 
            reviews: [
                { text: "Чистая энергия, топовый амф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Кристальный заряд, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный драйв, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "Red Rush (HQ)", 
            positions: generatePositions('amph', 2, 'default'), 
            reviews: [
                { text: "Красный заряд, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший амф, норм драйв! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный подъём, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Yellow Spark (MQ)", 
            positions: generatePositions('amph', 3, 'default'), 
            reviews: [
                { text: "Средний подъём, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный амф, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой драйв, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Grey Haze (LQ)", 
            positions: generatePositions('amph', 4, 'default'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный амф, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и мутный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Blue Blitz (VHQ)", 
            positions: generatePositions('amph', 5, 'default'), 
            reviews: [
                { text: "Синий удар, элитный драйв! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Топовый амф, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    meth: {
        1: { 
            name: "Mountain Ice (VHQ)", 
            positions: generatePositions('meth', 1, 'default'), 
            reviews: [
                { text: "Горный лёд, чистейший кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Кристальный мет, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный заряд, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "Blue Flame (HQ)", 
            positions: generatePositions('meth', 2, 'default'), 
            reviews: [
                { text: "Синее пламя, долгий кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший мет, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Чистый кайф, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "White Shard (MQ)", 
            positions: generatePositions('meth', 3, 'default'), 
            reviews: [
                { text: "Средний кайф, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный мет, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой приход, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Dirty Crystal (LQ)", 
            positions: generatePositions('meth', 4, 'default'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный мет, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и грязный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Golden Shard (VHQ)", 
            positions: generatePositions('meth', 5, 'default'), 
            reviews: [
                { text: "Золотой осколок, элитный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Топовый мет, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    meph: {
        1: { 
            name: "Pink Bliss (VHQ)", 
            positions: generatePositions('meph', 1, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Розовый кайф, чистейший эффект! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Элитный меф, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный заряд, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "White Surge (HQ)", 
            positions: generatePositions('meph', 2, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Белый всплеск, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший меф, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный подъём, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Grey Mist (MQ)", 
            positions: generatePositions('meph', 3, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Средний кайф, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный меф, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой приход, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Dusty High (LQ)", 
            positions: generatePositions('meph', 4, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный меф, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и грязный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Red Pulse (VHQ)", 
            positions: generatePositions('meph', 5, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Красный пульс, элитный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Топовый меф, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    alpha: {
        1: { 
            name: "Flakka Fire (VHQ)", 
            positions: generatePositions('alpha', 1, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Огненная флакка, чистейший кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Элитный альфа, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный заряд, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "Purple Haze (HQ)", 
            positions: generatePositions('alpha', 2, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Пурпурная дымка, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший альфа, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный подъём, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Green Dust (MQ)", 
            positions: generatePositions('alpha', 3, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Средний кайф, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный альфа, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой приход, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Street Gravel (LQ)", 
            positions: generatePositions('alpha', 4, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный альфа, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и грязный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Crystal Fury (VHQ)", 
            positions: generatePositions('alpha', 5, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Кристальная ярость, элитный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Топовый альфа, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    lsd: {
        1: { 
            name: "Cosmic Tabs (VHQ)", 
            positions: generatePositions('lsd', 1, 'lsd'), 
            reviews: [
                { text: "Космический трип, чистейший кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Элитный кислый, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный трип, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "Neon Drops (HQ)", 
            positions: generatePositions('lsd', 2, 'lsd'), 
            reviews: [
                { text: "Неоновый трип, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Слабый эффект, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший кислый, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный трип, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Acid Rain (MQ)", 
            positions: generatePositions('lsd', 3, 'lsd'), 
            reviews: [
                { text: "Средний трип, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и скучный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный кислый, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой трип, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Street Blotters (LQ)", 
            positions: generatePositions('lsd', 4, 'lsd'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный кислый, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и мутный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, трипанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Galactic Hits (VHQ)", 
            positions: generatePositions('lsd', 5, 'lsd'), 
            reviews: [
                { text: "Галактический трип, элитный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Топовый кислый, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    mdma: {
        1: { 
            name: "Crystal Love (VHQ)", 
            positions: generatePositions('mdma', 1, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Кристальная любовь, чистейший кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Элитный МДМА, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный заряд, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "Pink Rocks (HQ)", 
            positions: generatePositions('mdma', 2, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Розовые камни, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший МДМА, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный подъём, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Ecstasy Blue (VHQ Tabs)", 
            positions: generatePositions('mdma', 3, 'mdmaTabs'), 
            reviews: [
                { text: "Синий экстази, топовый кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Элитные пилсы, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        4: { 
            name: "Molly Dust (MQ)", 
            positions: generatePositions('mdma', 4, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Средний кайф, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный МДМА, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой приход, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        5: { 
            name: "Street Pills (LQ Tabs)", 
            positions: generatePositions('mdma', 5, 'mdmaTabs'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетные пилсы, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и мутный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    heroin: {
        1: { 
            name: "Afghan Silk (VHQ)", 
            positions: generatePositions('heroin', 1, 'default'), 
            reviews: [
                { text: "Афганский шёлк, глубокий кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Элитный гер, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный приход, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "White Lotus (HQ)", 
            positions: generatePositions('heroin', 2, 'default'), 
            reviews: [
                { text: "Белый лотос, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший гер, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный подъём, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Brown Sugar (MQ)", 
            positions: generatePositions('heroin', 3, 'default'), 
            reviews: [
                { text: "Средний кайф, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный гер, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой приход, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Dirty Tar (LQ)", 
            positions: generatePositions('heroin', 4, 'default'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный гер, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и грязный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Black Pearl (VHQ)", 
            positions: generatePositions('heroin', 5, 'default'), 
            reviews: [
                { text: "Чёрная жемчужина, элитный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Топовый гер, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    }
};

// Генерация позиций
function generatePositions(category, productId, weightType) {
    const positions = {};
    const availableWeights = weights[weightType] || weights.default;
    const basePrice = basePrices[category][productId];
    
    for (let city in cities) {
        for (let district in cities[city]) {
            const stockCount = Math.floor(Math.random() * 5); // 0-4 позиции в наличии
            if (stockCount > 0) {
                positions[`${city}-${district}`] = {
                    weight: availableWeights[Math.floor(Math.random() * availableWeights.length)],
                    price: basePrice * availableWeights[Math.floor(Math.random() * availableWeights.length)],
                    available: stockCount
                };
            }
        }
    }
    return positions;
}

// Инициализация интерфейса
function initUI() {
    // Удаляем проверку currentUser здесь, так как она будет в window.onload
    document.getElementById('promoBanner').innerText = translations[userLanguage].promoBanner;
    document.getElementById('headerText').innerText = translations[userLanguage].headerText;
    document.getElementById('catalogButton').innerText = translations[userLanguage].catalogButton;
    document.getElementById('vacanciesButton').innerText = translations[userLanguage].vacanciesButton;
    document.getElementById('mailButton').innerText = translations[userLanguage].mailButton;
    document.getElementById('allCitiesOption').innerText = translations[userLanguage].allCitiesOption;
    document.getElementById('phuketOption').innerText = translations[userLanguage].phuketOption;
    document.getElementById('pattayaOption').innerText = translations[userLanguage].pattayaOption;
    document.getElementById('bangkokOption').innerText = translations[userLanguage].bangkokOption;
    document.getElementById('samuiOption').innerText = translations[userLanguage].samuiOption;
    document.getElementById('allDistrictsOption').innerText = translations[userLanguage].allDistrictsOption;
    document.getElementById('weedDesc').innerText = translations[userLanguage].weedDesc;
    document.getElementById('profileNameLabel').innerText = translations[userLanguage].profileNameLabel + currentUser;
    document.getElementById('ordersLabel').innerText = translations[userLanguage].ordersLabel + orderCount;
    document.getElementById('referralsLabel').innerText = translations[userLanguage].referralsLabel + referralCount;
    document.getElementById('depositTitle').innerText = translations[userLanguage].depositTitle;
    document.getElementById('orderHistoryTitle').innerText = translations[userLanguage].orderHistoryTitle;
    document.getElementById('vacanciesTitle').innerText = translations[userLanguage].vacanciesTitle;
    document.getElementById('courierTitle').innerText = translations[userLanguage].courierTitle;
    document.getElementById('courierDuties').innerText = translations[userLanguage].courierDuties;
    document.getElementById('courierPay').innerText = translations[userLanguage].courierPay;
    document.getElementById('warehousemanTitle').innerText = translations[userLanguage].warehousemanTitle;
    document.getElementById('warehousemanDuties').innerText = translations[userLanguage].warehousemanDuties;
    document.getElementById('warehousemanPay').innerText = translations[userLanguage].warehousemanPay;
    document.getElementById('transporterTitle').innerText = translations[userLanguage].transporterTitle;
    document.getElementById('transporterDuties').innerText = translations[userLanguage].transporterDuties;
    document.getElementById('transporterPay').innerText = translations[userLanguage].transporterPay;
    document.getElementById('smmTitle').innerText = translations[userLanguage].smmTitle;
    document.getElementById('smmDuties').innerText = translations[userLanguage].smmDuties;
    document.getElementById('smmPay').innerText = translations[userLanguage].smmPay;
    document.getElementById('applyButton1').innerText = translations[userLanguage].applyButton;
    document.getElementById('applyButton2').innerText = translations[userLanguage].applyButton;
    document.getElementById('applyButton3').innerText = translations[userLanguage].applyButton;
    document.getElementById('applyButton4').innerText = translations[userLanguage].applyButton;
    document.getElementById('mailTitle').innerText = translations[userLanguage].mailTitle;
    document.getElementById('promoInfo').innerText = translations[userLanguage].promoInfo;

    updateBalance();
    updateOrderHistory();
    updateMail();
    setupTabs();
}

// Обновление баланса
function updateBalance() {
    document.getElementById('balance').innerText = `${balance} ฿`;
}

// Обновление истории заказов
function updateOrderHistory() {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = orderHistory.length > 0 ? orderHistory.map(order => `<p>${order}</p>`).join('') : translations[userLanguage].orderListEmpty;
}

// Обновление почты
function updateMail() {
    const mailList = document.getElementById('mailList');
    mailList.innerHTML = mailMessages.length > 0 ? mailMessages.map(msg => `<p>${msg}</p>`).join('') : translations[userLanguage].mailListEmpty;
}

// Настройка вкладок каталога
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
            document.getElementById(tab.dataset.tab).style.display = 'block';
        });
    });
    if (tabs.length > 0) {
        tabs[0].click();
    }
}

// Переключение меню
function toggleCatalog() {
    hideAllMenus();
    document.getElementById('catalogMenu').style.display = 'block';
    filterByCity();
}

function toggleProfile() {
    hideAllMenus();
    document.getElementById('profileMenu').style.display = 'block';
}

function toggleVacancies() {
    hideAllMenus();
    document.getElementById('vacancyMenu').style.display = 'block';
}

function toggleMail() {
    hideAllMenus();
    document.getElementById('mailMenu').style.display = 'block';
}

function hideAllMenus() {
    document.getElementById('catalogMenu').style.display = 'none';
    document.getElementById('profileMenu').style.display = 'none';
    document.getElementById('vacancyMenu').style.display = 'none';
    document.getElementById('mailMenu').style.display = 'none';
}

// Фильтрация по городу и району
function filterByCity() {
    selectedCity = document.getElementById('citySelect').value;
    const districtSelect = document.getElementById('districtSelect');
    districtSelect.innerHTML = `<option value="all">${translations[userLanguage].allDistrictsOption}</option>`;
    
    if (selectedCity !== 'all') {
        const districts = Object.keys(cities[selectedCity]);
        districts.forEach(district => {
            const translatedDistrict = translations[userLanguage][`${selectedCity}Districts`][district];
            districtSelect.innerHTML += `<option value="${district}">${translatedDistrict}</option>`;
        });
    }
    filterByDistrict();
}

function filterByDistrict() {
    selectedDistrict = document.getElementById('districtSelect').value;
    // Здесь можно добавить логику фильтрации товаров по району, если нужно
}

// Отображение модального окна продукта
function showProductModal(category, productId) {
    const product = products[category][productId];
    const availableWeights = weights[category === 'lsd' ? 'lsd' : (category === 'mdma' && (productId === 3 || productId === 5)) ? 'mdmaTabs' : 'cokeMephAlphaMdma'] || weights.default;
    let html = `<h2>${product.name}</h2>`;

    const positions = product.positions;
    const availablePositions = Object.keys(positions).filter(pos => {
        const [city, district] = pos.split('-');
        return (selectedCity === 'all' || selectedCity === city) && (selectedDistrict === 'all' || selectedDistrict === district);
    });

    if (availablePositions.length > 0) {
        availablePositions.forEach(pos => {
            const [city, district] = pos.split('-');
            const position = positions[pos];
            const price = position.price;
            const cryptoPrice = (price / cryptoRates['BTC']).toFixed(6);
            html += `
                <div class="position">
                    <p>${translations[userLanguage].positionWeight} ${position.weight} г</p>
                    <p>${translations[userLanguage].positionPrice} ${price} ฿ (~${cryptoPrice} BTC)</p>
                    <p>${translations[userLanguage].positionCity} ${translations[userLanguage][`${city}Option`]} - ${translations[userLanguage][`${city}Districts`][district]}</p>
                    <p>${translations[userLanguage].positionAvailability} ${position.available > 0 ? translations[userLanguage].inStock : translations[userLanguage].outOfStock}</p>
                    ${position.available > 0 ? `<button class="buy-button" onclick="buyProduct('${category}', ${productId}, '${pos}', ${price})">${translations[userLanguage].buyButton}</button>` : ''}
                    <button class="preorder-button" onclick="preorderProduct('${category}', ${productId}, '${pos}', ${price})">${translations[userLanguage].preorderButton}</button>
                </div>`;
        });
    } else {
        html += `<p>${translations[userLanguage].outOfStock}</p>`;
        html += `<button class="preorder-button" onclick="preorderProduct('${category}', ${productId}, null, ${basePrices[category][productId]})">${translations[userLanguage].preorderButton}</button>`;
    }

    html += `<h3>${translations[userLanguage].reviewsTitle}</h3>`;
    if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach(review => {
            html += `
                <div class="review">
                    <span class="review-text">${review.text}</span>
                    <span class="review-date">${review.date}</span>
                </div>`;
            if (review.mod) {
                html += `<div class="moderator-response">${review.mod}</div>`;
            }
        });
    } else {
        html += `<p>${translations[userLanguage].noReviews}</p>`;
    }

    document.getElementById('productContent').innerHTML = html;
    document.getElementById('productModal').style.display = 'flex';
}

// Покупка товара
function buyProduct(category, productId, positionKey, price) {
    if (balance < price) {
        showConfirm(translations[userLanguage].insufficientFunds, () => showDepositModal('BTC'), () => {});
        return;
    }

    balance -= price;
    orderCount++;
    const product = products[category][productId];
    const [city, district] = positionKey.split('-');
    const position = product.positions[positionKey];
    position.available--;

    const orderDetails = `${product.name} (${position.weight} г) - ${translations[userLanguage][`${city}Option`]}, ${translations[userLanguage][`${city}Districts`][district]} - ${price} ฿`;
    orderHistory.unshift(orderDetails);
    if (orderHistory.length > 5) orderHistory.pop();

    const stashDetails = `${cities[city][district].desc} Координаты: ${cities[city][district].lat}, ${cities[city][district].lon}`;
    mailMessages.unshift(`Заказ: ${orderDetails}\nМесто: ${stashDetails}`);
    if (mailMessages.length > 10) mailMessages.pop();

    updateBalance();
    updateOrderHistory();
    updateMail();

    document.getElementById('productModal').style.display = 'none';
    showAlert(translations[userLanguage].paymentSuccess);
}

// Предзаказ товара
function preorderProduct(category, productId, positionKey, basePrice) {
    const preorderPrice = Math.round(basePrice * 1.3); // +30% за предзаказ
    let html = `<h2>${translations[userLanguage].preorderTitle}</h2>`;
    html += `<p>${products[category][productId].name}</p>`;
    html += `<p>${translations[userLanguage].positionPrice} ${preorderPrice} ฿</p>`;
    html += `<button class="buy-button" onclick="confirmPreorder('${category}', ${productId}, ${preorderPrice})">${translations[userLanguage].buyButton}</button>`;
    html += `<button class="buy-button" onclick="document.getElementById('preorderModal').style.display = 'none'">${translations[userLanguage].close}</button>`;

    document.getElementById('preorderContent').innerHTML = html;
    document.getElementById('preorderModal').style.display = 'flex';
}

function confirmPreorder(category, productId, price) {
    if (balance < price) {
        showConfirm(translations[userLanguage].insufficientFunds, () => showDepositModal('BTC'), () => {});
        return;
    }

    balance -= price;
    orderCount++;
    const product = products[category][productId];
    const orderDetails = `${product.name} (Предзаказ) - ${price} ฿`;
    orderHistory.unshift(orderDetails);
    if (orderHistory.length > 5) orderHistory.pop();

    mailMessages.unshift(`Предзаказ: ${orderDetails}\nОжидайте уведомления о поступлении товара.`);
    if (mailMessages.length > 10) mailMessages.pop();

    updateBalance();
    updateOrderHistory();
    updateMail();

    document.getElementById('preorderModal').style.display = 'none';
    document.getElementById('productModal').style.display = 'none';
    showAlert(translations[userLanguage].preorderPlaced);
}

// Регистрация пользователя
function showRegistrationModal() {
    document.getElementById('registrationModal').style.display = 'flex';
}

function registerUser() {
    const nickname = document.getElementById('regNickname').value.trim();
    const language = document.getElementById('regLanguage').value;

    if (!nickname) {
        document.getElementById('regError').innerText = translations[language].regErrorEmpty;
        return;
    }

    if (registeredUsers.some(user => user.nickname === nickname)) {
        document.getElementById('regError').innerText = translations[language].regErrorTaken;
        return;
    }

    currentUser = nickname;
    userLanguage = language;
    registeredUsers.push({ nickname, language });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    document.getElementById('registrationModal').style.display = 'none';
    showAlert(translations[userLanguage].welcomeMessage.replace('{user}', currentUser));
    initUI();
}

// Пополнение баланса
function showDepositModal(crypto) {
    let html = `<h2>${translations[userLanguage].depositFunds}</h2>`;
    html += `<p>${translations[userLanguage].selectCrypto}</p>`;
    html += `<select id="cryptoSelect" onchange="updateDepositNetwork()">`;
    for (let c in cryptoRates) {
        html += `<option value="${c}" ${c === crypto ? 'selected' : ''}>${c}</option>`;
    }
    html += `</select>`;
    html += `<p>${translations[userLanguage].networkLabel} <span id="cryptoNetwork">${cryptoNetworks[crypto]}</span></p>`;
    html += `<p>${translations[userLanguage].enterAmount}</p>`;
    html += `<input type="number" id="depositAmount" placeholder="฿">`;
    html += `<button class="buy-button" onclick="generateDepositAddress()">${translations[userLanguage].generateAddress}</button>`;
    html += `<button class="buy-button" onclick="document.getElementById('depositModal').style.display = 'none'">${translations[userLanguage].close}</button>`;

    document.getElementById('depositContent').innerHTML = html;
    document.getElementById('depositModal').style.display = 'flex';
}

function updateDepositNetwork() {
    const crypto = document.getElementById('cryptoSelect').value;
    document.getElementById('cryptoNetwork').innerText = cryptoNetworks[crypto];
}

function generateDepositAddress() {
    const amount = parseInt(document.getElementById('depositAmount').value);
    const crypto = document.getElementById('cryptoSelect').value;

    if (amount < MIN_DEPOSIT) {
        showAlert(translations[userLanguage].minDepositError);
        return;
    }

    const cryptoAmount = (amount / cryptoRates[crypto]).toFixed(6);
    const address = testAddresses[crypto];
    const paymentId = `${currentUser}-${Date.now()}`;

    pendingPayments[paymentId] = { amount, crypto, address, timestamp: Date.now() };

    let html = `<h2>${translations[userLanguage].depositFunds}</h2>`;
    html += `<p>${translations[userLanguage].depositInstruction.replace('{amount}', amount).replace('{cryptoAmount}', cryptoAmount).replace('{crypto}', crypto)}</p>`;
    html += `<p><strong>${address}</strong></p>`;
    html += `<p>${translations[userLanguage].depositFinal}</p>`;
    html += `<p>${translations[userLanguage].depositExpiry}</p>`;
    html += `<button class="buy-button" onclick="confirmDeposit('${paymentId}')">${translations[userLanguage].confirmPayment}</button>`;
    html += `<button class="buy-button" onclick="document.getElementById('depositModal').style.display = 'none'">${translations[userLanguage].close}</button>`;

    document.getElementById('depositContent').innerHTML = html;
}

function confirmDeposit(paymentId) {
    const payment = pendingPayments[paymentId];
    if (!payment || (Date.now() - payment.timestamp) > 30 * 60 * 1000) {
        showAlert("Срок действия адреса истёк!");
        delete pendingPayments[paymentId];
        document.getElementById('depositModal').style.display = 'none';
        return;
    }

    sendToAdmin(`Пополнение баланса от ${currentUser}:\n${payment.amount} ฿ (~${(payment.amount / cryptoRates[payment.crypto]).toFixed(6)} ${payment.crypto})\nАдрес: ${payment.address}`);
    showAlert(translations[userLanguage].paymentPending);
    document.getElementById('depositModal').style.display = 'none';

    setTimeout(() => {
        if (pendingPayments[paymentId]) {
            balance += payment.amount;
            updateBalance();
            mailMessages.unshift(`Баланс пополнен на ${payment.amount} ฿ через ${payment.crypto}`);
            updateMail();
            delete pendingPayments[paymentId];
        }
    }, 30000); // Симуляция проверки оплаты
}

// Отправка заявки на вакансию
function applyForJob(job) {
    showInput(translations[userLanguage].applyJobPrompt.replace('{job}', job), resume => {
        const message = `Заявка на вакансию "${job}" от ${currentUser}:\n${resume}`;
        sendToAdmin(message);
        mailMessages.unshift(translations[userLanguage].applyJobSent.replace('{job}', job));
        updateMail();
        showAlert(translations[userLanguage].applyJobAlert.replace('{job}', job));
    });
}

// Отправка сообщения администратору
function sendToAdmin(message) {
    const url = `https://api.telegram.org/bot${BOT_B_TOKEN}/sendMessage`;
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: message
        })
    }).catch(err => console.error('Ошибка отправки в Telegram:', err));
}

// Утилиты для модальных окон
function showAlert(message) {
    document.getElementById('customContent').innerHTML = `<h2>${translations[userLanguage].alertTitle}</h2><p>${message}</p><button class="buy-button" onclick="document.getElementById('customModal').style.display = 'none'">${translations[userLanguage].close}</button>`;
    document.getElementById('customModal').style.display = 'flex';
}

function showConfirm(message, onYes, onNo) {
    document.getElementById('confirmContent').innerHTML = `
        <h2>${translations[userLanguage].confirmTitle}</h2>
        <p>${message}</p>
        <button class="buy-button" onclick="(${onYes.toString()})();document.getElementById('confirmModal').style.display = 'none'">${translations[userLanguage].yes}</button>
        <button class="buy-button" onclick="(${onNo.toString()})();document.getElementById('confirmModal').style.display = 'none'">${translations[userLanguage].no}</button>`;
    document.getElementById('confirmModal').style.display = 'flex';
}

function showInput(message, callback) {
    document.getElementById('customContent').innerHTML = `
        <h2>${translations[userLanguage].inputTitle}</h2>
        <p>${message}</p>
        <textarea id="inputText"></textarea>
        <button class="buy-button" onclick="(${callback.toString()})(document.getElementById('inputText').value);document.getElementById('customModal').style.display = 'none'">${translations[userLanguage].confirmButton}</button>
        <button class="buy-button" onclick="document.getElementById('customModal').style.display = 'none'">${translations[userLanguage].cancelButton}</button>`;
    document.getElementById('customModal').style.display = 'flex';
}

function showPromoDetails() {
    showAlert(translations[userLanguage].promoBanner);
}

// Загрузка пользователя из локального хранилища
window.onload = () => {
    const lastUser = localStorage.getItem('lastUser');
    if (lastUser) {
        const user = registeredUsers.find(u => u.nickname === lastUser);
        if (user) {
            currentUser = user.nickname;
            userLanguage = user.language;
            initUI(); // Если пользователь уже есть, сразу инициализируем интерфейс
        }
    } else if (registeredUsers.length > 0) {
        // Если есть зарегистрированные пользователи, но нет lastUser, берём первого
        currentUser = registeredUsers[0].nickname;
        userLanguage = registeredUsers[0].language;
        localStorage.setItem('lastUser', currentUser);
        initUI();
    } else {
        // Если нет ни одного пользователя, показываем регистрацию
        showRegistrationModal();
    }
};
};
