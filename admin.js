async function loadNews() {

  const res = await fetch("data/news.json");
  const news = await res.json();

  const box = document.getElementById("news-list");

  const today = new Date().toISOString().slice(0,10);

  let html = "";

  news.reverse().forEach((item,index)=>{

    if(item.date && !item.date.startsWith(today)){
      return;
    }

    const realIndex = news.length-1-index;

    const posted =
      localStorage.getItem("posted-"+realIndex)==="1";

    html += `

<div class="card">

<h2>${item.title}</h2>

<p>${item.summary}</p>

<small>${item.date ?? ""}</small>

<br><br>

<button onclick="copyPost(${realIndex})">
📋 コピー
</button>

<button onclick="postX(${realIndex})">
🐦 X投稿
</button>

<button onclick="markPosted(${realIndex})">
${posted ? "✅ 投稿済み" : "☑ 投稿済みにする"}
</button>

</div>

`;

  });

  if(html===""){

    html="<p>今日の記事はありません。</p>";

  }

  box.innerHTML=html;

}

function makePost(item,index){

  return `🤖 ${item.title}

${item.summary}

👇続きを読む
https://x-auto-publisher-ai-new.vercel.app/news.html?id=${index}

#AI #ChatGPT #OpenAI`;

}

// コピー
function copyPost(index){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      navigator.clipboard.writeText(
        makePost(news[index],index)
      );

      alert("投稿文をコピーしました！");

    });

}

// X投稿
function postX(index){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      const text=makePost(news[index],index);

      window.open(
        "https://twitter.com/intent/tweet?text="+
        encodeURIComponent(text),
        "_blank"
      );

    });

}

// 投稿済み
function markPosted(index){

  localStorage.setItem(
    "posted-"+index,
    "1"
  );

  loadNews();

}

function makePost(item,index){

  return `🤖 ${item.title}

${item.summary}

👇続きを読む
https://x-auto-publisher-ai-new.vercel.app/news.html?id=${index}

#AI #ChatGPT #OpenAI`;

}

// コピー
function copyPost(index){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      navigator.clipboard.writeText(
        makePost(news[index],index)
      );

      alert("投稿文をコピーしました！");

    });

}

// X投稿
function postX(index){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      const text=makePost(news[index],index);

      window.open(
        "https://twitter.com/intent/tweet?text="+
        encodeURIComponent(text),
        "_blank"
      );

    });

}

// 投稿済み
function markPosted(index){

  localStorage.setItem(
    "posted-"+index,
    "1"
  );

  loadNews();

}

// 今日の記事だけ
function showToday(){

  loadNews();

}

// 未投稿だけ
function showUnposted(){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      const box=document.getElementById("news-list");

      const today=new Date().toISOString().slice(0,10);

      let html="";

      news.reverse().forEach((item,index)=>{

        if(item.date && !item.date.startsWith(today)){
          return;
        }

        const realIndex=news.length-1-index;

        if(localStorage.getItem("posted-"+realIndex)==="1"){
          return;
        }

        html+=`

<div class="card">

<h2>${item.title}</h2>

<p>${item.summary}</p>

<small>${item.date ?? ""}</small>

<br><br>

<button onclick="copyPost(${realIndex})">
📋 コピー
</button>

<button onclick="postX(${realIndex})">
🐦 X投稿
</button>

<button onclick="markPosted(${realIndex})">
☑ 投稿済みにする
</button>

</div>

`;

      });

      if(html===""){
        html="<p>🎉 未投稿の記事はありません！</p>";
      }

      box.innerHTML=html;

    });

}

// 今日の記事を全部投稿
function postAll(){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      const today=new Date().toISOString().slice(0,10);

      const list=news.filter(item=>
        !item.date || item.date.startsWith(today)
      );

      if(list.length===0){

        alert("今日の記事はありません。");

        return;

      }

      list.forEach((item,i)=>{

        setTimeout(()=>{

          const text=makePost(item,news.indexOf(item));

          window.open(
            "https://twitter.com/intent/tweet?text="+
            encodeURIComponent(text),
            "_blank"
          );

        },i*1500);

      });

    });

}

// 起動
loadNews();