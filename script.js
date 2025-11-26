/******************************************************
 * StudySpot McMaster - Moderate Full Functionality
 * - Search
 * - Filter Chips
 * - Sorting
 * - Favorites
 * - Visited List
 * - Reviews
 * - Modal
 * - LocalStorage
 ******************************************************/

// ================ DATA =================
const PLACES = [
    {
        id: "mills",
        name: "Mills Library – Silent Study Zone",
        building: "Mills",
        area: "Central Campus",
        noise: "quiet",
        crowdedness: "medium",
        tags: ["quiet", "outlets", "near-food"],
        imgClass: "img-mills",
        locationText: "Mills Library, 4th Floor",
        amenities: ["Silent zone", "Outlets", "Great Wi-Fi"],
        seedReviews: [
            { rating: 5, text: "Super quiet, ideal for exams.", author: "Student" }
        ]
    },
    {
        id: "thode",
        name: "Thode Library – Basement",
        building: "Thode",
        area: "West Campus",
        noise: "moderate",
        crowdedness: "low",
        tags: ["outlets"],
        imgClass: "img-thode",
        locationText: "Thode Library, Basement",
        amenities: ["Outlets", "Whiteboards"],
        seedReviews: [
            { rating: 4, text: "Solid alternative to Mills.", author: "Eng Student" }
        ]
    },
    {
        id: "musc",
        name: "MUSC – 2nd Floor Lounge",
        building: "MUSC",
        area: "Central Campus",
        noise: "lively",
        crowdedness: "high",
        tags: ["near-food", "group"],
        imgClass: "img-musc",
        locationText: "MUSC, 2nd Floor",
        amenities: ["Social space", "Good for groups"],
        seedReviews: [
            { rating: 3, text: "Great for meetings, noisy.", author: "1st Year" }
        ]
    },
    {
        id: "innis_library",
        name: "Innis Library",
        building: "Kenneth Taylor Hall (KTH)",
        area: "Central Campus",
        type: "library",
        noise: "quiet",
        crowdedness: "low",
        tags: ["quiet", "outlets"],
        imgClass: "img-innis",
        locationText: "KTH | Main Floor",
        amenities: [
            "Quiet environment",
            "Individual study desks",
            "Business student hub"
        ],
        seedReviews: [
            { rating: 5, text: "Quietest study spot on campus.", author: "Commerce Student" }
        ]
    },
    {
        id: "healthsci_library",
        name: "Health Sciences Library",
        building: "Health Sciences Centre (HSC)",
        area: "North Campus",
        type: "library",
        noise: "quiet",
        crowdedness: "medium",
        tags: ["quiet", "outlets"],
        imgClass: "img-hsl",
        locationText: "HSC | Main Floor",
        amenities: ["Quiet zones", "Outlets", "Med/Health Sci focus"],
        seedReviews: [
            { rating: 4, text: "Ideal for long study sessions.", author: "Med Student" }
        ]
    },
    {
        id: "lyons_media_centre",
        name: "Lyons New Media Centre",
        building: "Mills Library",
        area: "Central Campus",
        type: "library-space",
        noise: "moderate",
        crowdedness: "medium",
        tags: ["group", "computers"],
        imgClass: "img-lyons",
        locationText: "Mills Library | 4th Floor",
        amenities: ["Media editing booths", "Group tables", "Mac desktops"],
        seedReviews: [
            { rating: 4, text: "Creative vibe, good for multimedia projects.", author: "Multimedia Student" }
        ]
    },
    {
        id: "starbucks_musc",
        name: "Starbucks – MUSC",
        building: "MUSC",
        area: "Central Campus",
        type: "cafe",
        noise: "lively",
        crowdedness: "high",
        tags: ["near-food", "lively"],
        imgClass: "img-starbucks",
        locationText: "MUSC | Main Floor",
        amenities: ["Coffee", "Soft seating", "High foot traffic"],
        seedReviews: [
            { rating: 3, text: "Too loud for studying, good for casual work.", author: "Humanities Student" }
        ]
    },
    {
        id: "the_grind_musc",
        name: "The Grind Café",
        building: "TwelvEighty / MUSC",
        area: "Central Campus",
        type: "cafe",
        noise: "moderate",
        crowdedness: "medium",
        tags: ["near-food", "group"],
        imgClass: "img-grind",
        locationText: "TwelvEighty | Under Arts Quad",
        amenities: ["Cozy seating", "Good music", "Great coffee"],
        seedReviews: [
            { rating: 5, text: "Best café vibe on campus.", author: "Art Sci Student" }
        ]
    },
    {
        id: "fireball_cafe_jhe",
        name: "Fireball Café",
        building: "John Hodgins Engineering Building (JHE)",
        area: "West Campus",
        type: "cafe",
        noise: "moderate",
        crowdedness: "medium",
        tags: ["group", "outlets"],
        imgClass: "img-fireball",
        locationText: "JHE | Main Floor",
        amenities: ["Tables", "Outlets", "Engineering crowd"],
        seedReviews: [
            { rating: 4, text: "Great between lectures.", author: "Software Eng" }
        ]
    },
    {
        id: "secondcup_pgcll",
        name: "Second Cup – PGCLL",
        building: "PGCLL",
        area: "North Campus",
        type: "cafe",
        noise: "moderate",
        crowdedness: "medium",
        tags: ["near-food", "bright"],
        imgClass: "img-secondcup",
        locationText: "PGCLL | Main Floor",
        amenities: ["Bright natural light", "Lots of seating"],
        seedReviews: [
            { rating: 4, text: "Great space if you're in residence.", author: "1st Year" }
        ]
    },
    {
        id: "iahs_cafe",
        name: "IAHS Café",
        building: "IAHS",
        area: "North Campus / Mohawk-Mac",
        type: "cafe",
        noise: "moderate",
        crowdedness: "high",
        tags: ["near-food", "group"],
        imgClass: "img-iahs",
        locationText: "IAHS | Main Floor Food Court",
        amenities: ["Large seating area", "Bright lighting", "Nearby vending"],
        seedReviews: [
            { rating: 3, text: "Busy but lots of space.", author: "Nursing Student" }
        ]
    }
];

