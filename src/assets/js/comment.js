import axios from "axios";
import moment from "moment";

const addCommentForm = document.getElementById("jsAddComment");
const comments = document.getElementById("jsCommentList");
const commetNumber = document.getElementById("jsCommentNumber");

const decreaseNumber = () => {
  commetNumber.innerHTML = parseInt(commetNumber.innerHTML, 10) - 1;
};

const increaseNumber = () => {
  commetNumber.innerHTML = parseInt(commetNumber.innerHTML, 10) + 1;
};

const deleteComment = (event) => {
  event.preventDefault();
  const commentBlock = event.path[1];
  commentBlock.remove();
  decreaseNumber();
};

const handleDeleteBtn = async (event) => {
  try {
    const commentId = event.target.parentNode.getAttribute("id");
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
      url: `/api/${videoId}/delete-comment/`,
      method: "POST",
      data: {
        commentId,
      },
    });
    if (response.status === 200) {
      deleteComment(event);
    }
  } catch (error) {
    console.log(error);
  }
};

const addComment = (comment, currentTime, userName, commentId) => {
  const commentBlock = document.createElement("div");
  const li = document.createElement("li");
  const name = document.createElement("a");
  const commentList = document.createElement("span");
  const commentText = document.createElement("p");
  const delBtn = document.createElement("button");

  commentBlock.classList.add("video-detail__comments__block");
  commentBlock.id = commentId;
  name.innerHTML = userName;
  commentList.innerHTML = currentTime;
  commentText.innerHTML = comment;
  delBtn.innerHTML = "Delete";
  delBtn.addEventListener("click", handleDeleteBtn);

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
    const userDetail = await axios("/me");
    const userName = userDetail.data
      .split('<h4 class="profile__username">')[1]
      .split("</h4>")[0];
    const currentTime = moment(Date.now()).format("MMM, Do YY, HH:mm");
    const videoId = window.location.href.split("/videos/")[1];
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
      addComment(comment, currentTime, userName, response.data.id);
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

const init = () => {
  addCommentForm.addEventListener("submit", handleSubmit);

  const commentBlock = document.getElementsByClassName(
    "video-detail__comments__block"
  );

  for (let i = 0; i < commentBlock.length; i++) {
    const deleteBtns = commentBlock[i].childNodes[1];
    deleteBtns.addEventListener("click", handleDeleteBtn);
  }
};

if (addCommentForm) {
  init();
}
