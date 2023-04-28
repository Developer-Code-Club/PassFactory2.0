var id; //dont move
var name;
const startButton = document.getElementById("start");
const userlist = document.getElementById("userlist");
const userCount = document.getElementById("userCount");
const loginButton = document.getElementById("loginButton");
const setRoom = document.getElementById("setRoom");
const clearStaff = document.getElementById("clearStaff");
const checkoutwindow = document.getElementById("checkoutwindow");
const checkoutbutton = document.getElementById("checkout");

var currentUsers = JSON.parse(localStorage.getItem("currentUsers")) || [];
var names = JSON.parse(localStorage.getItem("names")) || [];
var staffList = JSON.parse(localStorage.getItem("staffList")) || [];
loadUsers();

function hideElement(id) {
    document.getElementById(id).style.display = "none";
}

function showElement(id, display) {
    document.getElementById(id).style.display = display;
}

function loadUsers() {
    if(!userlist) return;
    userlist.innerHTML = '';
    userCount.textContent = "Students out: " + currentUsers.length;

    for(var i = 0; i < currentUsers.length; i++) {
        var user = currentUsers[i];
        var name = names[i];
        var li = document.createElement("li");
        var resolveButton = document.createElement("button");
        var userID = document.createElement("label");
        var userName = document.createElement("label");
        var timeIn = document.createElement("label");
        //var elapsedTime = document.createElement("label");
        var status = document.createElement("label");
        resolveButton.textContent = "Resolve";
        timeIn.textContent = getTime();
        userID.textContent = user;
        userName.textContent = name;
        status.textContent = "pending";
        status.style.color = "green";
        resolveButton.classList.add("resButton");
        li.classList.add("inner");
        userID.classList.add("userinfo");
        userName.classList.add("userinfo");
        timeIn.classList.add("userinfo");
        status.classList.add("userinfo");
        //elapsedTime.classList.add("userinfo");

        resolveButton.onclick = function() {
            removeUser(user);
        }

        li.appendChild(userName);
        li.appendChild(userID);
        li.appendChild(timeIn);
        //li.appendChild(elapsedTime);
        li.appendChild(status);
        li.appendChild(resolveButton);
        userlist.appendChild(li);
    }

}

function getTime() {
    const time1 = new Date();
    const hr = time1.getHours();
    const min = time1.getMinutes();
    const sec = time1.getSeconds();
    
    return `${hr}:${min}:${sec}`;
}


function removeUser(user) {
    var index = currentUsers.indexOf(user);
    currentUsers.splice(index,1);
    names.splice(index,1);
    localStorage.setItem("currentUsers", JSON.stringify(currentUsers));
    localStorage.setItem("names", JSON.stringify(names));
    userCount.textContent = "Students out: " + currentUsers.length;
    loadUsers();

}

function addUser(id, name) {
    currentUsers.push(id);
    names.push(name);
    localStorage.setItem("currentUsers", JSON.stringify(currentUsers));
    localStorage.setItem("names", JSON.stringify(names));
    userCount.textContent = "Students out: " + currentUsers.length;
    loadUsers();
}


function addStaff(n) {
    staffList.push(n);
    localStorage.setItem("staffList", JSON.stringify(staffList));
    console.log(staffList);
}

clearStaff.addEventListener("click", function() {
    staffList.length = 0;
    localStorage.setItem("staffList", JSON.stringify(staffList));
    console.log(staffList);
});

startButton.addEventListener("click",  function() {
    id = document.getElementById("idNum").value;
    name = document.getElementById("flname").value;
    if(id == "") {
        alert("Enter your ID please");
        return;
    }
    document.getElementById("idNum").value = '';
    document.getElementById("flname").value = '';
    checkoutwindow.style.display = "flex";
});


loginButton.addEventListener("click", function() {
    if(document.getElementById("pin").value == 1234) {
        document.getElementById("pin").value = null;
        document.getElementById("login").style.display = "none";
        document.getElementById("page2").style.display = "block";
    } else {
        alert("Wrong :(");
    }
});

setRoom.addEventListener("click", function() {
    document.getElementById('staffName').value = null; 
    document.getElementById("displayRoomNum").textContent = "Room: " + document.getElementById("roomNum").value;
    addStaff(document.getElementById("staffName").value);
});

checkout.addEventListener("click", function() {
    checkoutwindow.style.display = "none";
    addUser(id, name);
});






