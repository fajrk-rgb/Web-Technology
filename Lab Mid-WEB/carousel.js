$(function () {
    $(".product-slider").each(function () {
        var $section = $(this);
        var $carousel = $section.find(".books-carousel");
        var $counter = $section.find(".slide-counter");
        var totalSlides = $carousel.children(".book").length;

        $carousel.on("init reInit afterChange", function (event, slick, currentSlide) {
            var current = (currentSlide || 0) + 1;
            $counter.text("Showing " + current + " of " + totalSlides);
        });

        $carousel.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            speed: 500,
            arrows: true,
            prevArrow: $section.find(".prev-btn"),
            nextArrow: $section.find(".next-btn"),
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            pauseOnFocus: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });

        $carousel.on("mouseenter", ".book", function () {
            $carousel.slick("slickPause");
        });

        $carousel.on("mouseleave", ".book", function () {
            $carousel.slick("slickPlay");
        });
    });
});
