// words.js
export const letters = (() => {
  const arr = [];
  for (let i = 65; i <= 90; i++) arr.push(String.fromCharCode(i));   // A-Z
  for (let i = 97; i <= 122; i++) arr.push(String.fromCharCode(i));  // a-z
  return arr;
})();

// Base pools
const easyWords = [
  "cat","dog","sun","run","hop","red","blue","green","book","pen",
  "bed","cup","hat","map","bag","box","fish","bird","frog","tree",
  "leaf","rain","snow","warm","cold","play","jump","walk","sit","stand",
  "look","see","big","small","fast","slow","happy","sad","fun","home",
  "apple","ball","car","desk","egg","farm","goat","hand","island","juice",
  "kite","lamp","milk","nest","orange","pig","queen","ring","ship","train",
  "umbrella","van","water","yarn","zoo","chair","table","door","floor","wall",
  "clock","plate","spoon","fork","shoe","sock","coat","shirt","pants","dress"
];

const mediumWords = [
  "river","forest","mountain","desert","ocean","flower","garden","branch","shadow","bright",
  "cloudy","windy","whisper","follow","carry","borrow","wonder","travel","answer","listen",
  "create","build","gather","collect","protect","explore","discover","imagine","picture","moment",
  "family","cousin","sister","brother","teacher","student","pencil","paper","window","corner",
  "morning","evening","summer","winter","spring","autumn","holiday","school","notebook","marker",
  "eraser","backpack","locker","playground","library","kitchen","bedroom","bathroom","gardeners","farmer",
  "market","village","city","country","bridge","tunnel","station","harbor","island","valley"
];

const hardWords = [
  "courage","freedom","justice","honor","wisdom","patience","kindness","energy","motion","gravity",
  "balance","harmony","melody","rhythm","pattern","texture","journey","history","future","present",
  "memory","purpose","reason","problem","solution","challenge","success","failure","progress","improve",
  "develop","inspire","encourage","celebrate","describe","compare","connect","reflect","analysis",
  "argument","evidence","conclusion","summary","narrative","character","dialogue","metaphor","simile","structure",
  "function","variable","equation","fraction","decimal","biology","chemistry","physics","ecosystem","organism",
  "habitat","climate","culture","society","economy","government","election","geography","continent","region",
  "resource","industry","technology","innovation","communication","transportation","architecture","engineering",
  "philosophy","psychology","sociology","anthropology","literature","linguistics","calculus","statistics","algorithm","hypothesis",
  "experiment","observation","interpretation","evaluation","synthesis","phenomenon","paradigm","perspective","methodology","probability"
];

// Build 500+ words by repeating the educational pool (still valid practice)
const basePool = [...easyWords, ...mediumWords, ...hardWords];
const practiceWordsRaw = [];
while (practiceWordsRaw.length < 520) {
  practiceWordsRaw.push(basePool[practiceWordsRaw.length % basePool.length]);
}

export const wordMeta = practiceWordsRaw.map((w) => {
  let level = "medium";
  if (easyWords.includes(w)) level = "easy";
  else if (hardWords.includes(w)) level = "hard";
  return { word: w, level };
});

export const totalWords = wordMeta.length;
