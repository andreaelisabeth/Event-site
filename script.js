// Interaktiv SVG-side
const svgPlaceholder = document.querySelector(".svg-placeholder");

// Opsamlingsside
const opsamlingPlaceholder = document.querySelector(".opsamling-placeholder");

if (opsamlingPlaceholder) {
  const params = new URLSearchParams(window.location.search);
  // Eksempel: params.get("navn") henter værdien fra et formularfelt med name="navn".
}

// FINDER FORMULAREN PÅ FORM.HTML
const form = document.querySelector(".form-placeholder");

// HVIS VI ER PÅ FORM.HTML
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Finder gæstens valgte forløb
    const selectedTicket = document.querySelector(
      'input[name="forløb"]:checked',
    );

    // Gemmer valget
    sessionStorage.setItem("ticketType", selectedTicket.value);

    // Sender gæsten videre
    window.location.href = "./opsamling.html";
  });
}

// FINDER BILLETTEN PÅ OPSAMLING.HTML
const ticketStub = document.querySelector("#ticket-stub");
const ticketCategory = document.querySelector("#ticket-category");

// HVIS VI ER PÅ OPSAMLING.HTML
if (ticketStub && ticketCategory) {
  // Henter gæstens valg fra formularen
  const ticketType = sessionStorage.getItem("ticketType");

  // Gæsten er i et kræftforløb
  if (ticketType === "har kræft") {
    ticketStub.classList.add("stub-pink");
    ticketCategory.textContent = "DIN AFTEN";
  }

  // Gæsten har tidligere haft kræft
  else if (ticketType === "har haft kræft") {
    ticketStub.classList.add("stub-mauve");
    ticketCategory.textContent = "DIN AFTEN";
  }

  // Gæsten er pårørende
  else if (ticketType === "pårørende") {
    ticketStub.classList.add("stub-champagne");
    ticketCategory.textContent = "DIN AFTEN";
  }
}

/*************svg*******************/
// Interaktiv SVG: blomst der flyver langs stien
if (svgPlaceholder) {
  const sti = document.querySelector("#sti");
  const blomst = document.querySelector("#blomst");
  const cirkler = document.querySelectorAll(".punkt");
  const felter = document.querySelectorAll(".accordion-item");

  const laengde = sti.getTotalLength();

  // Finder det sted på stien, der ligger tættest på et punkt
  function naermesteLaengde(x, y) {
    let bedst = 0;
    let mindst = Infinity;
    for (let l = 0; l <= laengde; l++) {
      const p = sti.getPointAtLength(l);
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < mindst) {
        mindst = d;
        bedst = l;
      }
    }
    return bedst;
  }

  // Hvor på stien hver cirkel sidder
  const maal = [...cirkler].map((g) => {
    const c = g.querySelector(".dot");
    return naermesteLaengde(+c.getAttribute("cx"), +c.getAttribute("cy"));
  });

  // Sætter blomstens midte på et sted på stien
  function placer(l) {
    const p = sti.getPointAtLength(l);
    blomst.setAttribute("transform", `translate(${p.x}, ${p.y})`);
  }

  let nu = maal[0];
  let animId;

  function flytTil(index) {
    const fra = nu;
    const til = maal[index];
    const start = performance.now();
    const varighed = 1200;

    cancelAnimationFrame(animId);

    function trin(tid) {
      const k = Math.min((tid - start) / varighed, 1);
      const glat = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      nu = fra + (til - fra) * glat;
      placer(nu);
      if (k < 1) animId = requestAnimationFrame(trin);
    }
    animId = requestAnimationFrame(trin);

    cirkler.forEach((g, i) => g.classList.toggle("aktiv", i === index));
  }

  // Klik på cirkel: åbn teksten og flyt blomsten
  cirkler.forEach((g, i) => {
    const vaelg = () => {
      if (felter[i].open) {
        flytTil(i);
      } else {
        felter[i].open = true;
      }
    };
    g.addEventListener("click", vaelg);
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        vaelg();
      }
    });
  });

  // Klik på tekstfelt: flyt blomsten
  felter.forEach((felt, i) => {
    felt.addEventListener("toggle", () => {
      if (!felt.open) return;
      felter.forEach((andet, j) => {
        if (j !== i) andet.open = false;
      });
      flytTil(i);
    });
  });

  // Start ved første cirkel
  placer(nu);
  cirkler[0].classList.add("aktiv");
}
