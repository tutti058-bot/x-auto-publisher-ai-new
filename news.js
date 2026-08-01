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

  // 記事表示
  document.getElementById("title").textContent = item.title;
  document.getElementById("summary").textContent = item.summary;
  document.getElementById("link").href = item.url;

  if (item.image) {
    document.getElementById("image").src = item.image;
    document.getElementById("image").alt = item.title;
  }

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
document.getElementById("copy-link").onclick = async () => {

  await navigator.clipboard.writeText(window.location.href);

  const msg = document.getElementById("copy-message");

  msg.style.display = "block";

  setTimeout(() => {

    msg.style.display = "none";

  }, 2000);

};

}

// 関連記事表示
function showRelated(news, currentItem) {

  const related = news
    .filter(item =>
      item.category === currentItem.category &&
      item.url !== currentItem.url
    )
    .slice(0, 3);

  const box = document.getElementById("related-news");

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

        <img src="${item.image}" alt="${item.title}">

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