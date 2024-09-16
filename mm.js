const main = document.querySelector('main')
const dropdown = document.querySelector('.dropdown-menu')
let current_jobs = JSON.parse(localStorage.getItem('saved_jobs')) ?? [];
const saved_id = []
for(let i of current_jobs){
  saved_id.push(i.id)
}

let saved = false


console.log(saved_id)

let data = []
buildmain('Home')


function buildmain(btn){
    if(btn === 'Home'){
        main.innerHTML = `<div id="home_text">
        <h1>Wellcome to our jobs search service</h1>
        <p>To use our service all what you need is a good heart, and a little mind</p><br><br>
        <hr>
        <h5>Enjoy</h5>
        </div>`;
        saved = false

    }
    else if (btn === 'All Jobs') {
      saved = false
      creatcard()
      console.log()
    }

    else if (btn === "Saved Jobs"){
      saved = true
      if(current_jobs.length !== 0){
        let current_jobs = JSON.parse(localStorage.getItem('saved_jobs')) ?? [];
        creatcard(current_jobs)
        // console.log(current_jobs)
      }else{
        main.innerHTML = '<h1>You haven\'t saved any favorites yet</h1>'
      }
      
    }
    
        
        
    
}


function all_jobs(url = 'limit=50'){
    fetch("https://remotive.com/api/remote-jobs?" + url)
    .then(e => e.json())
    .then((e) => {data = e['jobs']})
    .catch(e => console.log(e + '    בעיה בקישור'))
    return data
}




function creatcard(arr = all_jobs()){
  console.log(arr)
    main.innerHTML = ''
    arr.forEach((element) => {
    main.innerHTML += `
    <div id="c${element.id}" class="card" style="width: 22rem;border: solid rgb(143, 172, 197) 1px;">
    <nav class="t_nav">
        <span class="mm">Company Name:${element.company_name}</span>
      </nav>
    <div class="image">
        <img src="${element.company_logo}" class="card-img-top" alt="...">
    </div> 

    <div class="card-body">
      <div class="card-title">
        <h5>
            ${element.title}
        </h5>
      </div>   
 
      <div class="overflow-scroll">
        <p class="card-text">
              ${element.description}
        </p>
      </div>
      <div class="the_btn">
            <button id="s${element.id}" class="save_btn" onclick='to_save(${element.id})'>Save this JOB</button>
            <button href="#" class="btn btn-success">See this JOB</button>
      </div>
    </div>

    <nav class="t_nav" class="navbar navbar-light bg-light">
        <span class="mm" class="navbar-brand mb-0 p">Type:${element.job_type}</span>
      </nav>
  </div>
    `;
  if(saved_id.includes(element.id)){
    change_btn(element.id);
  }
})
}


async function fetch_category(){
  const res = await fetch("https://remotive.com/api/remote-jobs/categories")
  const data = await res.json()
  return data.jobs
}




async function create_category(){
  const arr = await fetch_category()
  console.log('fetch_category= ',arr);
  arr.forEach(item => {
    dropdown.innerHTML += `<li><button class="dropdown-item" onclick="all_jobs('category=${item.slug}&limit=50')">${item.name}</button></li>`
  })


}








function to_save(id) {
  data.forEach(item => {
    if (item.id === id) {
      current_jobs.push(item);
      saved_id.push(id); // הוספת ה־ID של העבודה למערך saved_id
      update_stor();
      change_btn(id);
    }
  });
}




function update_stor(){
  const str_ar = JSON.stringify(current_jobs)
  localStorage.setItem('saved_jobs', str_ar)
}






function change_btn(id) {
  s_btn = document.querySelector(`#s${id}`)
  // יצירת אלמנט כפתור המחליף את הכפתור הקיים
  removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'remove';
  removeBtn.classList.add('btn', 'btn-info');
  removeBtn.id = `r${id}`
  s_btn.replaceWith(removeBtn);

  main.addEventListener('click',(e) => {
    const g = e.target.closest(`#r${id}`)
    if(!g)return
    remove_elm(id)
    
  });
}




function remove_elm(id){
  saved_id.forEach((elm, i) => {
    if(elm === id){
      saved_id.splice(i, 1)
    }
  });
  current_jobs.forEach((elm, i) => {
    if(elm.id === id){
      current_jobs.splice(i, 1)
    }
  })
  update_stor();
  if(!saved){
    creatcard();
  }else{
    buildmain('Saved Jobs')
  }
  
  }

//~~~~~~~~~~~~~~~~~~~~~~~~`search~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

const search = document.querySelector('#search')
const search_btn = document.querySelector('#search_btn')

const search_value = []
search.addEventListener('keyup', (e) => {
  search_value[0] = search.value
})

search_btn.addEventListener('click', (e) => {
  // console.log(search_value[0])
  const new_arr = []
  data.forEach((element) => {
    if(element.title.toLowerCase().includes(search_value[0].toLowerCase()) ||
    false){
      new_arr.push(element)
    }
  });
  creatcard(new_arr)
})

