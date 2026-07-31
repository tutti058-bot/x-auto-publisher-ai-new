async function loadNews() {

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id") || 0);

  const res = await fetch("data/news.json");
  const news = await res.json();

  const item = news[id];

  if (!item) {
    document.body.innerHTML = "<h1 style='text-align:center;margin-top:100px;'>記事が見つかりません。</h1>";
    return;
  }

  document.getElementById("image").src = item.image;
  document.getElementById("title").textContent = item.title;
  document.getElementById("summary").textContent = item.summary;
  document.getElementById("link").href = item.url;

}

loadNews();