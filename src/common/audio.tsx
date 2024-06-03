///Azure
export enum AzureSpeechCode {
    "English-SG-Female" = "en-SG-LunaNeural",
    "English-SG-Male" = "en-SG-WayneNeural",
    "English-UK-Female" = "en-GB-SoniaNeural",
    "English-UK-Male" = "en-GB-RyanNeural",
    "Malay-MY-Female" = "ms-MY-YasminNeural",
    "Malay-MY-Male" = "ms-MY-OsmanNeural",
    "Chinese-CN-Female" = "zh-CN-XiaoxiaoNeural",
    "Chinese-CN-Male" = "zh-CN-YunxiNeural"
  }

///GCP
export enum LangCode {
  "cn" = "zh-cn",
  "us" = "en-us",
  "uk" = "en-uk",
  "my" = "ms-my"
}

export const getSound = async (text: string, langCode: LangCode) => { 
  if (langCode === LangCode.my) {
    textToSpeechVRRS(text, langCode);
  }else{
    textToSpeechYD(text, langCode);
  }
  
  //
}

///youdao.com
const textToSpeechYD = async (text: string, langCode: LangCode) => { 
  let url = `https://dict.youdao.com/dictvoice?audio=${text}`; 
  if (LangCode.cn) {
    url = url + `${url}&le=zh`
  } else{
    url = url + `&type=${LangCode.uk? 1:2}`
  }
    
  const audio = new Audio(url);
  audio.play();
}

///voicerss.org
const textToSpeechVRRS = async (text: string, langCode: LangCode) => { 
  const url = `https://api.voicerss.org/?key=${process.env.VOICERSS_API_KEY}&hl=${langCode}&c=MP3&src=${text}`; 
  const audio = new Audio(url);
  audio.play();
}