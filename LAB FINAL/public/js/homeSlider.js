document.querySelectorAll(".slider-container").forEach(container => {
    // support both .books-slider and .products-slider
    const slider = container.querySelector(".books-slider, .products-slider");
    const leftBtn = container.querySelector(".left-btn");
    const rightBtn = container.querySelector(".right-btn");

    if (!slider || !leftBtn || !rightBtn) return;

    const scrollAmount = 300;

    rightBtn.addEventListener("click", () => {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    leftBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
});