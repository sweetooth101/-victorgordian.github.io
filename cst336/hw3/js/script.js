document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#searchForm");
    form.addEventListener("submit", handleSearch); 
});

async function handleSearch(event) {
    event.preventDefault(); 

    const nameInput = document.querySelector("#nameInput");
    const speciesSelect = document.querySelector("#speciesSelect");
    const error = document.querySelector("#error");
    const resultsContainer = document.querySelector("#results");

    error.textContent = "";
    resultsContainer.innerHTML = "";

    const name = nameInput.value.trim();
    const species = speciesSelect.value;

    if (name.length < 2) {
        error.textContent = "Please enter at least 2 characters for the name.";
        nameInput.classList.add("is-invalid");
        return;
    } else {
        nameInput.classList.remove("is-invalid");
    }


    let url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`;
    if (species !== "any") {
        url += `&species=${encodeURIComponent(species)}`;
    }

    try {
        const response = await fetch(url);  

        if (!response.ok) {
            if (response.status === 404) {
                error.textContent = "No characters found. Try a different search.";
                return;
            }
        }

        const data = await response.json();

        data.results.forEach(character => {
            const col = document.createElement("div");
            col.className = "col-sm-6 col-md-4 col-lg-3";

            col.innerHTML = `
                <div class="card h-100 shadow-sm character-card">
                    <img src="${character.image}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                        <p class="card-text mb-1"><strong>Species:</strong> ${character.species}</p>
                        <p class="card-text mb-0"><strong>Origin:</strong> ${character.origin.name}</p>
                    </div>
                </div>
            `;

            resultsContainer.appendChild(col);
        });

    } catch (err) {
        console.error(err);
        error.textContent = "Something went wrong. Please try again later.";
    }
}