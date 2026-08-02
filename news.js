import { addView } from "./firebase.js";

async function loadNews() {

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id") || 0);

  const res = await fetch("data/news.json");
  const news = await res.json();

  const item = news[id];

  if (!item) {
    document.body.innerHTML =
      "<h1 style='text-align:center;margin-top:100px;'>記事が見つかりません。</h1>";
    return;
  }

  // 閲覧数を追加
  if (item.url) {
    await addView(item.url);
  }

  document.getElementById("title").textContent = item.title;
document.getElementById("summary").textContent = item.summary;

// 日付表示
if (item.date) {
  document.getElementById("date").textContent =
    new Date(item.date).toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
}

// カテゴリ表示
document.getElementById("category").textContent =
  item.category || "AI";

  const image = document.getElementById("hero-image");

if (item.image && item.image !== "null") {

    image.src = item.image;

} else {

    image.src = "images/no-image.jpg";

}

image.alt = item.title;

  // SEO
  document.title = item.title + " | AI NEWS";

  const meta = document.querySelector('meta[name="description"]');

  if (meta) {
    meta.setAttribute(
      "content",
      item.summary.substring(0, 120)
    );
  }

  // 関連記事
  showRelated(news, item);

  // Xで共有
document.getElementById("share-x").onclick = () => {

  const text = `${item.title}\n\n${window.location.href}`;

  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    "_blank"
  );

};

// LINEで共有
document.getElementById("share-line").onclick = () => {

  window.open(
    `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`,
    "_blank"
  );

};

// リンクコピー


// 関連記事表示
function showRelated(news, currentItem) {

  const related = news
    .filter(item =>
      item.category === currentItem.category &&
      item.url !== currentItem.url
    )
    .slice(0, 3);

  const box = document.getElementById("related-list");

  if (!box) return;

  if (related.length === 0) {
    box.innerHTML = "<p>関連記事はありません。</p>";
    return;
  }

  let html = "";

  related.forEach(item => {

    const index = news.findIndex(n => n.url === item.url);

    html += `
      <div class="related-card">

        <img src="${item.image && item.image !== "null" ? item.image : "images/hero-bg.jpg"}" alt="${item.title}">

        <div class="related-content">

          <h3>
            <a href="news.html?id=${index}">
              ${item.title}
            </a>
          </h3>

          <p>
            ${item.summary.substring(0, 100)}...
          </p>

        </div>

      </div>
    `;

  });

  box.innerHTML = html;

}

loadNews();

// ダークモード復元
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}