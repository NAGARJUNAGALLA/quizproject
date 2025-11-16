// ----- Users with SHA-256 hashed passwords -----
const users = [
  {username:"user1", passwordHash:"e7cf3ef4f17c3999a94f2c6f612e8a888e5e38e5e76d8a6f20b04f98e0e2f5d7"}, // Pass@123
  {username:"user2", passwordHash:"ae2b1fca515949e5d54fb22b8ed95575d5fa2e285a0b2d2a414d8d60a1b13d68"}, // Pass@456
  {username:"admin", passwordHash:"a23e5b95b1c05613c6e60d71cd1cbba81d6a9829f39252aa8f9dfd87a22f1f65"}  // Admin@123
];

// SHA-256 hash function
async function hashPassword(password){
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
}

async function login(){
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const error = document.getElementById("login-error");
  if(!u || !p){ error.textContent = "Enter username and password!"; return; }
  
  const pHash = await hashPassword(p);
  const user = users.find(x=>x.username===u && x.passwordHash===pHash);
  if(user){
    document.getElementById("login-form").style.display="none";
    document.getElementById("quiz-area").style.display="block";
  } else {
    error.textContent = "Invalid username or password!";
  }
}

// ----- QUIZ CODE -----
const QUIZ_TITLE = "APTET ENGLISH Paper 1 : Model Paper 1";
const questions = [
  {q:"She got right to the top, the worlds most sought after multipercussionist with a mastery of some thousand instruments and a hectic international schedule.\n Choose the synonym of the word ‘hectic’", options:["curious","sensation","fault","busy"], answerId:3},
  {q:"She showed her brave side during the crisis. Identify the antonym of the word ‘brave’. ", options:["Courageous","Coward","Fearless","Bold"], answerId:1},
  {q:"Identify the term for a clause that cannot form a sentence by itself and is connected to a main clause:", options:["Compound clause","Dependent clause","Independent clause","Complex clause"], answerId:1}
];

let current=0, answers=Array(questions.length).fill(null), submitted=false;
let timeLeft=questions.length*60, timerInterval;

function toggleNav(){document.getElementById("question-nav").classList.toggle("hidden");}
function renderNav(){
  const nav=document.getElementById("question-nav"); nav.innerHTML="";
  questions.forEach((_,i)=>{
    const b=document.createElement("button");
    b.textContent=i+1;
    b.className=(i===current?"active ":"")+(answers[i]!=null?"answered":"");
    b.onclick=()=>{current=i;renderQuestion()};
    nav.appendChild(b);
  });
  updateStats();
}
function renderQuestion(){
  const q=questions[current];
  const c=document.getElementById("question-container");
  let h=`<h4>Question ${current+1} of ${questions.length}</h4><p>${q.q}</p><div class="options">`;
  q.options.forEach((o,i)=>{
    let cls="";
    if(submitted){
      if(i===q.answerId) cls="correct";
      else if(answers[current]===i && i!==q.answerId) cls="wrong";
    }
    h+=`<label class="${cls}"><input type="radio" name="opt" value="${i}" ${answers[current]===i?'checked':''} ${submitted?'disabled':''} onchange="selectOpt(${i})">${o}</label>`;
  });
  h+="</div>"; c.innerHTML=h; renderNav();
  if(window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([c]);
}
function selectOpt(i){ if(submitted) return; answers[current]=i; renderNav();}
function nextQuestion(){if(current<questions.length-1){current++; renderQuestion();}}
function prevQuestion(){if(current>0){current--; renderQuestion();}}
function updateStats(){
  const a=answers.filter(x=>x!==null).length;
  document.getElementById("answered").textContent="Answered: "+a;
  document.getElementById("not-answered").textContent="Not answered: "+(questions.length-a);
}
function startTimer(){
  updateTimer();
  timerInterval=setInterval(()=>{timeLeft--;updateTimer(); if(timeLeft<=0){clearInterval(timerInterval); submitQuiz();}},1000);
}
function updateTimer(){
  const m=Math.floor(timeLeft/60), s=timeLeft%60;
  document.getElementById("timer").textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function submitQuiz(){
  if(submitted) return; submitted=true; clearInterval(timerInterval);
  let correct=0, wrong=0;
  questions.forEach((q,i)=>{if(answers[i]!=null){if(answers[i]===q.answerId) correct++; else wrong++;}});
  const skipped = questions.length-(correct+wrong);
  const total = questions.length;
  const score = Math.round((correct/total)*100);
  const name = document.getElementById("username").value;
  const html=`<h3>Result Summary</h3><p><b>Name:</b> ${name}</p><p><b>Total Questions:</b> ${total}</p><p><b>Correct:</b> ${correct}</p><p><b>Wrong:</b> ${wrong}</p><p><b>Skipped:</b> ${skipped}</p><p><b>Score:</b> ${score}%</p>`;
  document.getElementById("result-section").innerHTML=html;
  document.getElementById("result-section").classList.remove("hidden");
  renderQuestion();
}
function toggleFullscreen(){
  if(!document.fullscreenElement){document.documentElement.requestFullscreen().catch(err=>alert(err.message));} 
  else {document.exitFullscreen();}
}
