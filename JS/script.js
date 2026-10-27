const timeline = document.querySelector("#timeline");

let target = window.scrollX;

function getMaxScroll() {
    return Math.max(
        0,
        document.documentElement.scrollWidth - window.innerWidth
    );
}

function setupInfoPanel(infoPanel, clickBlocker) {
    const burgerClosed = infoPanel.querySelector("#info-panel-sidebar-closed")
    const burger = infoPanel.querySelector("#info-panel-sidebar-burger")
    const infoPanelSidebar = infoPanel.querySelector("#info-panel-sidebar")
    const exitInfoPanel = infoPanel.querySelector("#exit-info-panel")

    let sidebarState = false

    exitInfoPanel.addEventListener("click", () => {
        infoPanel.remove()
        clickBlocker.remove()
    });
    
    burger.addEventListener("click", () => {
    if (!sidebarState) return;
    
    burgerClosed.style.translate = "0"
    infoPanelSidebar.style.translate = "-100%";
    infoPanelSidebar.style.boxShadow = "none";
    infoPanelSidebar.style.opacity = "0.8"
    infoPanelSidebar.style.pointerEvents = "none"
    sidebarState = !sidebarState
    })

    burgerClosed.addEventListener("mousedown", () => {
        burgerClosed.style.translate = "-100%"

        document.addEventListener("mouseup", () => {
            if (sidebarState) return;

            infoPanelSidebar.style.translate = "0 0";
            infoPanelSidebar.style.boxShadow = "20px 15px 10px rgba(0, 0, 0, 0.24);";
            infoPanelSidebar.style.opacity = "1"
            infoPanelSidebar.style.pointerEvents = "all"
            sidebarState = !sidebarState
        }, {once: true});
    })
}

function openInfoPanel(events, id) {
    const clickBlocker = document.createElement("div")
    const infoPanel = document.createElement("div");
    clickBlocker.classList = "infoPanelClickBlocker"
    infoPanel.classList = "info-panel glass-card"
    infoPanel.style.display = "flex"
    infoPanel.id = id
    infoPanel.innerHTML = `
    <div class="info-panel-sidebar" id="info-panel-sidebar">
        <div class="info-panel-sidebar-quick-action-wrapper">
            <div class="group info-panel-search-bar">
                <svg viewBox="0 0 24 24" aria-hidden="true" class="search-icon">
                    <g>
                    <path
                        d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
                    ></path>
                    </g>
                </svg>

                <input
                    id="info-panel-search-bar-input"
                    class="input info-panel-search-bar-input"
                    type="search"
                    placeholder="Search..."
                    name="searchbar"
                />
            </div>
            <div class="info-panel-sidebar-burger-quick-action" id="info-panel-sidebar-burger">
                <label class="burger x" for="burger">
                    <input id="burger">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </div>
            
        </div>
        
        <div class="info-panel-shortcut-wrapper">
            <div class="info-panel-shortcut">
                <button class="btn-28 info-panel-shortcut-button">Test Button 1</button>
            </div>
            <div class="info-panel-shortcut">
                <button class="btn-28 info-panel-shortcut-button">Test Button 2</button>
            </div>
        </div>
    </div>

    <div class="exit-info-panel" id="exit-info-panel">
        <div class="exit-info-panel-x">
            <label class="burger x">
                <input id="burger-x">
                <span></span>
                <span></span>
                <span></span>
            </label>
        </div>
    </div>

    <div class="info-panel-sidebar-closed" id="info-panel-sidebar-closed">
        <div class="info-panel-sidebar-burger-quick-action" id="info-panel-sidebar-burger-closed">
            <label class="burger">
                <input id="burger-closed">
                <span></span>
                <span></span>
                <span></span>
            </label>
        </div>
    </div>

    <div class="info-panel-articles-wrapper">
        <div class="articles-columns">
            ${events.map(event => `
                <div class="info-panel-article">
                    <div class="article-title-wrapper">
                        <h1 class="article-title">${event.title}</h1>
                    </div>
                    <div class="article-author-wrapper">
                        <span class="article-author">Person</span>
                    </div>

                    <div class="article-header-image"></div>

                    <div class="article-description-wrapper">
                        <span class="article-description">
                            ${event.description ?? "No description"}
                        </span>
                    </div>

                    <div class="article-links-wrapper"></div>
                </div>
            `).join("")}
        </div>
    </div>
    `

    document.body.appendChild(infoPanel);
    document.body.appendChild(clickBlocker);

    setupInfoPanel(infoPanel, clickBlocker)
}

