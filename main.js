const typing_form = document.querySelector(".typing_form");
const chat_list = document.querySelector(".chat_list");

const API_Key = "AIzaSyB8OO6gX7KehKMDT_xJRU_JbuZ3zFSMLgk";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_Key}`;

const showTypingEffect = (text, textElement) => {
    const words = text.split(" ");
    let currentwordIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerText += (currentwordIndex === 0 ? "" : " ") + words[currentwordIndex++];
        if (currentwordIndex === words.length) {
            clearInterval(typingInterval);
        }

        window.scrollTo(0, chat_list.scrollHeight);
    }, 75);
};

const genrateAPIResponse = async (div, userMassage) => {
    const textElement = div.querySelector(".text");

    const arabicKeywords = [
        "مبرمجك",
        "من برمجك",
        "من قام ببرمجتك",
        "من أنشأك",
        "من الذي برمجك",
        "من كتب الكود الخاص بك",
        "من صممك",
        "من هو مبرمجك",
        "من انت",
        "من صنعك",
        "من خلفك",
        "من وراء تصميمك",
        "مَن هو مبرمجك",
        "هل يمكنك إخباري عن مبرمجك",
        "كيف تم إنشاؤك",
        "ما هو مصدر برمجتك",
        "أنت مبرمجك مين",
        "مين اللي عملك",
        "إنت من برمجك",
        "من قام ببرمجتك",
        "من صممك",
        "أنت متبرمج منين",
        "إنت جاي منين",
        "من هو اللي برمجك",
        "مين كتب الكود بتاعك",
        "أنت متصمم إزاي",
        "إنت مين اللي عملك",
        "من هو مبرمجك",
        "يعني إنت منين جاي",
        "إنت متبرمج على إيد مين",
        "هو في حد وراء تصميمك",
        "إنت تتكلم عربي ليه",
        "إزاي اتصممت",
        "إنت جاي منين",
        "من أبدع في تصميمك",
        "أنت مبرمج من قبل مين",
        "انت مين",
        "مين اللي عاملك",
        "مين اللي صانعك",
        "اهلا شات",
        "هاي شات"
    ];    

    const englishKeywords = [
        "Who programmed you",
        "Who created you",
        "Who designed you",
        "Who is your programmer",
        "Who made you",
        "Who built you",
        "Who is behind your code",
        "Who is responsible for your creation",
        "Can you tell me about your programmer",
        "What is your source code",
        "Who coded you",
        "Who developed you",
        "How were you created",
        "Who is the genius behind you",
        "Who wrote your code",
        "Where did you come from",
        "Who is your creator",
        "Who invented you",
        "Who wrote your programming",
        "What’s your origin"
    ];

    // تحديد اللغة بناءً على وجود أحرف عربية أو إنجليزية
    const isArabic = /[\u0600-\u06FF]/.test(userMassage);
    const keywords = isArabic ? arabicKeywords : englishKeywords;

    // تحقق مما إذا كانت الرسالة تحتوي على أي من الكلمات المفتاحية
    const containsKeyword = keywords.some(keyword => userMassage.includes(keyword));

    try {
        // إذا كانت الرسالة تحتوي على الكلمات المفتاحية، اعرض رد مخصص
        if (containsKeyword) {
            const responseLanguage = isArabic ? "أنا تم برمجتي بواسطة [Mohamed Walid]" : "I was programmed by [Your Name Here]";
            showTypingEffect(responseLanguage, textElement);
            return; // الخروج من الدالة بعد إرسال الرد
        }

        // إذا لم تحتوي الرسالة على الكلمات المفتاحية، استدعاء الـ API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMassage }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const apiResponse = data?.candidates[0]?.content?.parts[0]?.text.replace(/\*\*(.*?)\*\*/g, '$1');

        console.log(apiResponse);

        // عرض النتيجة من API
        showTypingEffect(apiResponse, textElement);

    } catch (error) {
        console.error(error);
        textElement.innerText = "حدث خطأ، يرجى المحاولة لاحقًا.";
    } finally {
        div.classList.remove("loading");
    }
};

const copyMassage = (copy_Btn) => {
    const massageText = copy_Btn.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(massageText);
    copy_Btn.innerText = "تم النسخ";

    setTimeout(() => copy_Btn.innerText = "نسخ", 1000);
};

const showLoading = (userMassage) => {
    const html = `
                <div class="massage_content">
                    <img src="images/Logo.png" alt="user">
                    <p class="text"></p>
                    <div class="loading_indicoator">
                        <div class="loading_Bar"></div>
                        <div class="loading_Bar"></div>
                        <div class="loading_Bar"></div>
                    </div>
                </div>
                <span onClick="copyMassage(this)" class="material-symbols-outlined">
                    copy_all
                </span>
    `;
    const div = document.createElement("div");
    div.classList.add("massage", "incoming", "loading");

    div.innerHTML = html;

    chat_list.appendChild(div);

    window.scrollTo(0, chat_list.scrollHeight);

    // استدعاء الدالة مع القيمة الصحيحة
    genrateAPIResponse(div, userMassage);
};

const handleOutGoingChat = () => {
    const userMassage = document.querySelector(".typing-input").value.trim();
    console.log(userMassage);

    if (!userMassage) return;

    const html = `
    <div class="massage_content">
        <img src="images/user-ai.png" alt="user">
        <p class="text"></p>
    </div>
    `;
        
    const div = document.createElement("div");
    div.classList.add("massage", "outgoing");

    div.innerHTML = html;

    div.querySelector(".text").innerHTML = userMassage;

    chat_list.appendChild(div);

    typing_form.reset();

    window.scrollTo(0, chat_list.scrollHeight);

    // استدعاء عرض التحميل مع الرسالة
    showLoading(userMassage);
};

typing_form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutGoingChat();
});