const placeMap = PLACES.reduce((m, p) => (m[p.id] = p, m), {});

// ================ STATE =================
const STATE_KEY = "studyspot_v1";
let state = {
    favorites: [],
    visited: [],
    reviews: {} // reviews[placeId] = [...]
};

// ================ LOAD / SAVE =================
function loadState() {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return;
    try {
        state = { ...state, ...JSON.parse(raw) };
    } catch (e) {
        console.error("Failed to load state");
    }
    state.visited = [...new Set(state.visited)];
}
function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

// ================ UTILITIES =================
function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
}

function getAllReviews(id) {
    return [...placeMap[id].seedReviews, ...(state.reviews[id] || [])];
}

function getRating(id) {
    const rev = getAllReviews(id);
    if (rev.length === 0) return { avg: 0, count: 0 };
    const sum = rev.reduce((a, r) => a + r.rating, 0);
    return { avg: sum / rev.length, count: rev.length };
}

// ================ RENDERING =================
let searchQuery = "";
let activeTags = new Set();
let sortOption = "recommended";

// Filter + sort the places
function getVisiblePlaces() {
    let list = PLACES.slice();

    if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        list = list.filter(p =>
            (p.name + " " + p.building + " " + p.area + " " + p.tags.join(" "))
                .toLowerCase()
                .includes(q)
        );
    }

    if (activeTags.size > 0) {
        list = list.filter(p =>
            [...activeTags].every(t => p.tags.includes(t))
        );
    }

    list.sort((a, b) => {
        const ra = getRating(a.id).avg;
        const rb = getRating(b.id).avg;

        if (sortOption === "rating-desc") return rb - ra;
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "crowdedness-asc") {
            const order = { low: 0, medium: 1, high: 2 };
            return order[a.crowdedness] - order[b.crowdedness];
        }

        // recommended = highest rating
        return rb - ra;
    });


    return list;
}

function getVisibleFavorites() {
    let list = state.favorites
        .map(id => placeMap[id])
        .filter(Boolean);

    if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        list = list.filter(p =>
            (p.name + " " + p.building + " " + p.area + " " + p.tags.join(" "))
                .toLowerCase()
                .includes(q)
        );
    }

    if (activeTags.size > 0) {
        list = list.filter(p =>
            [...activeTags].every(t => p.tags.includes(t))
        );
    }

    list.sort((a, b) => {
        const ra = getRating(a.id).avg;
        const rb = getRating(b.id).avg;

        if (sortOption === "rating-desc") return rb - ra;
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "crowdedness-asc") {
            const order = { low: 0, medium: 1, high: 2 };
            return order[a.crowdedness] - order[b.crowdedness];
        }
        return rb - ra; // recommended
    });

    return list;
}


