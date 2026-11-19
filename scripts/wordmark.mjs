// Prints the ASCII wordmark used in the hero, as a JSON array of lines.
// Usage: node scripts/wordmark.mjs "ugoki lab" Roman
import figlet from "figlet";

const [text = "ugoki lab", font = "Roman"] = process.argv.slice(2);
const lines = figlet.textSync(text, { font }).split("\n").filter((l) => l.trim().length);
console.log(JSON.stringify(lines, null, 2));
