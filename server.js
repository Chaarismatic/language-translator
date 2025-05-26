const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = 5000;

// OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log("OpenAI API Key Loaded:", OPENAI_API_KEY ? "YES" : "NO");
const { OpenAI } = require("openai");         // <-- npm install openai
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });


app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// Rule-based Kumaoni-English translation dictionary function
/****************  Rule-based Kumaoni translate  *****************/
function kumaoniTranslate(text) {
  const dict = {
    "hello": "राम राम",
    "how are you": "तुम कस भया",
    "thank you": "धन्यवाद भुला",
    "goodbye": "फ़िर मिलुन होई",
    "what is your name?": "त्येर नाम के भेई",
    "where are you from?": "तू काक भई दाज्यू",
    "i need help.": "ओ भुला जरा म्यर मदद करदे तो",
    "can you speak slowly?": "ओ तू हल्क बुला हान",
    "please repeat that.": "फेर कह दे।",
    "i dont understand.": "मैं न बुझ पायो।",
    "thank you very much.": "धन्यवाद भुला।",
    "i am hungry.": "म्यर भूख लागी।",
    "where is the bathroom?": "पाखान घर कां छै?",
    "how much does this cost?": "यो कति को छ?",
    "i like this.": "म्यर यो मन परो।",
    "i dont like that.": "म्यर उ मन न लागो।",
    "what time is it?": "समय के भया?",
    "i am tired.": "मैं थाकी गयो।",
    "please call a doctor.": "कृपया डाक्टर बुलाओ।",
    "can you help me?": "तू म्यर मदद कर सकछ?",
    "i am learning english.": "मैं इंग्लिश सिखण लाग छु।",
    "have a nice day!": "त्येर दिन शुभ हो!",
    "see you tomorrow.": "भोलि भेटुला।",
    "hello": "राम राम",
    "goodbye": "फ़िर मिलुन होई",
    "please": "कृपया",
    "thank you": "धन्यवाद भुला",
    "yes": "हां",
    "no": "ना",
    "good": "ठीक",
    "bad": "खराब",
    "happy": "खुश",
    "sad": "उदास",
    "water": "पानी",
    "food": "खान",
    "house": "घर",
    "school": "स्कूल",
    "friend": "मित्र",
    "family": "परिवार",
    "love": "माया",
    "day": "दिन",
    "night": "रात",
    "morning": "बिहान",
    "evening": "सांझ",
    "sun": "सूरज",
    "moon": "चंद्रमा",
    "star": "तारा",
    "sky": "आसमान",
    "rain": "बर्षा",
    "snow": "हिमपात",
    "wind": "हावा",
    "fire": "आग",
    "earth": "धरती",
    "tree": "वृक्ष",
    "flower": "फूल",
    "grass": "घास",
    "mountain": "पहाड़",
    "river": "नदी",
    "lake": "झील",
    "sea": "समुंदर",
    "fish": "माछ",
    "bird": "पंछी",
    "dog": "कुकुर",
    "cat": "बिल्ली",
    "cow": "गाय",
    "horse": "घोड़ा",
    "man": "मानुस",
    "woman": "नारी",
    "boy": "ल्वाड़ो",
    "girl": "ल्वाड़ी",
    "child": "बच्चा",
    "baby": "छानु",
    "mother": "आमा",
    "father": "बुबा",
    "brother": "भुला",
    "sister": "बहिनी",
    "uncle": "काका",
    "aunt": "काकी",
    "doctor": "डाक्टर",
    "teacher": "गुरुजी",
    "student": "छात्र",
    "work": "काम",
    "play": "खेल",
    "walk": "हिलना",
    "run": "दौड़",
    "jump": "कूद",
    "sit": "बैस",
    "stand": "उठ",
    "sleep": "सुत",
    "eat": "खाणु",
    "drink": "पिनु",
    "read": "पढणु",
    "write": "लिखणु",
    "speak": "बोलणु",
    "listen": "सुणणु",
    "see": "देखणु",
    "hear": "सुणणु",
    "think": "सोचणु",
    "know": "जानणु",
    "want": "चाहनु",
    "need": "जरुरत",
    "come": "आणु",
    "go": "जानु",
    "give": "दिनु",
    "take": "लिनु",
    "buy": "किनणु",
    "sell": "बेचणु",
    "open": "खोलनु",
    "close": "बन्द करनु",
    "start": "सुरु करनु",
    "stop": "रोकणु",
    "big": "ठुलो",
    "small": "सानो",
    "long": "लम्बो",
    "short": "छोटो",
    "fast": "छिटो",
    "slow": "ढिलो",
    "new": "नयाँ",
    "old": "पुरानो",
    "young": "जवान",
    "hot": "तातो",
    "cold": "चिसो",
    "clean": "सफाइ",
    "dirty": "फोहोर",
    "light": "उज्यालो",
    "dark": "अँध्यारो",
    "heavy": "गह्रौं",
    "easy": "सजिलो",
    "hard": "कठिन",
    "left": "बायाँ",
    "right": "दायाँ",
    "up": "माथि",
    "down": "तल",
    "first": "पहिलो",
    "last": "अन्तिम",
    "early": "चाँडो",
    "late": "ढिलो",
    "today": "आज",
    "tomorrow": "भोलि",
    "yesterday": "हिजो",
    "week": "हप्ता",
    "month": "महिना",
    "year": "बर्ष",
    "time": "समय",
    "money": "पैसा",
    "car": "गाडी",
    "bus": "बस",
    "train": "रेल",
    "road": "बाटो",
    "city": "सहर",
    "village": "गाउँ",
    "country": "देश",
    "language": "भाषा",
    "book": "किताब",
    "pen": "कलम",
    "paper": "कागज",
    "chair": "कुर्सी",
    "table": "मेच",
    "door": "ढोका",
    "window": "झ्याल",
    "bed": "खाट",
    "phone": "फोन",
    "computer": "कम्प्युटर",
    "music": "संगीत",
    "movie": "चलचित्र",
    "game": "खेल",
    "holiday": "बिदा",
    "party": "पार्टी",
    "hope": "आशा",
    "dream": "सपना"
  };
  return dict[text.toLowerCase().trim()] || "[अनुवाद उपलब्ध नहीं]";
}