// Create a card DOM element
function createPlaceCard(place) {
    const { avg, count } = getRating(place.id);
    const isFav = state.favorites.includes(place.id);

    const card = document.createElement("div");
    card.className = "place-card";
    card.dataset.placeId = place.id;

    card.innerHTML = `
      <div class="place-image ${place.imgClass}"></div>
      <div class="place-body">
        <div class="place-header-row">
          <h3>${place.name}</h3>
          <span class="place-rating">${avg.toFixed(1)}★</span>
        </div>
        <p>${place.building} | ${place.area}</p>
  
        <div style="margin:6px 0;">
          ${place.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
  
        <button class="primary-btn" data-action="details">Details</button>

        <button class="secondary-btn" data-action="favorite">
        ${isFav ? "★ Favorited" : "☆ Favorite"}
        </button>

        <button class="secondary-btn" data-action="visited">
        ${state.visited.includes(place.id) ? "✓ Visited" : "Mark Visited"}
        </button>

      </div>
    `;
    return card;
}

function renderHome() {
    const c = document.getElementById("place-list");
    c.innerHTML = "";
    const list = getVisiblePlaces();
    if (list.length === 0) {
        c.innerHTML = `<p>No results.</p>`;
        return;
    }
    list.forEach(p => c.appendChild(createPlaceCard(p)));
}

function renderFavorites() {
    const c = document.getElementById("favorites-list");
    const empty = document.getElementById("favorites-empty");
    c.innerHTML = "";

    const list = getVisibleFavorites();

    if (list.length === 0) {
        empty.style.display = "block";
        return;
    }
    empty.style.display = "none";

    list.forEach(p => c.appendChild(createPlaceCard(p)));
}


function renderVisited() {
    const c = document.getElementById("visited-list");
    const empty = document.getElementById("visited-empty");
    c.innerHTML = "";

    if (state.visited.length === 0) {
        empty.style.display = "block";
        return;
    }
    empty.style.display = "none";

    state.visited.forEach(id => {
        const p = placeMap[id];
        const rating = getRating(id).avg.toFixed(1);

        const div = document.createElement("div");
        div.className = "visited-card";
        div.dataset.placeId = id;

        div.innerHTML = `
            <div class="visited-card-title">${p.name}</div>
            <div class="visited-meta">
              ⭐ ${rating}
              &nbsp;•&nbsp;
              ${p.area}
            </div>
            <button class="secondary-btn" data-action="details">View</button>
        `;

        c.appendChild(div);
    });
}

// ================ MODAL =================
let currentPlaceId = null;

function openModal(id) {
    currentPlaceId = id;
    const p = placeMap[id];

    document.getElementById("modal-title").textContent = p.name;
    document.getElementById("modal-location").textContent = p.locationText;

    // Amenities
    const am = document.getElementById("modal-amenities");
    am.innerHTML = p.amenities.map(a => `<li>${a}</li>`).join("");

    // Reviews
    renderModalReviews(id);

    // Update modal favorite button state
    const favBtn = document.getElementById("modal-favorite-btn");
    if (state.favorites.includes(id)) {
        favBtn.textContent = "★ Favorited";
    } else {
        favBtn.textContent = "☆ Add to Favorites";
    }

    // Mark visited
    if (!state.visited.includes(id)) {
        state.visited.push(id);
        saveState();
        renderVisited();
    }

    document.getElementById("details-modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("details-modal").classList.add("hidden");
    document.getElementById("visit-note").classList.add("hidden");
    document.getElementById("review-form").classList.add("hidden");
}

function renderModalReviews(id) {
    const container = document.getElementById("modal-reviews");
    container.innerHTML = "";
    const rev = getAllReviews(id);

    // Rating
    const r = getRating(id);
    document.getElementById("modal-rating-value").textContent = r.avg.toFixed(1) + "★";
    document.getElementById("modal-rating-count").textContent = r.count;

    rev.forEach(review => {
        const div = document.createElement("div");
        div.className = "review-card";
        div.innerHTML = `
        <p><strong>${review.rating}★</strong> — ${review.text}</p>
        <p><em>${review.author}</em></p>
      `;
        container.appendChild(div);
    });
}

// ================ REVIEW SUBMISSION =================
function submitReview(e) {
    e.preventDefault();
    if (!currentPlaceId) return;

    const rating = parseInt(document.getElementById("review-rating").value);
    const text = document.getElementById("review-text").value.trim();
    const author = document.getElementById("review-author").value.trim() || "Anonymous";

    if (!rating || !text) {
        showToast("Please give a rating and review.");
        return;
    }

    if (!state.reviews[currentPlaceId]) state.reviews[currentPlaceId] = [];
    state.reviews[currentPlaceId].push({ rating, text, author });
    saveState();

    document.getElementById("review-form").classList.add("hidden");
    renderModalReviews(currentPlaceId);
    renderHome();
    renderFavorites();
    showToast("Review added — this spot is now in your Visited list");
}

// ================ FAVORITES =================
function toggleFavorite(id) {
    if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(x => x !== id);
        showToast("Removed from favorites");
    } else {
        state.favorites.push(id);
        showToast("Added to favorites");
    }
    saveState();
    renderHome();
    renderFavorites();
}

