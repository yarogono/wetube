import axios from "axios";
import moment from "moment";

const addCommentForm = document.getElementById("jsAddComment");
const comments = document.getElementById("jsCommentList");
const commetNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commetNumber.innerHTML = parseInt(commetNumber.innerHTML, 10) + 1;
};

const addComment = (comment, currentTime, userName) => {
  const commentBlock = document.createElement("div");
  const li = document.createElement("li");
  const name = document.createElement("a");
  const commentList = document.createElement("span");
  const commentText = document.createElement("p");
  const delBtn = document.createElement("button");

  commentBlock.classList.add("video-detail__comments__block");
  name.innerHTML = userName;
  commentList.innerHTML = currentTime;
  commentText.innerHTML = comment;
  delBtn.innerHTML = "Delete";

  li.appendChild(name);
  li.appendChild(commentList);
  li.appendChild(commentText);
  commentBlock.appendChild(li);
  commentBlock.appendChild(delBtn);
  comments.prepend(commentBlock);
  increaseNumber();
};

const sendComment = async (comment) => {
  try {
    const videoId = window.location.href.split("/videos/")[1];
    const userDetail = await axios("/me");
    const userName = userDetail.data
      .split('<h4 class="profile__username">')[1]
      .split("</h4>")[0];
    const currentTime = moment(Date.now()).format("MMM, Do YY, HH:mm");
    const response = await axios({
      url: `/api/${videoId}/add-comment`,
      method: "POST",
      data: {
        comment,
        currentTime,
        userName,
      },
    });
    if (response.status === 200) {
      addComment(comment, currentTime, userName);
    }
  } catch (error) {
    console.log(error);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