function animate() {
    target = Math.min(target, getMaxScroll());

    const difference = target - window.scrollX;

    if (Math.abs(difference) > 0.1) {
        window.scrollTo(
            window.scrollX + difference * 0.09,
            0
        );
    }

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
    label.id = Math.floor(Math.random() * 1000000000);

    label.addEventListener("click", (e) => {
        if (e.target.closest(".show-more")) return;

        openInfoPanel(events, label.id);
    });

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

function makeSquiggleClipPath({
    width = 64,
    height = 24,
    thickness = 3,
    amplitude = 9
} = {}) {
    const cy = height / 2;

    const points = [
        [0, cy],
        [width * 0.2, cy - amplitude],
        [width * 0.4, cy + amplitude],
        [width * 0.6, cy - amplitude],
        [width * 0.8, cy + amplitude],
        [width, cy]
    ];

    const upper = [];
    const lower = [];

    for (let i = 0; i < points.length; i++) {
        const previous = points[Math.max(0, i - 1)];
        const next = points[Math.min(points.length - 1, i + 1)];

        const dx = next[0] - previous[0];
        const dy = next[1] - previous[1];
        const length = Math.hypot(dx, dy);

        const nx = -dy / length * thickness / 2;
        const ny = dx / length * thickness / 2;

        upper.push([points[i][0] + nx, points[i][1] + ny]);
        lower.unshift([points[i][0] - nx, points[i][1] - ny]);
    }

    return `polygon(${
        [...upper, ...lower]
            .map(([x, y]) =>
                `${(x / width) * 100}% ${(y / height) * 100}%`
            )
            .join(", ")
    })`;
}

function newTimeBreak(yearsSkipped) {
    const breakDiv = document.createElement("div");
    breakDiv.classList.add("time-break");

    breakDiv.innerHTML = `
        <div class="time-break-content">
            <svg viewBox="0 0 80 30" width="80" height="30">
                <path
                    d="M0 15 L15 15 L25 5 L35 25 L45 5 L55 25 L65 15 L80 15"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    vector-effect="non-scaling-stroke"
                    stroke-linejoin="miter"
                />
            </svg>

            <span>${yearsSkipped.toLocaleString("en-US")} years skipped</span>
        </div>
    `;

    timeline.appendChild(breakDiv);
}

function parseYear(year) {
    const match = String(year).trim()
        .match(/^([\d,]+)\s*(BCE|BC|CE|AD)$/i);

    if (!match) {
        throw new Error(`Invalid year: ${year}`);
    }

    const number = Number(match[1].replaceAll(",", ""));
    const era = match[2].toUpperCase();

    return era === "BCE" || era === "BC"
        ? 1 - number
        : number;
}

function fitTimelineWidth() {
    const items = Array.from(timeline.children);
    const gap = parseFloat(getComputedStyle(timeline).columnGap) || 0;
    const width = items.reduce(
        (total, item) => total + item.getBoundingClientRect().width, 0
    ) + Math.max(0, items.length - 1) * gap;

    timeline.style.flex = "0 0 auto";
    timeline.style.width = `${width}px`;

    const wrapper = timeline.closest(".timeline-wrapper");
    const style = getComputedStyle(wrapper);
    wrapper.style.width = `${width
        + parseFloat(style.paddingLeft)
        + parseFloat(style.paddingRight)}px`;
}

function initScrollingParticles(id, settings) {
    const host = document.getElementById(id);
    const viewport = document.createElement("div");
    viewport.id = `${id}-viewport`;
    viewport.style.cssText =
        "position:sticky;left:0;width:100vw;max-width:100%;height:100%;";
    host.replaceChildren(viewport);

    settings.interactivity.events.resize = false;
    particlesJS(viewport.id, settings);
    const particles = window.pJSDom[window.pJSDom.length - 1].pJS;
    const canvas = particles.canvas.el;
    canvas.style.pointerEvents = "none";

    particles.fn.vendors.densityAutoParticles = () => {
        let count = particles.particles.number.value;
        if (particles.particles.number.density.enable) {
            let area = particles.canvas.w * particles.canvas.h / 1000;
            if (particles.tmp.retina) area /= 2 * particles.canvas.pxratio;
            count = Math.ceil(area * count /
                particles.particles.number.density.value_area);
        }
        const difference = count - particles.particles.array.length;
        if (difference > 0) particles.fn.modes.pushParticles(difference);
        else if (difference < 0) particles.fn.modes.removeParticles(-difference);
    };

    function resizeParticles() {
        particles.fn.retinaInit();
        const ratio = particles.canvas.pxratio;
        particles.canvas.w = host.clientWidth * ratio;
        particles.canvas.h = host.clientHeight * ratio;
        canvas.width = Math.ceil(viewport.clientWidth * ratio);
        canvas.height = Math.ceil(viewport.clientHeight * ratio);
        particles.fn.vendors.densityAutoParticles();
    }

    const drawParticles = particles.fn.particlesDraw;
    particles.fn.particlesDraw = () => {
        const offset = viewport.getBoundingClientRect().left
            - host.getBoundingClientRect().left;
        const ctx = particles.canvas.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1,
            -offset * particles.canvas.pxratio, 0);
        drawParticles();
        ctx.restore();
    };

    particles.fn.particlesEmpty();
    resizeParticles();
    window.addEventListener("resize", resizeParticles);
}

window.addEventListener("resize", fitTimelineWidth);


window.addEventListener("wheel", (e) => {
    const infoPanel = document.querySelector(".info-panel");

    if (infoPanel) {
        // Allow scrolling inside the articles
        if (e.target.closest(".info-panel-articles-wrapper")) {
            return;
        }

        // Block scrolling everywhere else
        e.preventDefault();
        return;
    }

    // Normal timeline scrolling
    if (e.deltaY !== 0) {
        e.preventDefault();

        target += e.deltaY * 3;

        target = Math.max(
            0,
            Math.min(target, getMaxScroll())
        );
    }
}, { passive: false });


fetch('./JSON/timeline-events.json')
    .then(response => response.json())
    .then(data => {
        const sortedData = [...data].sort(
            (a, b) => parseYear(a.year) - parseYear(b.year)
        );

        sortedData.forEach((yearGroup, index) => {
            if (index > 0) {
                const previousYear = parseYear(sortedData[index - 1].year);
                const currentYear = parseYear(yearGroup.year);

                const emptyYears = currentYear - previousYear - 1;

                if (emptyYears >= 25) {
                    newTimeBreak(emptyYears);
                }
            }

            newEvent(yearGroup.year, yearGroup.events);
        });


        fitTimelineWidth();

        initScrollingParticles("particles-js", {"particles":{"number":{"value":66,"density":{"enable":true,"value_area":1025.8919341219544}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.4,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":5,"random":true,"anim":{"enable":true,"speed":0.5,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":0.2,"width":0.3},"move":{"enable":true,"speed":0.2,"direction":"none","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});
    });

animate();

