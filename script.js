const connection = io(window.location.href);
const canvas = document.getElementById('canvas');
const display = canvas.getContext('2d');

let serverMaze;
let id;
let players;
let chat = [];
let subscribed = false;
let ps = [];

let client;

let u = canvas.width/20;

window.onresize = function() {
    u = canvas.width/20;
}

document.getElementById("set-username").onclick = function() {
    // alert(`Setting username to ${document.getElementById("input").value}`)
    connection.emit("name-change", document.getElementById("input").value);
}

document.getElementById("send").onclick = function() {
    if (document.getElementById("text").value.trim() != "") {
        connection.emit("message", document.getElementById("text").value);
        document.getElementById("text").value = "";
    }
}

document.onkeyup = function(e) {
    if (e.key == "ArrowUp") {
        connection.emit("dir", "up")
    }
    if (e.key == "ArrowDown") {
        connection.emit("dir", "down")
    }
    if (e.key == "ArrowLeft") {
        connection.emit("dir", "left")
    }
    if (e.key == "ArrowRight") {
        connection.emit("dir", "right")
    }
    if (e.key == "Enter" && document.getElementById("text").value.trim() != "") {
        connection.emit("message", document.getElementById("text").value);
        document.getElementById("text").value = "";
    }
}

connection.on("connect", function() {
    id = connection.id;
})

connection.on("map-update", data => {
    serverMaze = data
})

connection.on("chat-error", () => {
    let p = document.createElement("p");
    p.innerText = "Server (Privately to you): You can't send that!";
    p.className = "error";
    document.getElementById("messages").appendChild(p);
})

connection.on("chat-update", data => {
    chat = data
    if (subscribed) {
        if (chat.length != ps.length) {
            let p = document.createElement("p");
            p.innerText = chat[chat.length - 1].from + ": " + chat[chat.length - 1].content;
            document.getElementById("messages").appendChild(p);
            let div = document.getElementById("messages");
            div.scrollTop = div.scrollHeight;
            ps.push(p);            
        }
    } else if (!subscribed) {
        subscribed = true;
        chat.forEach((message) => {
            let p = document.createElement("p");
            p.innerText = message.from + ": " + message.content;
            document.getElementById("messages").appendChild(p);
            ps.push(p);
        })
    }
})

connection.on("player-update", data => {
    players = data;
    client = players[id];
})

