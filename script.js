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
