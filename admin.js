async function loadNews() {

  const res = await fetch("data/news.json");
  const news = await res.json();

  const box = document.getElementById("news-list");
  const stats = document.getElementById("stats");

  const today = new Date().toISOString().slice(0,10);

  let html = "";

  let todayCount = 0;
  let postedCount = 0;
  let unpostedCount = 0;

  news.reverse().forEach((item,index)=>{

    if(item.date && !item.date.startsWith(today)){
      return;
    }

    const realIndex = news.length - 1 - index;

    const posted =
      localStorage.getItem("posted-"+realIndex)==="1";

    const disabled =
      posted ? "disabled" : "";

    todayCount++;

    if(posted){
      postedCount++;
    }else{
      unpostedCount++;
    }

    html += `

<div class="card ${posted ? "posted" : ""}">

<h2>${item.title}</h2>

<p>${item.summary}</p>

<small>${item.date ?? ""}</small>

<div class="actions">

<button onclick="copyPost(${realIndex})">
📋 コピー
</button>

<button ${disabled}
onclick="postX(${realIndex})">

${posted ? "✅ 投稿済み" : "🐦 X投稿"}

</button>

</div>

</div>

`;

  });

    if(html===""){
    html="<p>📰 今日の記事はありません。</p>";
  }

  if(stats){
    stats.innerHTML = `
      <div>📰 今日：${todayCount}件</div>
      <div>☑ 未投稿：${unpostedCount}件</div>
      <div>✅ 投稿済み：${postedCount}件</div>
    `;
  }

  box.innerHTML = html;

}

function makePost(item,index){

  return `🤖 ${item.title}

${item.summary}

👇続きを読む
https://x-auto-publisher-ai-new.vercel.app/news.html?id=${index}

#AI #ChatGPT #OpenAI`;

}

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

function postX(index){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      const text = makePost(news[index],index);

      // 投稿済みにする
      localStorage.setItem(
        "posted-"+index,
        "1"
      );

      // Xを開く
      window.open(
        "https://twitter.com/intent/tweet?text="+
        encodeURIComponent(text),
        "_blank"
      );

      // 管理画面更新
      loadNews();

    });

}

function markPosted(index){

  localStorage.setItem(
    "posted-"+index,
    "1"
  );

  loadNews();

}

function showToday(){

  loadNews();

}

function showUnposted(){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      const box = document.getElementById("news-list");

      const today =
        new Date().toISOString().slice(0,10);

      let html = "";

      news.reverse().forEach((item,index)=>{

        if(item.date && !item.date.startsWith(today)){
          return;
        }

        const realIndex =
          news.length-1-index;

        if(
          localStorage.getItem(
            "posted-"+realIndex
          )==="1"
        ){
          return;
        }

        html += `

<div class="card">

<h2>${item.title}</h2>

<p>${item.summary}</p>

<small>${item.date ?? ""}</small>

<div class="actions">

<button onclick="copyPost(${realIndex})">
📋 コピー
</button>

<button onclick="postX(${realIndex})">
🐦 X投稿
</button>

</div>

</div>

`;

      });

      if(html===""){
        html =
        "<p>🎉 未投稿の記事はありません！</p>";
      }

      box.innerHTML = html;

    });

}

function postAll(){

  fetch("data/news.json")
    .then(res=>res.json())
    .then(news=>{

      const today =
        new Date().toISOString().slice(0,10);

      const targets = [];

      news.forEach((item,index)=>{

        const isToday =
          !item.date || item.date.startsWith(today);

        const posted =
          localStorage.getItem("posted-"+index)==="1";

        if(isToday && !posted){
          targets.push(index);
        }

      });

      if(targets.length===0){

        alert("🎉 今日の未投稿記事はありません！");

        return;

      }

      targets.forEach((index,i)=>{

        setTimeout(()=>{

          postX(index);

        },i*2000);

      });

    });

}

// 起動
loadNews();