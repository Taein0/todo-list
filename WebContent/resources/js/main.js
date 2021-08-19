let renderCurrentTime = () => {
   let now = new Date();
   let hour = now.getHours();
   let minutes = now.getMinutes();
   let seconds = now.getSeconds();
   
   hour = hour < 10 ? "0"+hour:hour;
   minutes = minutes < 10 ? "0" + minutes:minutes;
   seconds = seconds < 10 ? "0" + seconds:seconds;
   document.querySelector('.clock_text').innerHTML = `${hour} : ${minutes} : ${seconds}`;
}

let renderUser = e => {
   e.preventDefault();
   let inpName = document.querySelector('.inp_name');
   let username = inpName.value;
   localStorage.setItem('username',username);
   convertMainDiv(username);
}

let convertMainDiv = username => {
   let inpName = document.querySelector('.inp_name');
   
   document.querySelector('.frm_name').className = 'frm_todo';
   document.querySelector('.username').innerHTML = username;
   inpName.value = '';
   inpName.placeholder = 'Enter your schedule';
   inpName.className = 'inp_todo';
   
   document.querySelector('.todo-list').style.display ='flex';
   document.querySelector('.main').style.justifyContent ='space-between';
   document.querySelector('.wrap_user').className = 'wrap_todo';
   
   document.querySelector('.frm_todo').removeEventListener('submit',renderUser);
   document.querySelector('.frm_todo').addEventListener('submit',registSchedule);
   document.querySelector('#leftArrow').addEventListener('click',movePage);
   document.querySelector('#rightArrow').addEventListener('click',movePage);
}

let movePage = (event) => {
   let curPage = document.querySelector('.current-page').textContent;   
   renderPage(Number(event.target.dataset.dir) + Number(curPage));
}

let registSchedule = (e) => {
   e.preventDefault();
   let todoList = localStorage.getItem('todo'); //
   let input = document.querySelector('.inp_todo').value;
   document.querySelector('.inp_todo').value = '';
   
   if(todoList){
      todoList = JSON.parse(todoList);      
      let lastIdx = localStorage.getItem('lastIdx');
      
      lastIdx = Number(lastIdx) + 1;
      localStorage.setItem('lastIdx',lastIdx);      
      todoList.unshift({work:input, idx:lastIdx});
   }else{
      localStorage.setItem('lastIdx',0);
      todoList = [{work:input, idx:0}];
   }
   
   localStorage.setItem('todo',JSON.stringify(todoList));
   renderSchedule(todoList.slice(0,7));
}

let renderSchedule = (todoList) => {
   document.querySelectorAll('.todo-list>div').forEach(e => {e.remove()});
   
   todoList.forEach(e => {
      let workDiv = document.createElement('div');
      workDiv.innerHTML = `<i class="far fa-trash-alt" data-idx="${e.idx}"></i> ${e.work}`;
      document.querySelector('.todo-list').appendChild(workDiv);
   })
   
   document.querySelectorAll('.todo-list>div>i').forEach(e => {
      e.addEventListener('click', removeSchedule)
   })
   
   document.querySelector('.current-page').textContent = 1;
}

let removeSchedule = event => {
   let todoList = JSON.parse(localStorage.getItem('todo'));
   
   let curPage = document.querySelector('.current-page').textContent;   
   let res = todoList.filter(e => event.target.dataset.idx != e.idx);
   
   localStorage.setItem('todo',JSON.stringify(res));
   renderPage(curPage);
}

let renderPage = (renderPage, cnt) => {

   if(!cnt) cnt = 8;
   
   //현재 페이지
   let todoList = localStorage.getItem('todo');
   if(!todoList) return;
   
   todoList = JSON.parse(todoList);
   
   let lastPage = Math.ceil(todoList.length/8);
   if(renderPage > lastPage) renderPage = lastPage;
   if(renderPage < 1)   renderPage = 1;
      
   let end = renderPage * cnt;
   let begin = end - cnt;
   
   renderSchedule(todoList.slice(begin,end));
   document.querySelector('.current-page').textContent = renderPage;
}

(()=> {
   let username = localStorage.getItem('username');   
   let todoList = localStorage.getItem('todo');//수정   
   
   if(username){
      convertMainDiv(username);
   }else{
      document.querySelector('.frm_name').addEventListener('submit',renderUser);
   }
   
   if(todoList){
      renderSchedule(JSON.parse(todoList).slice(0,8));
   }
   setInterval(renderCurrentTime,1000);
})()
