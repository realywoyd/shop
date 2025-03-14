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
    weed: { 1: 1034 },
    hash: { 1: 1526, 2: 1213, 3: 874, 4: 563, 5: 1458 },
    coke: { 1: 8072, 2: 7028, 3: 5896, 4: 5138, 5: 9522 },
    amph: { 1: 1103, 2: 1054, 3: 927, 4: 504, 5: 1541 },
    meth: { 1: 1573, 2: 1223, 3: 907, 4: 476, 5: 1767 },
    meph: { 1: 2052, 2: 1873, 3: 1734, 4: 1620, 5: 2157 },
    alpha: { 1: 1204, 2: 1007, 3: 849, 4: 342, 5: 1396 },
    lsd: { 1: 637, 2: 528, 3: 444, 4: 321, 5: 718 },
    mdma: { 1: 2134, 2: 1988, 3: 631, 4: 1739, 5: 352 },
    heroin: { 1: 2032, 2: 1827, 3: 1398, 4: 758, 5: 2463 }
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
            name: "Pink Hearts (HQ)", 
            positions: generatePositions('mdma', 2, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Розовые сердца, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший МДМА, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный подъём, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Blue Stars (MQ)", 
            positions: generatePositions('mdma', 3, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Средний кайф, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный МДМА, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой приход, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Street Pills (LQ)", 
            positions: generatePositions('mdma', 4, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный МДМА, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Слабый и грязный, фу. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "За копейки ок, кайфанул! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        5: { 
            name: "Golden Bliss (VHQ)", 
            positions: generatePositions('mdma', 5, 'cokeMephAlphaMdma'), 
            reviews: [
                { text: "Золотой кайф, элитный МДМА! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Переоценённый, не впечатлил. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Топовый МДМА, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    },
    heroin: {
        1: { 
            name: "Afghan Brown (VHQ)", 
            positions: generatePositions('heroin', 1, 'default'), 
            reviews: [
                { text: "Афганский топ, чистейший кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 15%!" },
                { text: "Слабовато для VHQ, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Элитный герыч, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный заряд, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        },
        2: { 
            name: "Golden Tar (HQ)", 
            positions: generatePositions('heroin', 2, 'default'), 
            reviews: [
                { text: "Золотая смола, стабильный кайф! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Грязноватый, не зашёл. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Хороший герыч, норм приход! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый эффект, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Приятный кайф, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" }
            ]
        },
        3: { 
            name: "Brown Sugar (MQ)", 
            positions: generatePositions('heroin', 3, 'default'), 
            reviews: [
                { text: "Средний кайф, за свои бабки норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Слабый и пыльный, не то. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 20%." },
                { text: "Приятный герыч, середнячок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
                { text: "Не впечатлил, ожидал больше. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 15%." },
                { text: "Неплохой приход, ок! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" }
            ]
        },
        4: { 
            name: "Street Dust (LQ)", 
            positions: generatePositions('heroin', 4, 'default'), 
            reviews: [
                { text: "Дёшево и работает, пойдёт! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" },
                { text: "Полный шлак, не берите. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Бюджетный герыч, норм! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 5%!" },
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
                { text: "Топовый герыч, шикарно! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё! Активировали промокод на 10%!" },
                { text: "Дорого и не оправдало. — Аноним", date: getRandomDate(), mod: "Сожалеем, что вы недовольны, будем работать над улучшениями! Активировали промокод на 25%." },
                { text: "Мощный эффект, рекомендую! — Аноним", date: getRandomDate(), mod: "Рады, что вам понравилось, заходите ещё!" }
            ]
        }
    }
};

function generatePositions(product, variant, weightKey) {
    const positions = {};
    const availableWeights = weights[weightKey] || weights.default;
    for (const city in cities) {
        const cityFactor = city === 'samui' ? 1.5 : 1; // Множитель x1.5 для Самуи
        for (const district in cities[city]) {
            const availableWeight = availableWeights[Math.floor(Math.random() * availableWeights.length)];
            const basePrice = basePrices[product][variant];
            const price = Math.round(basePrice * availableWeight * cityFactor);
            positions[`${city}-${district}`] = {
                weight: availableWeight,
                price: price,
                available: Math.random() > 0.3 // 70% шанс наличия
            };
        }
    }
    return positions;
}

function sendTelegramMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${BOT_B_TOKEN}/sendMessage`;
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' })
    }).catch(err => console.error('Ошибка отправки в Telegram:', err));
}

function showAlert(title, message) {
    Telegram.WebApp.showAlert(`${title}\n\n${message}`);
}

function showConfirm(title, message, callback) {
    Telegram.WebApp.showConfirm(`${title}\n\n${message}`, callback);
}

function showPopup(title, message, buttons) {
    Telegram.WebApp.showPopup({
        title: title,
        message: message,
        buttons: buttons
    });
}

function updateUI() {
    const t = translations[userLanguage];
    document.querySelector('#promo-banner').innerText = t.promoBanner;
    document.querySelector('#header-text').innerText = t.headerText;
    document.querySelector('#catalog-btn').innerText = t.catalogButton;
    document.querySelector('#vacancies-btn').innerText = t.vacanciesButton;
    document.querySelector('#mail-btn').innerText = t.mailButton;

    document.querySelector('#balance').innerText = `${balance} ฿`;
    document.querySelector('#profile-name').innerText = `${t.profileNameLabel}${currentUser}`;
    document.querySelector('#orders').innerText = `${t.ordersLabel}${orderCount}`;
    document.querySelector('#referrals').innerText = `${t.referralsLabel}${referralCount}`;
    document.querySelector('#ref-link').innerText = `${t.refLinkLabel}t.me/DarkThailandBot?start=${currentUser}`;

    const citySelect = document.querySelector('#city-select');
    citySelect.innerHTML = `
        <option value="all">${t.allCitiesOption}</option>
        <option value="phuket">${t.phuketOption}</option>
        <option value="pattaya">${t.pattayaOption}</option>
        <option value="bangkok">${t.bangkokOption}</option>
        <option value="samui">${t.samuiOption}</option>
    `;
    citySelect.value = selectedCity;

    const districtSelect = document.querySelector('#district-select');
    districtSelect.innerHTML = `<option value="all">${t.allDistrictsOption}</option>`;
    if (selectedCity !== 'all' && t[`${selectedCity}Districts`]) {
        for (const district in t[`${selectedCity}Districts`]) {
            districtSelect.innerHTML += `<option value="${district}">${t[`${selectedCity}Districts`][district]}</option>`;
        }
    }
    districtSelect.value = selectedDistrict;

    updateCatalog();
    updateOrderHistory();
    updateMail();
}

function updateCatalog() {
    const t = translations[userLanguage];
    const catalog = document.querySelector('#catalog');
    catalog.innerHTML = '';
    for (const product in products) {
        for (const variant in products[product]) {
            const item = products[product][variant];
            const positions = item.positions;
            let available = false;
            let priceRange = { min: Infinity, max: 0 };

            for (const pos in positions) {
                const [city, district] = pos.split('-');
                if ((selectedCity === 'all' || city === selectedCity) && 
                    (selectedDistrict === 'all' || district === selectedDistrict)) {
                    if (positions[pos].available) {
                        available = true;
                        priceRange.min = Math.min(priceRange.min, positions[pos].price);
                        priceRange.max = Math.max(priceRange.max, positions[pos].price);
                    }
                }
            }

            const card = document.createElement('div');
            card.className = 'catalog-item';
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p>${t.positionPrice} ${priceRange.min === priceRange.max ? priceRange.min : `${priceRange.min} - ${priceRange.max}`} ฿</p>
                <p>${t.positionAvailability} ${available ? t.inStock : t.outOfStock}</p>
                <button class="buy-btn" data-product="${product}" data-variant="${variant}" ${!available ? 'disabled' : ''}>${t.buyButton}</button>
                <button class="preorder-btn" data-product="${product}" data-variant="${variant}">${t.preorderButton}</button>
                <div class="reviews">
                    <h4>${t.reviewsTitle}</h4>
                    ${item.reviews.slice(0, 3).map(r => `<p><b>${r.date}</b>: ${r.text}${r.mod ? `<br><i>${r.mod}</i>` : ''}</p>`).join('') || t.noReviews}
                </div>
            `;
            catalog.appendChild(card);
        }
    }
}

function updateOrderHistory() {
    const t = translations[userLanguage];
    const orderList = document.querySelector('#order-list');
    orderList.innerHTML = orderHistory.length ? orderHistory.map(o => `
        <li>${o.date}: ${o.product} (${o.weight}g) - ${o.price} ฿, ${o.city}, ${o.district}</li>
    `).join('') : `<li>${t.orderListEmpty}</li>`;
}

function updateMail() {
    const t = translations[userLanguage];
    const mailList = document.querySelector('#mail-list');
    mailList.innerHTML = mailMessages.length ? mailMessages.map(m => `
        <li><b>${m.date}</b>: ${m.text}</li>
    `).join('') : `<li>${t.mailListEmpty}</li>`;
}

function handleRegistration() {
    const t = translations[userLanguage];
    const nickname = document.querySelector('#reg-nickname').value.trim();
    if (!nickname) {
        showAlert(t.alertTitle, t.regErrorEmpty);
        return;
    }
    if (registeredUsers.some(u => u.name === nickname)) {
        showAlert(t.alertTitle, t.regErrorTaken);
        return;
    }
    currentUser = nickname;
    userLanguage = document.querySelector('#reg-language').value;
    registeredUsers.push({ name: nickname, lang: userLanguage });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    document.querySelector('#reg-modal').style.display = 'none';
    showAlert(t.alertTitle, t.welcomeMessage.replace('{user}', currentUser));
    updateUI();
}

function handleDeposit() {
    const t = translations[userLanguage];
    const amount = parseInt(document.querySelector('#deposit-amount').value);
    const crypto = document.querySelector('#crypto-select').value;
    if (isNaN(amount) || amount < MIN_DEPOSIT) {
        showAlert(t.alertTitle, t.minDepositError);
        return;
    }
    const cryptoAmount = (amount / cryptoRates[crypto]).toFixed(6);
    const address = testAddresses[crypto];
    const message = `
        ${t.depositInstruction.replace('{amount}', amount).replace('{cryptoAmount}', cryptoAmount).replace('{crypto}', crypto)}\n
        <b>${address}</b>\n
        ${t.depositFinal}\n
        ${t.depositExpiry}
    `;
    showPopup(t.depositTitle, message, [
        { id: 'confirm', type: 'default', text: t.confirmPayment },
        { id: 'cancel', type: 'cancel', text: t.cancelButton }
    ], (buttonId) => {
        if (buttonId === 'confirm') {
            pendingPayments[address] = { amount, crypto, timestamp: Date.now() };
            sendTelegramMessage(ADMIN_CHAT_ID, `Новый запрос на пополнение:\nПользователь: ${currentUser}\nСумма: ${amount} ฿\nКрипта: ${cryptoAmount} ${crypto}\nАдрес: ${address}`);
            showAlert(t.alertTitle, t.paymentPending);
            document.querySelector('#deposit-modal').style.display = 'none';
        }
    });
}

function handlePurchase(product, variant, isPreorder = false) {
    const t = translations[userLanguage];
    const positions = products[product][variant].positions;
    let availablePosition = null;
    for (const pos in positions) {
        const [city, district] = pos.split('-');
        if ((selectedCity === 'all' || city === selectedCity) && 
            (selectedDistrict === 'all' || district === selectedDistrict) && 
            positions[pos].available) {
            availablePosition = positions[pos];
            availablePosition.city = city;
            availablePosition.district = district;
            break;
        }
    }
    if (!availablePosition) return;

    let price = availablePosition.price;
    if (isPreorder) price = Math.round(price * 1.3); // +30% за предзаказ

    if (balance < price) {
        showConfirm(t.confirmTitle, t.insufficientFunds, (confirmed) => {
            if (confirmed) document.querySelector('#deposit-modal').style.display = 'block';
        });
        return;
    }

    balance -= price;
    orderCount++;
    positions[`${availablePosition.city}-${availablePosition.district}`].available = false;
    orderHistory.unshift({
        date: new Date().toLocaleString(),
        product: products[product][variant].name,
        weight: availablePosition.weight,
        price: price,
        city: availablePosition.city,
        district: availablePosition.district
    });

    const cityName = t[`${availablePosition.city}Option`];
    const districtName = t[`${availablePosition.city}Districts`][availablePosition.district];
    const orderDetails = `
        Пользователь: ${currentUser}
        Товар: ${products[product][variant].name}
        Вес: ${availablePosition.weight}г
        Цена: ${price} ฿
        Город: ${cityName}
        Район: ${districtName}
        Координаты: ${cities[availablePosition.city][availablePosition.district].lat}, ${cities[availablePosition.city][availablePosition.district].lon}
        Описание: ${cities[availablePosition.city][availablePosition.district].desc}
    `;
    sendTelegramMessage(ADMIN_CHAT_ID, `Новый заказ:\n${orderDetails}`);
    mailMessages.unshift({ date: new Date().toLocaleString(), text: `Ваш заказ (${products[product][variant].name}, ${availablePosition.weight}г) оформлен! Координаты: ${cities[availablePosition.city][availablePosition.district].lat}, ${cities[availablePosition.city][availablePosition.district].lon}. Описание: ${cities[availablePosition.city][availablePosition.district].desc}` });

    showAlert(t.alertTitle, isPreorder ? t.preorderPlaced : t.paymentSuccess);
    updateUI();
}

function handleJobApplication(job) {
    const t = translations[userLanguage];
    Telegram.WebApp.showPopup({
        title: t.applyJobPrompt.replace('{job}', job),
        message: '',
        buttons: [{ id: 'submit', type: 'default', text: t.confirmButton }, { id: 'cancel', type: 'cancel', text: t.cancelButton }],
        input: true
    }, (buttonId, resume) => {
        if (buttonId === 'submit' && resume) {
            sendTelegramMessage(ADMIN_CHAT_ID, `Заявка на вакансию "${job}"\nПользователь: ${currentUser}\nРезюме: ${resume}`);
            showAlert(t.alertTitle, t.applyJobAlert.replace('{job}', job));
        }
    });
}

document.querySelector('#reg-submit').addEventListener('click', handleRegistration);
document.querySelector('#deposit-submit').addEventListener('click', handleDeposit);
document.querySelector('#city-select').addEventListener('change', (e) => {
    selectedCity = e.target.value;
    selectedDistrict = 'all';
    updateUI();
});
document.querySelector('#district-select').addEventListener('change', (e) => {
    selectedDistrict = e.target.value;
    updateUI();
});
document.querySelector('#catalog-btn').addEventListener('click', () => {
    document.querySelector('#catalog-section').style.display = 'block';
    document.querySelector('#vacancies-section').style.display = 'none';
    document.querySelector('#mail-section').style.display = 'none';
});
document.querySelector('#vacancies-btn').addEventListener('click', () => {
    document.querySelector('#catalog-section').style.display = 'none';
    document.querySelector('#vacancies-section').style.display = 'block';
    document.querySelector('#mail-section').style.display = 'none';
});
document.querySelector('#mail-btn').addEventListener('click', () => {
    document.querySelector('#catalog-section').style.display = 'none';
    document.querySelector('#vacancies-section').style.display = 'none';
    document.querySelector('#mail-section').style.display = 'block';
});
document.querySelector('#deposit-btn').addEventListener('click', () => {
    document.querySelector('#deposit-modal').style.display = 'block';
});
document.querySelector('#close-deposit').addEventListener('click', () => {
    document.querySelector('#deposit-modal').style.display = 'none';
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('buy-btn')) {
        const product = e.target.dataset.product;
        const variant = e.target.dataset.variant;
        handlePurchase(product, variant);
    } else if (e.target.classList.contains('preorder-btn')) {
        const product = e.target.dataset.product;
        const variant = e.target.dataset.variant;
        handlePurchase(product, variant, true);
    } else if (e.target.classList.contains('apply-btn')) {
        const job = e.target.dataset.job;
        handleJobApplication(job);
    }
});

if (!currentUser) {
    document.querySelector('#reg-modal').style.display = 'block';
} else {
    updateUI();
}

// Симуляция проверки оплаты (для теста)
setInterval(() => {
    for (const address in pendingPayments) {
        const payment = pendingPayments[address];
        if (Date.now() - payment.timestamp > 30 * 60 * 1000) { // 30 минут
            delete pendingPayments[address];
            continue;
        }
        if (Math.random() > 0.7) { // 30% шанс подтверждения для теста
            balance += payment.amount;
            mailMessages.unshift({ date: new Date().toLocaleString(), text: `Ваш баланс пополнен на ${payment.amount} ฿ через ${payment.crypto}!` });
            sendTelegramMessage(ADMIN_CHAT_ID, `Пополнение подтверждено:\nПользователь: ${currentUser}\nСумма: ${payment.amount} ฿\nКрипта: ${payment.crypto}`);
            delete pendingPayments[address];
            updateUI();
        }
    }
}, 60 * 1000); // Проверка каждую минуту
