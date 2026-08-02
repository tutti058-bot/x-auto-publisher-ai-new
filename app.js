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

  await showRanking();

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
      <div class="card-image">
    <img src="${item.image}" alt="${item.title}">
    <span class="category-tag">${item.category || "AI"}</span>
</div>

      <div class="content">

        <div class="title">${item.title}</div>

        <div class="news-date">
          ${item.date ? new Date(item.date).toLocaleString("ja-JP") : ""}
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

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(pages, currentPage + 1);

  if (start > 1) {
    nav.innerHTML += `
      <button onclick="changePage(1)">1</button>
    `;

    if (start > 2) {
      nav.innerHTML += `<span style="margin:0 8px;">…</span>`;
    }
  }

  for (let i = start; i <= end; i++) {

    nav.innerHTML += `
      <button
        onclick="changePage(${i})"
        style="
          margin:0 4px;
          ${i === currentPage ? "font-weight:bold;background:#2563eb;color:#fff;" : ""}
        ">
        ${i}
      </button>
    `;

  }

  if (end < pages) {

    if (end < pages - 1) {
      nav.innerHTML += `<span style="margin:0 8px;">…</span>`;
    }

    nav.innerHTML += `
      <button onclick="changePage(${pages})">
        ${pages}
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
    <div class="ranking-title">🔥 今週人気ランキング</div>
  `;

  ranking.forEach((item, index) => {

    const article = allNews.find(n => n.url === item.url);

    if (!article) return;

    let medal = `${index + 1}位`;
    let color = "";

    if (index === 0) {
      medal = "🥇";
      color = "gold";
    } else if (index === 1) {
      medal = "🥈";
      color = "silver";
    } else if (index === 2) {
      medal = "🥉";
      color = "bronze";
    }

    html += `

      <div class="rank-card ${color}">

        <div class="rank-no">
          ${medal}
        </div>

        <div class="rank-info">

          <a href="news.html?id=${allNews.indexOf(article)}">
            ${article.title}
          </a>

          <div class="rank-view">
            👁️ ${item.count} 回閲覧
          </div>

        </div>

      </div>

    `;

  });

  box.innerHTML = html;

}

// ヘッダー検索
const searchBtn = document.getElementById("search-btn");

if (searchBtn) {
  searchBtn.onclick = () => {
    const search = document.getElementById("search");

    search.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    search.focus();
  };
}

// ダークモード
const darkBtn = document.getElementById("dark-btn");

if (darkBtn) {

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    darkBtn.textContent = "☀️";
  }

  darkBtn.onclick = () => {

    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    localStorage.setItem("theme", dark ? "dark" : "light");

    darkBtn.textContent = dark ? "☀️" : "🌙";

  };

}

// ===== サイドメニュー =====

const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");

if (menuBtn && sideMenu) {

  menuBtn.onclick = () => {
    sideMenu.classList.toggle("open");
  };

}

function closeMenu() {
  sideMenu.classList.remove("open");
}

window.closeMenu = closeMenu;

function scrollRanking() {

  document.getElementById("ranking").scrollIntoView({
    behavior: "smooth"
  });

}

window.changePage = changePage;
window.filterNews = filterNews;
window.scrollRanking = scrollRanking;