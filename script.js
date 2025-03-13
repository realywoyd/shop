let balance = 0;
let orderCount = 0;
let referralCount = 0;
let referralDeposits = 0;
let orderHistory = [];
let selectedCity = 'all';
let selectedDistrict = 'all';
let currentUser = null;
let userLanguage = 'en';
let mailMessages = [];
let pendingPayments = {};
let BTC_RATE = 2000000;
const MIN_DEPOSIT = 1000;
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

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
        phuketDistricts: {
            "Patong": "Patong",
            "Karon": "Karon",
            "Phuket Town": "Phuket Town",
            "Kata": "Kata",
            "Chalong": "Chalong",
            "Kamala": "Kamala",
            "Mai Khao": "Mai Khao"
        },
        pattayaDistricts: {
            "Central Pattaya": "Central Pattaya",
            "Jomtien": "Jomtien",
            "Naklua": "Naklua",
            "South Pattaya": "South Pattaya",
            "Wong Amat": "Wong Amat",
            "Pratumnak": "Pratumnak"
        },
        bangkokDistricts: {
            "Sukhumvit": "Sukhumvit",
            "Khao San": "Khao San",
            "Silom": "Silom",
            "Chatuchak": "Chatuchak",
            "Ratchada": "Ratchada",
            "Banglamphu": "Banglamphu"
        },
        samuiDistricts: {
            "Chaweng": "Chaweng",
            "Lamai": "Lamai",
            "Bo Phut": "Bo Phut",
            "Maenam": "Maenam",
            "Lipa Noi": "Lipa Noi",
            "Bang Po": "Bang Po"
        },
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
        courierPay: "Salary: 15,000 - 25,000 ฿ per month.",
        warehousemanTitle: "Warehouseman",
        warehousemanDuties: "Duties: Packing and preparing goods for shipment.",
        warehousemanPay: "Salary: 20,000 - 30,000 ฿ per month.",
        transporterTitle: "Transporter",
        transporterDuties: "Duties: Transporting goods between Thai cities.",
        transporterPay: "Salary: 30,000 - 50,000 ฿ per month.",
        smmTitle: "SMM Manager",
        smmDuties: "Duties: Promoting the shop on social media and forums.",
        smmPay: "Salary: 25,000 - 40,000 ฿ per month + bonuses.",
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
        depositInstruction: "Send {amount} ฿ (~{cryptoAmount} BTC) to this address:",
        depositFinal: "Funds will be credited to your balance once the payment is received.",
        depositExpiry: "Address expires in 30 minutes.",
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
        reviewsTitle: "Latest reviews (max 10):",
        noReviews: "No reviews yet.",
        confirmPayment: "Confirm Payment",
        referralSystemDescription: "Invite friends - get stuff!",
        referralSystemDetails: "Invite friends and get stuff! 5 friends = 0.5g amphetamine, 10 friends = 0.5g cocaine (MQ), 25 friends = 1g cocaine (Fishscale). Important! To receive the stuff, each friend must deposit at least 1000 THB.",
        anonymous: "Anonymous",
        moderatorResponsePositive: "We're glad you liked it! Come back to us again! Activated a promo code for you (as discussed earlier).",
        moderatorResponseNegative: "We're sorry we didn't meet your expectations. We'll make the service better. Activated a promo code for you (as discussed earlier). Come back to us again!"
    },
    ru: {
        // ... аналогично для русского и тайского языков
    },
    th: {
        // ... аналогично для русского и тайского языков
    }
};

// Остальной JavaScript код (функции, логика и т.д.)
