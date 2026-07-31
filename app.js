fetch("data/news.json")
  .then(response => response.json())
  .then(news => {

    const list = document.getElementById("news-list");
    list.innerHTML = "";

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

  });