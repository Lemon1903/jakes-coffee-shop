const menu = document.querySelector(".menu");

let templates;
loadAllTemplates().then((data) => {
  templates = data;
  initializeMenuContent(data["coffees"]);
});

/* ------ Menu ------ */
function initializeMenuContent(content) {
  menu.appendChild(content.cloneNode(true));

  const activeCategories = [];
  const categories = document.querySelectorAll(".menu__category");
  categories.forEach((category) => {
    category.addEventListener("click", () => {
      toggleCategory(category);
      filterItems();
    });
  });

  function filterItems() {
    const items = document.querySelectorAll(".menu__item");
    items.forEach((item) => {
      if (activeCategories.length === 0) {
        item.classList.remove("menu__item--hidden");
        return;
      }

      const dataItemType = item.getAttribute("data-item-type");
      const isActive = activeCategories.includes(dataItemType);
      item.classList.toggle("menu__item--hidden", !isActive);
    });
  }

  function toggleCategory(category) {
    const dataCategory = category.getAttribute("data-category");
    category.classList.toggle("menu__category--active");
    if (category.classList.contains("menu__category--active")) {
      activeCategories.push(dataCategory);
    } else {
      const index = activeCategories.indexOf(dataCategory);
      activeCategories.splice(index, 1);
    }
  }
}

/* ------ Navigation Menu ------ */
const navMenu = document.querySelector(".nav__menu");
const navMenuIcon = navMenu.querySelector("i");
const links = document.querySelector(".nav__links");

navMenu.addEventListener("touchstart", (e) => {
  e.preventDefault();
  links.classList.toggle("show");
  if (navMenuIcon.classList.contains("bx-menu")) {
    links.focus();
    navMenuIcon.classList.replace("bx-menu", "bx-x");
  } else {
    navMenuIcon.classList.replace("bx-x", "bx-menu");
  }
});

links.addEventListener("blur", () => {
  links.classList.remove("show");
  navMenuIcon.classList.replace("bx-x", "bx-menu");
});

const navLinks = document.querySelectorAll(".nav__link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    link.firstElementChild.click();
    links.classList.remove("show");
    navMenu.classList.replace("bx-x", "bx-menu");
  });
});

// Scroll to top behavior
const scrollToTop = document.querySelector(".scroll-top");
scrollToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.innerWidth < 768 ? "auto" : "smooth",
  });
});

window.addEventListener("scroll", () => {
  scrollToTop.classList.toggle("show", window.scrollY > 100);
});

/* ------ Menu Navigation ------ */
const menuNavButtons = document.querySelectorAll(".menu__nav__btn");
menuNavButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const previous = document.querySelector(".menu__nav__btn--active");
    previous.classList.remove("menu__nav__btn--active");
    button.classList.add("menu__nav__btn--active");

    // remove the last 2 children
    menu.lastElementChild?.remove();
    menu.lastElementChild?.remove();

    // add the new children
    initializeMenuContent(templates[button.id]);
  });
});

/* ------ Template Instantiation ------ */
async function loadAllTemplates() {
  const templates = {};
  const templateIDs = ["coffees", "foods"];
  for (const templateID of templateIDs) {
    const content = await fetchTemplate(templateID);
    templates[templateID] = content;
  }
  return templates;
}

async function fetchTemplate(id) {
  const response = await fetch(`templates/${id}.html`);
  const data = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");
  const template = doc.querySelector("template");
  return template.content;
}
