const startButton = document.getElementById("start");
const userlist = document.getElementById("userlist");
const loginButton = document.getElementById("loginButton");
const setRoom = document.getElementById("setRoom");
const checkoutwindow = document.getElementById("checkoutwindow");
const checkoutbutton = document.getElementById("checkout");
var studentCount = 0;

function hideElement(id) {
    document.getElementById(id).style.display = "none";
}

function showElement(id, display) {
    document.getElementById(id).style.display = display;
}

function addStudent(studentName, id) {
    studentCount++;
    var ul = document.getElementById("userlist");
    var li = document.createElement("li");
    var resolveButton = document.createElement("button");
    var userID = document.createElement("label");
    var userName = document.createElement("label");
    var timeIn = document.createElement("label");
    var status = document.createElement("label");
    resolveButton.textContent = "Resolve";
    timeIn.textContent = getTime();
    userID.textContent = id;
    status.textContent = "pending";
    status.style.color = "green";
    userName.textContent = studentName;
    resolveButton.onclick = function() {
        removeStudent(id);
    }
    li.classList.add("inner");
    li.setAttribute("data-id", id); 
    userID.classList.add("userinfo");
    userName.classList.add("userinfo");
    timeIn.classList.add("userinfo");
    status.classList.add("userinfo");
    resolveButton.classList.add("resButton");
    li.appendChild(userName);
    li.appendChild(userID);
    li.appendChild(timeIn);
    li.appendChild(status);
    li.appendChild(resolveButton);
    ul.appendChild(li);
    document.getElementById("userCount").textContent = "Students out: " + studentCount;
}

function removeStudent(id) {
    studentCount--;
    var ul = document.getElementById("userlist");
    var li = ul.querySelector(`li[data-id="${id}"]`);
    ul.removeChild(li);
    document.getElementById("userCount").textContent = "Students out: " + studentCount;
}


function getTime() {
    const time1 = new Date();
    const hr = time1.getHours();
    const min = time1.getMinutes();
    const sec = time1.getSeconds();
    
    return `${hr}:${min}:${sec}`;
}

startButton.addEventListener("click",  function() {
    var id = document.getElementById("idNum").value;
    var name = document.getElementById("flname").value;
    if(id == "") {
        alert("Enter your ID please");
        return;
    }
    document.getElementById("time").textContent = getTime();
    checkoutwindow.style.display = "flex";
});

setRoom.addEventListener("click", function() {
    document.getElementById('staffName').value = null; 
    document.getElementById("displayRoomNum").textContent = "Room: " + document.getElementById("roomNum").value;
});

checkout.addEventListener("click", function() {
    var id = document.getElementById("idNum").value;
    var name = document.getElementById("flname").value;
    addStudent(name, id);
    document.getElementById("notes").value = "";
    checkoutwindow.style.display = "none";
    document.getElementById("idNum").value = '';
    document.getElementById("flname").value = '';
});






