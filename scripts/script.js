const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll('.astronaut').forEach(function(img) {
  img.addEventListener('click', function() {
    document.getElementById('popup-naam').textContent = img.dataset.naam;
    document.getElementById('popup-info').textContent = img.dataset.info;
    document.getElementById('popup-img').src = img.dataset.img;
    document.getElementById('popup-img').alt = img.dataset.naam;
    document.getElementById('popup').classList.remove('verborgen');
  });
});

function sluitPopup() {
  document.getElementById('popup').classList.add('verborgen');
}

document.getElementById('popup-sluit').addEventListener('click', sluitPopup);

document.addEventListener('click', function(e) {
  if (!e.target.closest('.astronaut') && !e.target.closest('#popup')) {
    sluitPopup();
  }
});