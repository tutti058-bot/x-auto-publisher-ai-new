let allNews = [];

document.addEventListener("DOMContentLoaded", () => {
  loadNews();

  document.getElementById("search").addEventListener("input", searchNews);
});

async function loadNews() {
  const res = await fetch("data/news.json");
  const data = await res.json();

  allNews = data.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  renderNews(allNews);
}

function renderNews(news) {
  const container = document.getElementById("news-list");

  container.innerHTML = "";

  news.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" style="width:100%;display:block;">

      <div class="content">

        <div class="title">${item.title}</div>

        <div style="color:#666;font-size:14px;margin:8px 0;">
          ${item.date ? new Date(item.date).toLocaleString("ja-JP") : ""}
        </div>

        <div style="margin:10px 0;font-weight:bold;color:#2563eb;">
          ${item.category || "AI"}
        </div>

        <div class="desc">
          ${item.summary}
        </div>

        <br>

        <a href="news.html?id=${index}">
          詳細を見る →
        </a>

      </div>
    `;

    container.appendChild(card);
  });
}

function filterNews(category) {
  if (category === "ALL") {
    renderNews(allNews);
    return;
  }

  const filtered = allNews.filter(item => item.category === category);

  renderNews(filtered);
}

function searchNews() {
  const keyword = document
    .getElementById("search")
    .value
    .toLowerCase();

  const filtered = allNews.filter(item => {
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.summary.toLowerCase().includes(keyword) ||
      (item.category || "").toLowerCase().includes(keyword)
    );
  });

  renderNews(filtered);
}