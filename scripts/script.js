//Elements
const apiKey = "5ObuxzjL3y740CwKHDSWloeaqw5WP0LZ";
const dayThemeButton = document.querySelector("#dayThemeButton");
const nightThemeButton = document.querySelector("#nightThemeButton");
const body = document.querySelector("body");
const logo = document.querySelector("#logo");
const verMas = document.getElementsByClassName("verMas");
const trendsContainer = document.querySelector("#trendsContainer");
const form = document.forms.searchForm;
let previousTagsArray = [];
const previouslySearchedTags = document.querySelector("#previouslySearchedTags");
const searchResultsContainer = document.querySelector("#searchResultsContainer");
const searchResults = document.querySelector("#searchResults");
const gifSuggestionsContainer = document.querySelector("#gifSuggestionsContainer");
const arraySugerencias = ["puppy", "kitten", "meerkat", "penguin"];
let searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const searchSuggestions = document.querySelector("#searchSuggestions");
const flechaDropdown = document.querySelector("#temasButtonContainer label img");
const lupa = document.querySelector("#searchButton img");
let searchTitle = document.querySelector("#searchResults .titleContainer h3");

// Funcionalidad theme
nightThemeButton.addEventListener("click", () => {
    body.id = "night";
    logo.setAttribute("src", "assets/gifOF_logo_dark.png");
    flechaDropdown.setAttribute("src", "assets/forward.svg");
    localStorage.setItem("theme", "night");
})
dayThemeButton.addEventListener("click", () => {
    body.id = "day";
    logo.setAttribute("src", "assets/gifOF_logo.png");
    flechaDropdown.setAttribute("src", "assets/dropdown.svg");
    localStorage.setItem("theme", "day");
})
function theme() {
    let theme = localStorage.getItem("theme");
    if (theme == "night") {
        body.id = "night";
        logo.setAttribute("src", "assets/gifOF_logo_dark.png");
        flechaDropdown.setAttribute("src", "assets/forward.svg");
    } else {
        body.id = "day";
        logo.setAttribute("src", "assets/gifOF_logo.png");
        flechaDropdown.setAttribute("src", "assets/dropdown.svg");
    }
}

//Funcion buscar
async function buscar(keyword, limit) {
    if (keyword == "none") {
        let url = "https://api.giphy.com/v1/gifs/trending?api_key=" + apiKey + "&limit=" + limit + "&rating=G";
        const resp = await fetch(url);
        const datos = await resp.json();
        return datos.data;
    } else {
        let url = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + keyword + "&limit=" + limit + "&offset=0&rating=G&lang=es";
        const resp = await fetch(url);
        const datos = await resp.json();
        searchTitle.innerHTML = "Resultados " + keyword;
        return datos.data;
    }
}

//Funciones para funcionalidad Buscar
const showResults = data => {
    if (data.length < 1) {
        searchResultsContainer.innerHTML = '<p>No se encontraron Gifs</p>'
    }
    else {
        data.forEach(gif => {
            const title = "#" + gif.title.substring(0, (gif.title.length) - 4).replace(" ", "#").replace(" ", "#").replace(" ", "#").replace(" ", "#");
            const src = gif.images.original.url;
            const gifHTML = `
            <h4>${title}</h4>
            <img alt=${title} src=${src}>
            `;
            const gifElement = document.createElement('div');
            gifElement.innerHTML = gifHTML;
            searchResultsContainer.append(gifElement);
        })
    }
}
function crearBusquedaPrevias(value) {
    let valueHTML = `<p class="busquedaPrevia">#${value}</p>`;
    let valueElement = document.createElement('div');
    valueElement.innerHTML = valueHTML;
    previouslySearchedTags.appendChild(valueElement);
}
const getSuggest = async (q) => {
    const response = await fetch(`https://api.giphy.com/v1/tags/related/${q}?api_key=${apiKey}`);
    const suggest = await response.json();
    return suggest.data.splice(0, 3);
}
function addSearchedTag(query) {
    previousTagsArray = JSON.parse(localStorage.getItem("busquedasPrevias"));
    previousTagsArray.unshift(query);
    localStorage.setItem("busquedasPrevias", JSON.stringify(previousTagsArray));
    previouslySearchedTags.innerHTML = "";
    previousTagsArray.forEach((searchedTag) => {
        crearBusquedaPrevias(searchedTag);
    })
    previouslySearchedTags.style.display = "flex";
}

