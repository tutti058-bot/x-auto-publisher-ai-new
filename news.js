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

  // 閲覧数保存
  try {
    if (item.url) {
      await addView(item.url);
      console.log("閲覧数保存成功", item.url);
    }
  } catch (e) {
    console.error("閲覧数保存失敗", e);
  }

  document.getElementById("title").textContent = item.title;
  document.getElementById("summary").textContent = item.summary;
  document.getElementById("link").href = item.url;

  if (item.image) {
    document.getElementById("image").src = item.image;
    document.getElementById("image").alt = item.title;
  }

  document.title = item.title + " | AI NEWS";

  const meta = document.querySelector('meta[name="description"]');

  if (meta) {
    meta.setAttribute(
      "content",
      item.summary.substring(0, 120)
    );
  }

}

loadNews();