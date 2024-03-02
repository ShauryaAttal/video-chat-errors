const socket = io("/");

const user = prompt("Enter your name: ");

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "433",
});

const myvideo = document.createElement("video");
myvideo.muted = true;

var mystream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    mystream = stream;
    addVideoStream(myvideo, stream);
  });

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadmetadata", () => {
    video.play();
    $("#video-grid").append(video);
  });
}

$(function () {
  $("#show_chat").click(function () {
    $(".left-window").css("display", "none");
    $(".right-window").css("display", "block");
    $("#header_back").css("display", "block");
    console.log("check");
  });

  $("#header_back").click(function () {
    $(".right-window").css("display", "none");
    $(".left-window").css("display", "block");
    $("#header_back").css("display", "none");
  });

  $("#send").click(function () {
    if ($("#chat_message").val().length !== 0) {
      socket.emit("student", $("#chat_message").val());
      $("#chat_message").val("");
    }
  });

  $("#chat_message").keydown(function (e) {
    if (e.key == "Enter" && $("#chat_message").val().length !== 0) {
      socket.emit("student", $("#chat_message").val());
      $("#chat_message").val("");
    }
  });
});

peer.on("open", (roomId) => {
  socket.emit("join-room", ROOM_ID, roomId, user);
});
socket.on("createMessage", (message, userName) => {
  console.log("Client recv: ", message);
  $(".messages").append(
    `
    <div class="message">
    <b>
    <i class = "fas fa-user-circle></i>
    <span>${userName === user ? "Me" : userName}</span>
    </b>
    <span>${message}</span>
    </div>
    `
  );
});