// ================ EVENT LISTENERS =================
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    renderHome();
    renderFavorites();
    renderVisited();

    // TAB switching
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            const target = item.dataset.tab;

            // highlight active icon
            document.querySelectorAll(".nav-item")
                .forEach(i => i.classList.remove("nav-active"));
            item.classList.add("nav-active");

            // show correct tab panel
            document.querySelectorAll(".tab-panel")
                .forEach(p => p.classList.remove("tab-panel--active"));
            document.getElementById(`tab-${target}`).classList.add("tab-panel--active");
        });
    });

    // Card click (delegated)
    function handleCardClick(e) {
        let btn = e.target.closest("[data-action]");
        if (!btn) return;

        const action = btn.dataset.action;
        const card = btn.closest("[data-place-id]");
        const id = card.dataset.placeId;

        if (action === "details") openModal(id);
        if (action === "favorite") toggleFavorite(id);

        if (action === "visited") {
            if (!state.visited.includes(id)) {
                state.visited.push(id);
                showToast("Marked as visited");
            } else {
                state.visited = state.visited.filter(x => x !== id);
                showToast("Removed from visited");
            }

            saveState();
            renderVisited();
            renderHome();
            renderFavorites();
        }

    }

    document.getElementById("place-list").addEventListener("click", handleCardClick);
    document.getElementById("favorites-list").addEventListener("click", handleCardClick);
    document.getElementById("visited-list").addEventListener("click", handleCardClick);

    // Search
    document.getElementById("search-input").addEventListener("input", e => {
        searchQuery = e.target.value;
        renderHome();
        renderFavorites();
    });


    // Filter chips
    document.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const tag = chip.dataset.tag;
            if (activeTags.has(tag)) {
                activeTags.delete(tag);
                chip.classList.remove("chip--active");
            } else {
                activeTags.add(tag);
                chip.classList.add("chip--active");
            }
            renderHome();
            renderFavorites();
        });
    });

    // SORT DROPDOWN LOGIC
    const sortToggle = document.getElementById("sort-toggle");
    const sortDropdown = document.getElementById("sort-dropdown");
    let sortOpen = false;

    // open/close dropdown
    sortToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent immediate close
        sortDropdown.classList.toggle("hidden");
        sortOpen = !sortOpen;
    });

    // selecting an option
    document.querySelectorAll(".sort-option").forEach(option => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            sortOption = option.dataset.sort;
            renderHome();
            renderFavorites();

            // Keep label simple
            sortToggle.textContent = "Sort ▾";

            sortDropdown.classList.add("hidden");
            sortOpen = false;
        });
    });

    // clicking outside closes dropdown
    document.addEventListener("click", () => {
        if (sortOpen) {
            sortDropdown.classList.add("hidden");
            sortOpen = false;
        }
    });


    // Modal actions
    document.getElementById("modal-close").addEventListener("click", closeModal);

    const modalFavBtn = document.getElementById("modal-favorite-btn");

    modalFavBtn.addEventListener("click", () => {
        if (!currentPlaceId) return;

        toggleFavorite(currentPlaceId);

        // Update button label
        if (state.favorites.includes(currentPlaceId)) {
            modalFavBtn.textContent = "★ Favorited";
        } else {
            modalFavBtn.textContent = "☆ Add to Favorites";
        }
    });

    // Open review form button
    const openReviewBtn = document.getElementById("open-review-form");
    if (openReviewBtn) {
        openReviewBtn.addEventListener("click", () => {
            document.getElementById("review-form").classList.remove("hidden");
        });
    }

    // Submit review
    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
        reviewForm.addEventListener("submit", submitReview);
    }

});
