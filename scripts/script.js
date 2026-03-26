  const hamburger = document.getElementById('hamburger');  const navLinks  = document.getElementById('nav-links');  hamburger.addEventListener('click', () => {    const isOpen = navLinks.classList.toggle('active');    hamburger.setAttribute('aria-expanded', isOpen);  });  navLinks.querySelectorAll('a').forEach(link => {    link.addEventListener('click', () => {      navLinks.classList.remove('active');      hamburger.setAttribute('aria-expanded', 'false');    });  });
// dit geeft de H1 alle letter een span zodat het 1 vvor 1 de letters verandere
document.querySelectorAll('.morph-text').forEach(el => {
  const text = el.textContent;
  el.innerHTML = text
    .split('')
    .map((char, i) => `<span style="--i:${i}">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('');
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
  document.getElementById("popup").classList.add("verborgen");
}

document.getElementById("popup-sluit").addEventListener("click", sluitPopup);

document.addEventListener("click", function (e) {
  if (!e.target.closest(".astronaut") && !e.target.closest("#popup")) {
    sluitPopup();
  }
});

function animateAstronauts() {
  const astronauts = document.querySelectorAll('.astronaut');
  astronauts.forEach((astronaut, index) => {
    const direction = index % 2 === 0 ? 'left' : 'right'; // Even index naar links, oneven naar rechts
    const randomDuration = Math.random() * 2 + 2; // Willekeurige duur tussen 2 en 4 seconden

    astronaut.style.transition = `transform ${randomDuration}s ease-in-out`;
    astronaut.style.transform = direction === 'left' ? 'translateX(-100vw)' : 'translateX(100vw)';

    // Reset de positie na de animatie
    setTimeout(() => {
      astronaut.style.transform = 'translateX(0)';
    }, randomDuration * 1000);
  });
}

function setupAstronauts() {
  const astronauts = [...document.querySelectorAll(".astronaut")].sort(
    () => Math.random() - 0.5
  );

  astronauts.forEach((el, i) => {
    const leftToRight = i % 2 === 0; // na shuffle = random patroon, ongeveer helft/helft

    el.style.setProperty("--y", `${10 + Math.random() * 90}%`);
    el.style.setProperty("--dur", `${20 + Math.random() * 90}s`);
    el.style.setProperty("--delay", `${-Math.random() * 50}s`);
    el.style.setProperty("--fromX", leftToRight ? "-25vw" : "125vw");
    el.style.setProperty("--toX", leftToRight ? "125vw" : "-25vw");
  });
}

document.addEventListener("DOMContentLoaded", setupAstronauts);

// Start de animatie bij het laden van de pagina
window.onload = animateAstronauts;


const title = document.getElementById('team-title');

document.querySelectorAll('.astronaut').forEach(img => {
  img.addEventListener('mouseenter', () => {
    title.style.opacity = 0;
    setTimeout(() => {
      title.textContent = img.dataset.naam;
      title.style.opacity = 1;
    }, 150);
  });

  img.addEventListener('mouseleave', () => {
    title.style.opacity = 0;
    setTimeout(() => {
      title.textContent = "Meet the team";
      title.style.opacity = 1;
    }, 150);
  });
});



