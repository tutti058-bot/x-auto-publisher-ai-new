import fs from "fs";

const post = fs.readFileSync("posts/post.txt", "utf8");
const image = fs.readFileSync("posts/image.txt", "utf8");
const url = fs.readFileSync("posts/url.txt", "utf8");

const lines = post.trim().split("\n");

const title = lines.shift();
const summary = lines.join("\n");

const news = [
  {
    title,
    summary,
    image: image.trim(),
    url: url.trim()
  }
];

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

fs.writeFileSync(
  "data/news.json",
  JSON.stringify(news, null, 2)
);

console.log("news.json を作成しました");