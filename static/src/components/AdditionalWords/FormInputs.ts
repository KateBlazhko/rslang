const FORM_INPUTS_FILE = [
  { label: "Word audio:", name: "audio", type: "file", accept: ".mp3" },
  {
    label: "Word audio meaning:",
    name: "audioMeaning",
    type: "file",
    accept: ".mp3",
  },
  {
    label: "Word audio example:",
    name: "audioExample",
    type: "file",
    accept: ".mp3",
  },
  {
    label: "Word image:",
    name: "image",
    type: "file",
    accept: ".jpg, .png",
  },
];

const FORM_INPUTS_TEXT = [
  { label: "Word text:", name: "word", type: "text" },
  { label: "Example translate:", name: "textExampleTranslate", type: "text" },
  { label: "Meaning translate:", name: "textMeaningTranslate", type: "text" },
  { label: "Word translate:", name: "wordTranslate", type: "text" },
  { label: "Transcription", name: "transcription", type: "text" },
  { label: "Text example:", name: "textExample", type: "text" },
  { label: "Text meaning:", name: "textMeaning", type: "text" },
];

export { FORM_INPUTS_FILE, FORM_INPUTS_TEXT };
