const news = [
  {
    title: "AI NEWSへようこそ",
    summary: "まずはサイトが表示されるか確認しています。",
    image: "https://placehold.co/1200x700?text=AI+NEWS"
  }
];

const list = document.getElementById("news-list");

news.forEach(item => {

  list.innerHTML += `
    <div class="card">

      <img src="${item.image}">

      <div class="content">

        <div class="title">
          ${item.title}
        </div>

        <div class="desc">
          ${item.summary}
        </div>

      </div>

    </div>
  `;

});