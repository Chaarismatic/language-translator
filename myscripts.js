const inputText = document.querySelector(".input-field"),
      outputText = document.querySelector(".output-field"),
      swapLangBtn = document.querySelector(".swap-button"),
      langDropdowns = document.querySelectorAll("select"),
      actionIcons = document.querySelectorAll(".action-buttons i"),
      translateButton = document.querySelector(".translate-button");

// Language List with Codes
const languageList = {
    "kfy-IN": "Kumaoni",
    "en-GB": "English",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "de-DE": "German",
    "hi-IN": "Hindi",
    "bn-IN": "Bengali",
    "zh-CN": "Chinese",
    "ja-JP": "Japanese",
    "ru-RU": "Russian",
    "ko-KR": "Korean",
    "ar-SA": "Arabic",
    "it-IT": "Italian",
    "pt-PT": "Portuguese",
    "tr-TR": "Turkish",
    "nl-NL": "Dutch",
    "sv-SE": "Swedish",
    "pl-PL": "Polish",
    "fi-FI": "Finnish",
    "th-TH": "Thai",
    "vi-VN": "Vietnamese",
    "ta-LK": "Tamil",
    "te-IN": "Telugu",
    "uk-UA": "Ukrainian",
    "he-IL": "Hebrew",
    "ur-PK": "Urdu",
    "pa-IN": "Punjabi",
    "gu-IN": "Gujarati",
    "mr-IN": "Marathi",
    "si-LK": "Sinhala",
    "ne-NP": "Nepali",
    "id-ID": "Indonesian",
    "ms-MY": "Malay",
    "my-MM": "Burmese",
    "km-KM": "Khmer",
    "lo-LA": "Lao",
    "fa-IR": "Persian",
    "el-GR": "Greek",
    "cs-CZ": "Czech",
    "sk-SK": "Slovak",
    "sl-SI": "Slovenian",
    "hu-HU": "Hungarian",
    "ro-RO": "Romanian",
    "bg-BG": "Bulgarian",
    "sr-RS": "Serbian",
    "hr-HR": "Croatian",
    "lt-LT": "Lithuanian",
    "lv-LV": "Latvian",
    "et-EE": "Estonian",
    "is-IS": "Icelandic",
    "af-ZA": "Afrikaans",
    "sw-SZ": "Swahili",
    "xh-ZA": "Xhosa",
    "zu-ZA": "Zulu",
    "sn-ZW": "Shona",
    "so-SO": "Somali",
    "yo-NG": "Yoruba",
    "ha-NE": "Hausa"
};

// Populate language selection dropdowns
langDropdowns.forEach((dropdown, index) => {
    for (let code in languageList) {
        let isSelected = (index === 0 && code === "en-GB") || (index === 1 && code === "bn-IN") ? "selected" : "";
        let optionTag = `<option ${isSelected} value="${code}">${languageList[code]}</option>`;
        dropdown.insertAdjacentHTML("beforeend", optionTag);
    }
});

// Swap input and output languages
swapLangBtn.addEventListener("click", () => {
    let tempText = inputText.value,
        tempLang = langDropdowns[0].value;

    inputText.value = outputText.value;
    outputText.value = tempText;
    langDropdowns[0].value = langDropdowns[1].value;
    langDropdowns[1].value = tempLang;
});

// Clear translation if input is empty
inputText.addEventListener("keyup", () => {
    if (!inputText.value.trim()) outputText.value = "";
});

// Fetch and display translation
translateButton.addEventListener("click", () => {
    let text = inputText.value.trim(),
        fromLang = langDropdowns[0].value,
        toLang = langDropdowns[1].value;

    if (!text) return;

    outputText.setAttribute("placeholder", "Processing...");

let apiUrl = `http://localhost:5000/translate?text=${encodeURIComponent(text)}&fromLang=${fromLang}&toLang=${toLang}`;


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let translatedText = data.responseData.translatedText;
            outputText.value = translatedText;

            if (data.matches.length > 0 && data.matches[0].id === 0) {
                outputText.value = data.matches[0].translation;
            }

            outputText.setAttribute("placeholder", "Translation done!");
        })
        .catch(() => {
            outputText.setAttribute("placeholder", "Translation error!");
        });
});

// Handle copy & speech actions
actionIcons.forEach(icon => {
    icon.addEventListener("click", (event) => {
        let target = event.target;

        if (!inputText.value.trim() && !outputText.value.trim()) return;

        if (target.classList.contains("fa-copy")) {
            let textToCopy = target.classList.contains("copy-input") ? inputText.value : outputText.value;
            navigator.clipboard.writeText(textToCopy);
        } else {
            let utterance = new SpeechSynthesisUtterance(target.classList.contains("speaker-input") ? inputText.value : outputText.value);
            utterance.lang = target.classList.contains("speaker-input") ? langDropdowns[0].value : langDropdowns[1].value;

            setTimeout(() => speechSynthesis.speak(utterance), 300);
        }
    });
});