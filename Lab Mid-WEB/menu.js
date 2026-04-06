const menuToggle = document.getElementById("menuToggle");
const mainMenu = document.getElementById("mainMenu");


menuToggle.addEventListener("click", () => {
    mainMenu.classList.toggle("menu-open");
});


mainMenu.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (link && window.innerWidth <= 1024) {
        mainMenu.classList.remove("menu-open");
    }
});