async function loadNews() {
  const res = await fetch("data/news.json");
  const news = await res.json();

  const container = document.getElementById("news-list");

  container.innerHTML = "";

  news.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" style="width:100%;display:block;">

      <div class="content">
        <div class="title">${item.title}</div>

        <div class="desc">
          ${item.summary}
        </div>

        <br>

        <a href="${item.url}" target="_blank">
          続きを読む →
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

loadNews();