/****************  SINGLE /translate route  *********************/
app.get("/translate", async (req, res) => {
    const { text, fromLang, toLang } = req.query;

    console.log("Incoming /translate request");
    console.log("text:", text);
    console.log("fromLang:", fromLang);
    console.log("toLang:", toLang);

    if (!text || !fromLang || !toLang) {
        console.log("Missing query params");
        return res.status(400).json({ error: "Missing required query parameters" });
    }

    // Rule-based Kumaoni translation
    if (fromLang === "en-GB" && toLang === "kfy-IN") {
        console.log("Matched rule-based translation route (English → Kumaoni)");
        const translatedText = kumaoniTranslate(text, fromLang, toLang);
        return res.json({
            responseData: { translatedText },
            matches: [{ id: 0, translation: translatedText }]
        });
    }

    // Default MyMemory fallback
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
    console.log("Using MyMemory API:", apiUrl);

    try {
        const response = await axios.get(apiUrl);
        return res.json(response.data);
    } catch (error) {
        console.error("Translation Error (MyMemory fallback):", error.message);
        return res.status(500).json({ error: "Failed to fetch translation" });
    }
});


// Simple chatbot endpoint (without OpenAI dependency)
/********************************************************************
 *  Chatbot endpoint — tries OpenAI first, then your keyword logic
 ********************************************************************/
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    console.log("Sending message to OpenAI:", message);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are TransGO, a helpful multilingual assistant." },
        { role: "user", content: message }
      ],
      timeout: 10_000,
    });

    console.log("OpenAI response object:", completion);

    const aiReply = completion.choices[0]?.message?.content?.trim();

    if (aiReply) {
      console.log("OpenAI reply:", aiReply);
      return res.json({ response: aiReply, source: "openai" });
    } else {
      console.warn("OpenAI returned empty reply, falling back.");
    }
  } catch (error) {
    console.error("OpenAI error:", error);
  }

  // fallback logic
  const fallbackReply = keywordFallback(message);
  return res.json({ response: fallbackReply, source: "fallback" });
});



/********************************************************************
 *  Keyword logic (YOUR ORIGINAL CODE WRAPPED IN A FUNCTION)
 ********************************************************************/
