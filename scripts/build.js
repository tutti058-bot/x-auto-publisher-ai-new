import fs from "fs";

const news = [];

for (let i = 0; i < 10; i++) {
  const postFile = `posts/post${i}.txt`;

  if (!fs.existsSync(postFile)) continue;

  const post = fs.readFileSync(postFile, "utf8").trim();

  const lines = post.split("\n");

  const title = lines.shift()?.trim() || "";
  const summary = lines.join("\n").trim();

  const image = fs.existsSync(`posts/image${i}.txt`)
    ? fs.readFileSync(`posts/image${i}.txt`, "utf8").trim()
    : "";

  const url = fs.existsSync(`posts/url${i}.txt`)
    ? fs.readFileSync(`posts/url${i}.txt`, "utf8").trim()
    : "";

  let category = "AI";

  const text = (title + " " + summary).toLowerCase();

  if (text.includes("openai") || text.includes("chatgpt")) {
    category = "OpenAI";
  } else if (text.includes("google") || text.includes("gemini")) {
    category = "Google";
  } else if (text.includes("anthropic") || text.includes("claude")) {
    category = "Anthropic";
  } else if (text.includes("microsoft") || text.includes("copilot")) {
    category = "Microsoft";
  } else if (text.includes("meta") || text.includes("llama")) {
    category = "Meta";
  } else if (text.includes("xai") || text.includes("grok")) {
    category = "xAI";
  }

  news.push({
  title,
  summary,
  image,
  url,
  category,
  date: new Date().toISOString()
});

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

fs.writeFileSync(
  "data/news.json",
  JSON.stringify(news, null, 2),
  "utf8"
);

console.log(`${news.length}件のニュースを作成しました`);