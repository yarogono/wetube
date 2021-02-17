import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");

const commentBlock = document.getElementsByClassName(
  "video-detail__comments__block"
);
const commetNumber = document.getElementById("jsCommentNumber");

const decreaseNumber = () => {
  commetNumber.innerHTML = parseInt(commetNumber.innerHTML, 10) - 1;
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

const init = async () => {
  for (let i = 0; i < commentBlock.length; i++) {
    const deleteBtns = commentBlock[i].childNodes[1];
    if (deleteBtns) {
      deleteBtns.addEventListener("click", handleDeleteBtn);
    }
  }
};

if (addCommentForm) {
  init();
}
