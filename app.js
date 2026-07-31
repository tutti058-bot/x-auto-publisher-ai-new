import { getRanking } from "./firebase.js";

let allNews = [];
let currentPage = 1;
const perPage = 10;
let filteredNews = [];

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

  filteredNews = [...allNews];

  renderNews(filteredNews);
}

function renderNews(news) {

  const container = document.getElementById("news-list");

  container.innerHTML = "";

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  const pageNews = news.slice(start, end);

  pageNews.forEach((item) => {

    const realIndex = allNews.findIndex(n => n.url === item.url);

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

        <a href="news.html?id=${realIndex}">
          詳細を見る →
        </a>

      </div>
    `;

    container.appendChild(card);

  });

  renderPagination(news.length);

}

function filterNews(category) {

  currentPage = 1;

  if (category === "ALL") {
    filteredNews = [...allNews];
    renderNews(filteredNews);
    return;
  }

  filteredNews = allNews.filter(item => item.category === category);

  renderNews(filteredNews);

}

function searchNews() {

  currentPage = 1;

  const keyword = document
    .getElementById("search")
    .value
    .toLowerCase();

  filteredNews = allNews.filter(item => {

    return (
      item.title.toLowerCase().includes(keyword) ||
      item.summary.toLowerCase().includes(keyword) ||
      (item.category || "").toLowerCase().includes(keyword)
    );

  });

  renderNews(filteredNews);

}

function renderPagination(total) {

  let nav = document.getElementById("pagination");

  if (!nav) {

    nav = document.createElement("div");
    nav.id = "pagination";
    nav.style.textAlign = "center";
    nav.style.margin = "40px 0";

    document.getElementById("news-list").after(nav);

  }

  const pages = Math.ceil(total / perPage);

  nav.innerHTML = "";

  if (pages <= 1) return;

  if (currentPage > 1) {

    nav.innerHTML += `
      <button onclick="changePage(${currentPage - 1})">
        ← 前へ
      </button>
    `;

  }

  for (let i = 1; i <= pages; i++) {

    nav.innerHTML += `
      <button
        onclick="changePage(${i})"
        style="
          margin:0 3px;
          ${i === currentPage ? "font-weight:bold;background:#2563eb;color:#fff;" : ""}
        ">
        ${i}
      </button>
    `;

  }

  if (currentPage < pages) {

    nav.innerHTML += `
      <button onclick="changePage(${currentPage + 1})">
        次へ →
      </button>
    `;

  }

}

function changePage(page) {

  currentPage = page;

  renderNews(filteredNews);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

async function showRanking() {

  const ranking = await getRanking();

  const box = document.getElementById("ranking");

  if (!box) return;

  let html = `
    <h2>🔥 今週人気</h2>
    <ol>
  `;

  for (const item of ranking) {

    html += `
      <li>
        👁 ${item.count} 回
      </li>
    `;

  }

  html += "</ol>";

  box.innerHTML = html;

}

showRanking();