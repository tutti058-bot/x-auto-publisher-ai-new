async function loadNews() {

  const res = await fetch("data/news.json");
  const news = await res.json();

  const box = document.getElementById("news-list");

  let html = "";

  news.reverse().forEach((item, index) => {

    html += `

<div class="card">

<h2>${item.title}</h2>

<p>${item.summary}</p>

<button onclick="copyPost(${news.length - 1 - index})">

📋 投稿文コピー

</button>

<button onclick="postX(${news.length - 1 - index})">

🐦 Xで投稿

</button>

</div>

`;

  });

  box.innerHTML = html;

}

function makePost(item, index) {

  return `🤖 ${item.title}

${item.summary}

👇続きを読む
https://x-auto-publisher-ai-new.vercel.app/news.html?id=${index}

#AI #ChatGPT #OpenAI`;

}

// コピー
function copyPost(index){

  fetch("data/news.json")
    .then(res => res.json())
    .then(news => {

      navigator.clipboard.writeText(
        makePost(news[index], index)
      );

      alert("投稿文をコピーしました！");

    });

}

// X投稿
function postX(index){

  fetch("data/news.json")
    .then(res => res.json())
    .then(news => {

      const text = makePost(news[index], index);

      window.open(
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(text),
        "_blank"
      );

    });

}

loadNews();