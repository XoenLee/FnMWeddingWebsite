document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('navbar-toggle');
    const navbarLinks = document.getElementById('navbar-links');

    toggleButton.addEventListener('click', function () {
        navbarLinks.style.display = navbarLinks.style.display === 'none' ? 'flex' : 'none';
    });
});

// slider 

    const slider = document.querySelector(".slider");
    const nextBtn = document.querySelector(".next-btn");
    
    const prevBtn = document.querySelector(".prev-btn");
    const slides = document.querySelectorAll(".slide");
    const slideIcons = document.querySelectorAll(".slide-icon");
    const numberOfSlides = slides.length;
    var slideNumber = 0;

    //image slider next button
    nextBtn.addEventListener("click", () => {
        slides.forEach((slide) => {
        slide.classList.remove("active");
        });
        slideIcons.forEach((slideIcon) => {
            slideIcon.classList.remove("active");
        });

        slideNumber++;

        if(slideNumber > (numberOfSlides - 1)){
        slideNumber = 0;
        }

        slides[slideNumber].classList.add("active");
        slideIcons[slideNumber].classList.add("active");
    });

    //image slider previous button
    prevBtn.addEventListener("click", () => {
        slides.forEach((slide) => {
            slide.classList.remove("active");
        });
        slideIcons.forEach((slideIcon) => {
            slideIcon.classList.remove("active");
        });

        slideNumber--;

        if(slideNumber < 0){
            slideNumber = numberOfSlides - 1;
        }

        slides[slideNumber].classList.add("active");
        slideIcons[slideNumber].classList.add("active");
    });

    //image slider autoplay
    var playSlider;

    var repeater = () => {
        playSlider = setInterval(function(){
            slides.forEach((slide) => {
                slide.classList.remove("active");
            });
            slideIcons.forEach((slideIcon) => {
                slideIcon.classList.remove("active");
            });

        slideNumber++;

        if(slideNumber > (numberOfSlides - 1)){
            slideNumber = 0;
        }

            slides[slideNumber].classList.add("active");
            slideIcons[slideNumber].classList.add("active");
        }, 4000);
    }
    repeater();

    //stop the image slider autoplay on mouseover
    slider.addEventListener("mouseover", () => {
        clearInterval(playSlider);
    });

    //start the image slider autoplay again on mouseout
    slider.addEventListener("mouseout", () => {
        repeater();
    });

// countdown
//

// Set the date we're counting down to
const countDownDate = new Date("Feb 23, 2024 23:59:59").getTime();

// Update the countdown every 1 second
const x = setInterval(function() {
    // Get the current date and time
    const now = new Date().getTime();

    // Calculate the remaining time
    const distance = countDownDate - now;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the HTML elements with the calculated values
    document.querySelector('.clock-day').innerHTML = days;
    document.querySelector('.clock-hours').innerHTML = hours;
    document.querySelector('.clock-minutes').innerHTML = minutes;
    document.querySelector('.clock-seconds').innerHTML = seconds;

    // If the countdown is over, display a message
    if (distance < 0) {
        clearInterval(x);
        document.querySelector('.clock-container').innerHTML = "EXPIRED";
    }
}, 1000);

// map 
//

function initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 14.456895, lng: 120.944126 }
    });
    
    // Add a click event listener to the map
    map.addListener('click', function(event) {
        // Open Google Maps app with directions from clicked location to the destination
        var url = 'https://www.google.com/maps/dir/?api=1&origin=' +
                event.latLng.lat() + ',' + event.latLng.lng() +
                '&destination=' + endMarker.getPosition().lat() + ',' + endMarker.getPosition().lng();
        window.open(url, '_blank');
    });

    directionsRenderer.setMap(map);

    // Create a marker for the starting point with a label
    var startMarker = new google.maps.Marker({
        position: { lat: 14.536262, lng: 120.982006 },
        map: map,
    });

    // Create a marker for the destination with a label
    var endMarker = new google.maps.Marker({
        position: { lat: 14.402908, lng: 120.903986 },
        map: map,
    });

    // Define the end location
    var start = startMarker.getPosition();
    var end = endMarker.getPosition(); // Use the marker's position as the destination

    // Create a request object for directions
    var request = {
        origin: start, // Use the starting marker's position as the origin
        destination: end,
        travelMode: 'DRIVING'
    };

    // Use the Directions Service to get the route
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            // Display the route on the map
            directionsRenderer.setDirections(result);
        } else {
            console.error('Error:', status);
        }
    });
}

window.onload = function () {
    initMap();
};

// slider 

var TrandingSlider = new Swiper('.tranding-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        }
});

var images = document.querySelectorAll('.tranding-slide-img img');
var currentIndex = 0;

// Function to open the modal and display the clicked image
function openModal(imageSrc) {
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('modalImage');

    modal.style.display = 'block';
    modalImage.src = imageSrc;
    currentIndex = Array.from(images).findIndex(img => img.src === imageSrc);
    updateNavigationButtons();
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

// Function to show the next image in the modal
function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    var nextImageSrc = images[currentIndex].src;
    document.getElementById('modalImage').src = nextImageSrc;
    updateNavigationButtons();
}

// Function to show the previous image in the modal
function showPreviousImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    var previousImageSrc = images[currentIndex].src;
    document.getElementById('modalImage').src = previousImageSrc;
    updateNavigationButtons();
}

// Function to update the state of navigation buttons
function updateNavigationButtons() {
    var prevButton = document.getElementById('prevButton');
    var nextButton = document.getElementById('nextButton');

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === images.length - 1;
}

// Attach click event listeners to each image
images.forEach(function(image) {
    image.addEventListener('click', function() {
        openModal(this.src);
    });
});

// Attach click event listeners to navigation buttons
document.getElementById('prevButton').addEventListener('click', showPreviousImage);
document.getElementById('nextButton').addEventListener('click', showNextImage);