function keywordFallback(message) {

  const responses = {
    greeting:  "Hello! I'm TransGO Assistant, your friendly translation helper. How can I assist you today?",
    help:      "I can help you with translations, language questions, grammar explanations, and cultural context. Just ask away!",
    translation:"To translate text, simply type it in the input field above, select your source and target languages, and click 'Convert Now'. You can also ask me about specific translations.",
    languages: "TransGO supports many languages including English, Spanish, French, German, Chinese, Japanese, Russian, Arabic, Hindi, and many more!",
    features:  "TransGO offers text translation between multiple languages, text-to-speech for pronunciation help, and a copy feature to easily use your translations elsewhere.",
    grammar:   "I can explain grammar concepts from different languages. What specific grammar point would you like to know about?",
    vocabulary:"Need help with vocabulary? I can provide translations, explanations, and examples for words in different languages.",
    idioms:    "Idioms and expressions often don't translate literally. I can help explain idioms and their cultural context in different languages.",
    thankyou:  "You're welcome! I'm glad I could help. Feel free to ask if you need anything else!",
    default:   "I'm your translation assistant. I can help with language questions, translations, grammar, vocabulary, and more. What would you like to know?"
  };

  const translationResponses = {
    english_spanish: {
      hello:"'Hello' in Spanish is 'Hola'.",
      goodbye:"'Goodbye' in Spanish is 'Adiós'.",
      thankyou:"'Thank you' in Spanish is 'Gracias'.",
      please:"'Please' in Spanish is 'Por favor'.",
      yes:"'Yes' in Spanish is 'Sí'.",
      no:"'No' in Spanish is 'No'."
    },
    english_french: {
      hello:"'Hello' in French is 'Bonjour'.",
      goodbye:"'Goodbye' in French is 'Au revoir'.",
      thankyou:"'Thank you' in French is 'Merci'.",
      please:"'Please' in French is 'S\\'il vous plaît'.",
      yes:"'Yes' in French is 'Oui'.",
      no:"'No' in French is 'Non'."
    },
    english_german: {
      hello:"'Hello' in German is 'Hallo'.",
      goodbye:"'Goodbye' in German is 'Auf Wiedersehen'.",
      thankyou:"'Thank you' in German is 'Danke'.",
      please:"'Please' in German is 'Bitte'.",
      yes:"'Yes' in German is 'Ja'.",
      no:"'No' in German is 'Nein'."
    }
  };

  const lower = message.toLowerCase();
  let responseText = responses.default;

  if (/(^|\\s)(hi|hello|hey)(\\s|$)/.test(lower))              responseText = responses.greeting;
  else if (lower.includes("help"))                             responseText = responses.help;
  else if (lower.includes("translate") || lower.includes("translation") || lower.includes("convert"))
                                                               responseText = responses.translation;
  else if (lower.includes("language") || lower.includes("languages") || lower.includes("supported"))
                                                               responseText = responses.languages;
  else if (lower.includes("feature"))                          responseText = responses.features;
  else if (lower.includes("grammar"))                          responseText = responses.grammar;
  else if (lower.includes("vocabulary"))                       responseText = responses.vocabulary;
  else if (lower.includes("idiom") || lower.includes("expression") || lower.includes("saying"))
                                                               responseText = responses.idioms;
  else if (lower.includes("thank"))                            responseText = responses.thankyou;
  else {
    /* ----- Specific tiny dictionary ----- */
    if (lower.includes("spanish")) {
      if (lower.includes("hello"))   responseText = translationResponses.english_spanish.hello;
      else if (lower.includes("goodbye")) responseText = translationResponses.english_spanish.goodbye;
      else if (lower.includes("thank"))   responseText = translationResponses.english_spanish.thankyou;
      else if (lower.includes("please"))  responseText = translationResponses.english_spanish.please;
      else if (lower.includes("yes"))     responseText = translationResponses.english_spanish.yes;
      else if (lower.includes("no"))      responseText = translationResponses.english_spanish.no;
    } else if (lower.includes("french")) {
      if (lower.includes("hello"))   responseText = translationResponses.english_french.hello;
      else if (lower.includes("goodbye")) responseText = translationResponses.english_french.goodbye;
      else if (lower.includes("thank"))   responseText = translationResponses.english_french.thankyou;
      else if (lower.includes("please"))  responseText = translationResponses.english_french.please;
      else if (lower.includes("yes"))     responseText = translationResponses.english_french.yes;
      else if (lower.includes("no"))      responseText = translationResponses.english_french.no;
    } else if (lower.includes("german")) {
      if (lower.includes("hello"))   responseText = translationResponses.english_german.hello;
      else if (lower.includes("goodbye")) responseText = translationResponses.english_german.goodbye;
      else if (lower.includes("thank"))   responseText = translationResponses.english_german.thankyou;
      else if (lower.includes("please"))  responseText = translationResponses.english_german.please;
      else if (lower.includes("yes"))     responseText = translationResponses.english_german.yes;
      else if (lower.includes("no"))      responseText = translationResponses.english_german.no;
    }
  }

  return responseText;
}


// Server running
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);

}); 
