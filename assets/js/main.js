function openImgModal(src) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("imgModalContent");
  modal.style.display = "flex";
  modalImg.src = src;
}

function closeImgModal() {
  document.getElementById("imgModal").style.display = "none";
}

document.addEventListener("keydown", function(e){
  if (e.key === "Escape") closeImgModal();
});