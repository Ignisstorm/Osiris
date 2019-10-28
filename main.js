const profilePicContainer = document.querySelector('.profilePicContainer');
const alertMessageContainer = document.querySelector('.alert');
const specialism = ["Lead Software Architect", "Front-End Developer", "Back-End Developer", "UX Designer", "Junior Developer", "Social Media Strategist", "Content Designer", "Junior Developer", "Data Scientist", "IT Systems Engineer"];
const cardTitle = document.querySelector('.card-title');
const cardText = document.querySelector('.card-text');


//EVENT LISTENERS
window.addEventListener('load', getData);

//FETCH CALLS
function getData(){
  fetch('https://randomuser.me/api/?results=10&inc=name,location,email,phone,picture,dob,id')
  .then(checkStatus)
  .then(response => response.json())
  .then(data => obj = data)
  .then(addToData)
  .then(() => fillFirstEmployeeName(obj))
  .then(assignSpecialism)
  .then(() => insertImage(obj))
  .then(() => printEmployees(obj))
  .catch(error => notifyUser(error))
}

//HELPER FUNCTIONS
//check status
function checkStatus(response){
	if(response.ok){
		return Promise.resolve(response);
  }else{
		return Promise.reject(new Error(response.statusText));
  }
}

//add to data
function addToData(){
  specialism.map((item, index) => obj.results[index]['specialism']=item);
  console.log(obj);
}

//fill employee data
function fillFirstEmployeeName(){
  let nameData = obj.results[0].name,
      employeeName = `${nameData.title} ${nameData.first} ${nameData.last}`;
  document.querySelector('.card-title').innerHTML = capitalize(employeeName);
}


//assign specialism
function assignSpecialism(){
  let firstEmployeeSpecialism = obj.results[0].specialism;
  document.querySelector('.card-text').innerHTML = firstEmployeeSpecialism;
}

//insert image
function insertImage(obj){
  //create new image
  let profilePic = document.createElement("img");
  //define image container
  const imageContainer = document.querySelector('.profilePicContainer');
  //set image source
  profilePic.src = obj.results[0].picture.large;
  profilePic.alt = 'employee profile pic';
  //add image classes
  profilePic.className = "profile-pic rounded-circle";
  //apend image to container
  imageContainer.appendChild(profilePic);
}


//print employees
function printEmployees(){
  let output='';
  let results = obj.results.slice(1);

  results.map(item => { output+=
    `
    <div class="card employee">
      <div class="card-body">
        <div class="card-title">
          <div class="employeeImageContainer">
            <img src="${item.picture.medium}" class="rounded-circle"/>
          </div>
          <div>
            <p class="employeeDetails">${capitalize(item.name.title)} ${capitalize(item.name.first)} ${capitalize(item.name.last)}</p>
            <p class="employeeDetails text-muted">${item.specialism}</p>
          </div>
        </div>
      </div>
    </div>
  `
  })
  
  setTimeout(()=>{
    document.querySelector('.employeesContainer').innerHTML = output;
  },1000)
}


//notify user
function notifyUser(error){
  alertMessageContainer.style.display = 'block';
  alertMessageContainer.innerHTML = `There was an error with the server request (${error}). Try refreshing the page.`;
}

//capitalize name
function capitalize(name){
	return name.split(" ")
             .map(item => item.charAt(0).toUpperCase()+item.slice(1))
             .join(" ")
}


//show email
function showEmail(){
  cardTitle.innerHTML = "My email address is";
  cardText.innerHTML = `${obj.results[0].email}`;
}

//show tel number
function showTelNumber(){
  cardTitle.innerHTML = "My telephone number is";
  cardText.innerHTML = `${obj.results[0].phone}`;
}

//show user street
function showUserStreet(){
  cardTitle.innerHTML = 'I currently live at';
  cardText.innerHTML = `${capitalize(obj.results[0].location.street)}, ${capitalize(obj.results[0].location.city)}`;
}


//show user id
function showUserID(){
  let userID = obj.results[0].id.value;
  if(userID === null || userID.match(/undefined/g)){
    cardTitle.innerHTML = "Employee ID is currently";
    cardText.innerHTML = "unavailable";
  }else{
    cardTitle.innerHTML = "My employee ID is";
    cardText.innerHTML = `${userID}`;
  }
}

function showCalendar(){
  let dob = obj.results[0].dob.date;
  let regex = /(\d+)\-(\d+)\-(\d+)/g;
  let date = regex.exec(dob);
  let formattedDob = `${date[3]}/${date[2]}/${date[1]}`;
  cardTitle.innerHTML = 'Date of birth';
  cardText.innerHTML = formattedDob;
}





//change info on mouseenter
let listItems = [...document.querySelectorAll('.list-inline-item')];
listItems.map(item => item.onmouseenter = function(){
  if(item.classList.contains('email')){
      showEmail();
  }else if(item.classList.contains('telephone')){
      showTelNumber();
  }else if(item.classList.contains('address')){
      showUserStreet();
  }else if(item.classList.contains('employeeID')){
      showUserID();
  }else if(item.classList.contains('dob')){
      showCalendar();
  }
})


//showName on mouseleave
document.getElementsByTagName('ul')[0].onmouseleave = function(){
  fillFirstEmployeeName();
  assignSpecialism();
}
