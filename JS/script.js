const timeline = document.querySelector("#timeline");


let target = window.scrollX;

window.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
        target += e.deltaY * 3;
        target = Math.max(0, Math.min(target, document.documentElement.scrollWidth - innerWidth));
        e.preventDefault();
    }
}, { passive: false });

function animate() {
    window.scrollTo(window.scrollX + (target - window.scrollX) * 0.09, 0);
    requestAnimationFrame(animate);
}

function newEvent(year, events) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("event");

    newDiv.innerHTML = `
        <span class="year">${year}</span>

        <div class="label">
            <div class="event-list">
                ${events.map(event => `
                    <div class="event-title">${event.title}</div>
                `).join("")}
            </div>

            ${events.length > 2 ? `
                <button class="show-more">Show more</button>
            ` : ""}
        </div>
    `;

    const button = newDiv.querySelector(".show-more");
    const label = newDiv.querySelector(".label");

    label.addEventListener("click", () => {
        console.log("clicked")
    })

    if (button) {
        const eventList = newDiv.querySelector(".event-list");

        button.addEventListener("click", () => {
            const expanded = label.classList.toggle("expanded");

            if (expanded) {
                eventList.style.height = eventList.scrollHeight + "px";
            } else {
                eventList.style.height = "70px";
            }

            button.textContent = expanded ? "Show less" : "Show more";
        });
    }

    timeline.appendChild(newDiv);
}

fetch('./JSON/timeline-events.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(yearGroup => {
            newEvent(yearGroup.year, yearGroup.events);
        });

        particlesJS("particles-js", {"particles":{"number":{"value":66,"density":{"enable":true,"value_area":1025.8919341219544}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.4,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":5,"random":true,"anim":{"enable":true,"speed":0.5,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":0.2,"width":0.3},"move":{"enable":true,"speed":0.2,"direction":"none","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});
    });

animate();