// Funcionalidad Buscar
form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    let query = form.searchInput.value;
    searchResultsContainer.innerHTML = "";
    buscar(query, 10).then(resp => {
        showResults(resp);
    })
    addSearchedTag(query);
    searchSuggestions.style.display = "none";
    searchResults.style.display = "block";
    form.reset()
})
searchInput.addEventListener('keyup', ev => {
    const query = ev.target.value;
    if (query.length < 2) {
        searchSuggestions.style.display = "none";
        form.className = "";
        lupa.setAttribute("src", "assets/lupa_inactive.svg");
        searchButton.disabled = true;
        searchButton.className = "";
        return;
    } else {
        searchButton.disabled = false;
        searchButton.className = "pinkButton";
        form.className = "active";
        getSuggest(query)
            .then(results => {
                searchSuggestions.innerHTML = "";
                let ul = document.createElement("ul");
                results.forEach(result => {
                    let li = document.createElement("li");
                    li.innerHTML = result.name;
                    li.className = "suggestedWord";
                    ul.appendChild(li);
                })
                searchSuggestions.appendChild(ul);
                searchSuggestions.style.display = "flex";
            })
        if (localStorage.getItem("theme") == "night") {
            lupa.setAttribute("src", "assets/lupa_light.svg");
        } else {
            lupa.setAttribute("src", "assets/lupa.svg");
        }
    }
})
body.addEventListener("click", () => {
    searchSuggestions.style.display = "none";
})

//Busquedas indirectas
document.body.addEventListener('click', (ev) => {
    if (ev.target.className === 'verMas') {
        let query = ev.target.id;
        buscar(query, 10).then(resp => {
            showResults(resp);
        })
        searchResultsContainer.innerHTML = "";
        searchResults.style.display = "block";
        addSearchedTag(query);
    }
}, false);

document.body.addEventListener('click', (ev) => {
    if (ev.target.className === 'busquedaPrevia') {
        let query = ev.target.textContent.replace("#", "");
        buscar(query, 10).then(resp => {
            showResults(resp);
        })
        searchResultsContainer.innerHTML = "";
        searchResults.style.display = "block";
        addSearchedTag(query);
    }
}, false);

document.body.addEventListener('click', (ev) => {
    if (ev.target.className === 'suggestedWord') {
        let query = ev.target.textContent;
        buscar(query, 10).then(resp => {
            showResults(resp)
        })
        searchResultsContainer.innerHTML = "";
        searchResults.style.display = "block";
        addSearchedTag(query);
    }
}, false);

// Funcionalidad Sugerencias
const traerSugerencias = data => {
    data.forEach(gif => {
        const src = gif.images.original.url;
        const verMasId = gif.title.slice(0, gif.title.indexOf(" "));
        const title = "#" + gif.title.substring(0, (gif.title.length) - 4).replace(" ", "").replace(" ", "").replace(" ", "");
        const gifHTML =
            `<img src="assets/button3.svg" alt="x" id="x">
            <h2>${title}</h2>
            <a class="verMas" id=${verMasId} href="#searchResults">Ver más…</a>
            <img alt=${title} src=${src} class="gifSuggested">`;
        const gifElement = document.createElement('div');
        gifElement.innerHTML = gifHTML;
        gifSuggestionsContainer.append(gifElement);
    })
}

// Funcionalidad tendencias 
const traerTendencias = data => {
    data.forEach(gif => {
        const src = gif.images.original.url;
        const title = "#" + gif.title.substring(0, (gif.title.length) - 4).replace(" ", "#").replace(" ", "#").replace(" ", "#").replace(" ", "#");
        const gifHTML = `
        <img alt=${title} src=${src}>
        <h4>${title}</h4>`;
        const gifElement = document.createElement('div');
        gifElement.innerHTML = gifHTML;
        trendsContainer.append(gifElement);
    })
}


// ONLOAD

function controlLocalStorage() {
    if (JSON.parse(localStorage.getItem("busquedasPrevias")) == null) {
        localStorage.setItem("busquedasPrevias", JSON.stringify([]));
    }
}


window.onload = () => {
    //Control Local Storage
    controlLocalStorage()
    //Mantener Theme 
    theme();
    //Guardar busquedas
    let arrayBusquedas = JSON.parse(localStorage.getItem("busquedasPrevias"));
    arrayBusquedas.forEach(value => {
        crearBusquedaPrevias(value);
    })
    previouslySearchedTags.setAttribute("style", "display: none;")
    //Traer tendencias
    trendsContainer.innerHTML = ""
    buscar("none", 10).then(resp => {
        traerTendencias(resp);
    })
    //Traer sugerencias
    gifSuggestionsContainer.innerHTML = ""
    arraySugerencias.forEach(sugerencia => {
        buscar(sugerencia, 1).then(resp => {
            traerSugerencias(resp);
        })
    })
    
}