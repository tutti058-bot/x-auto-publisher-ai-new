import fs from "fs";

const news = [];

// 今回取得した記事
for (let i = 0; i < 20; i++) {
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
}

// dataフォルダ作成
if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

// 既存ニュースを読み込む
let oldNews = [];

if (fs.existsSync("data/news.json")) {
  oldNews = JSON.parse(
    fs.readFileSync("data/news.json", "utf8")
  );
}

// 新旧結合
let merged = [...news, ...oldNews];

// URL重複削除
merged = merged.filter(
  (item, index, self) =>
    index === self.findIndex(n => n.url === item.url)
);

// 日付順
merged.sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

// 最新200件だけ保存
merged = merged.slice(0, 200);

// 保存
fs.writeFileSync(
  "data/news.json",
  JSON.stringify(merged, null, 2),
  "utf8"
);

console.log(`${merged.length}件のニュースを保存しました`);