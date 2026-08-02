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

  // 閲覧数
  if (item.url) {

    await addView(item.url);

  }

  // タイトル
  document.getElementById("title").textContent = item.title;

  // 要約
  document.getElementById("summary").textContent = item.summary;

  // カテゴリ
  document.getElementById("category").textContent =
    item.category || "AI";

  // 日付
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

    // 元記事ボタン
  const originalLink = document.getElementById("original-link");

  if (originalLink) {

    originalLink.href = item.url;
    originalLink.target = "_blank";

  }

  // 本文
  const articleBody = document.getElementById("article-body");

  if (articleBody) {

    articleBody.innerHTML = `
      <p>${item.summary}</p>

      <p style="margin-top:25px;">
        詳細は元記事をご確認ください。
      </p>
    `;

  }

  // メイン画像
  const heroImage = document.getElementById("hero-image");

  if (heroImage) {

    if (item.image && item.image !== "null") {

      heroImage.src = item.image;

    } else {

      heroImage.src = "images/hero-bg.jpg";

    }

    heroImage.alt = item.title;

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

    // 前の記事
  const prev = document.getElementById("prev-post");

  if (prev) {

    if (id > 0) {

      prev.href = `news.html?id=${id - 1}`;

    } else {

      prev.style.display = "none";

    }

  }

  // 次の記事
  const next = document.getElementById("next-post");

  if (next) {

    if (id < news.length - 1) {

      next.href = `news.html?id=${id + 1}`;

    } else {

      next.style.display = "none";

    }

  }

  // Xで共有
  const shareX = document.getElementById("share-x");

  if (shareX) {

    shareX.onclick = () => {

      const text = `${item.title}\n\n${window.location.href}`;

      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        "_blank"
      );

    };

  }

  // Facebookで共有
  const shareFacebook = document.getElementById("share-facebook");

  if (shareFacebook) {

    shareFacebook.onclick = () => {

      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        "_blank"
      );

    };

  }

  // LINEで共有
  const shareLine = document.getElementById("share-line");

  if (shareLine) {

    shareLine.onclick = () => {

      window.open(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`,
        "_blank"
      );

    };

  }

    // 関連記事
  showRelated(news, item);

} // ← loadNews終了


// ======================
// 関連記事
// ======================

function showRelated(news, currentItem) {

  const box = document.getElementById("related-list");

  if (!box) return;

  const currentIndex = news.findIndex(
    n => n.url === currentItem.url
  );

  const related = news
    .filter((item, index) => {

      return (
        index !== currentIndex &&
        item.category === currentItem.category
      );

    })
    .slice(0, 3);

  if (related.length === 0) {

    box.innerHTML = "<p>関連記事はありません。</p>";

    return;

  }

  let html = "";

  related.forEach(item => {

    const index = news.findIndex(
      n => n.url === item.url
    );

    const image =
      item.image && item.image !== "null"
        ? item.image
        : "images/hero-bg.jpg";

    html += `

<div class="related-card">

<a href="news.html?id=${index}">

<img src="${image}" alt="${item.title}">

<div>

<h3>${item.title}</h3>

<p>${item.summary.substring(0,80)}...</p>

</div>

</a>

</div>

`;

  });

  box.innerHTML = html;

}

// ======================
// 実行
// ======================

loadNews();

// ダークモード復元
if (localStorage.getItem("theme") === "dark") {

  document.body.classList.add("dark");

}