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
const time = "http://worldtimeapi.org/api/timezone/America/New_York";
//store list of current users in local storage or empty list
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
//create list element and add it to userlis
//display all checked out users on screen
function loadUsers() {
    //clear everything
    if(!userlist) return;
    userlist.innerHTML = '';
    //load the user count
    userCount.textContent = "Students out: " + currentUsers.length;

    //load all user from currentUsers 
    for(var i = 0; i < currentUsers.length; i++) {
        var user = currentUsers[i];
        var name = names[i];
        var li = document.createElement("li");
        var resolveButton = document.createElement("button");
        var userID = document.createElement("label");
        var userName = document.createElement("label");
        resolveButton.textContent = "Resolve";
        userID.textContent = user;
        userName.textContent = name;
        resolveButton.classList.add("resButton");
        li.classList.add("inner");
        userID.classList.add("userinfo");
        userName.classList.add("userinfo");


        //onclick for resolve button
        resolveButton.onclick = function() {
            removeUser(user);
            console.log("bruh this better work");
        }

        li.appendChild(userName);
        li.appendChild(userID);
        li.appendChild(resolveButton);
        userlist.appendChild(li);
    }

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
    console.log("here");
    staffList.length = 0;
    localStorage.setItem("staffList", JSON.stringify(staffList));
    console.log(staffList);
});

//show pop up window and current time
startButton.addEventListener("click",  function() {
    id = document.getElementById("idNum").value;
    name = document.getElementById("flname").value;
    if(id == "") {
        alert("Enter your ID please");
        return;
    }
    console.log(id);
    document.getElementById("idNum").value = '';
    document.getElementById("flname").value = '';
    checkoutwindow.style.display = "flex";

    //wait for getTime to fetch data
    getTime().then(time => {
        document.getElementById("time").textContent = time;
    });
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
})

//adds user
/*
id number, first and last name, time in, start a timer, update the timer
*/
checkout.addEventListener("click", function() {
    checkoutwindow.style.display = "none";
    addUser(id, name);
    console.log("bruh");
});

async function getTime() {
    const response = await fetch(time);
    const timeData = await response.json();
    const currTime = new Date(timeData.datetime);
    var hr = currTime.getHours();
    var min = currTime.getMinutes();

    return hr + ":" + min;
}






