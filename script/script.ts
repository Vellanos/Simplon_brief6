import api_key from "./api_key"
import grogu from "../Assets/img/grogu.jpeg"

//Variable pour menu burguer
const toggler = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".navlinks-container");

//Variable pour carousel
const sliders: Element | null = document.querySelector(".carousel")
const arrowL: Element | null = document.querySelector("#arrow-left")
const arrowR: Element | null = document.querySelector("#arrow-right")
const most_popular: Element | null = document.querySelector("#most-popular")
const kid: Element | null = document.querySelector("#kid")
const most_like: Element | null = document.querySelector("#most-like")

let img_info: HTMLCollection | string
let titres
let images
let overviews
let vote_averages
let scrollPerClick: number = 200
let ImagePadding: number = 20
let scrollAmount: number = 0
const link_site: string = "https://api.themoviedb.org/3" //Lien fixe de l'api du site
const img_base_url = "https://image.tmdb.org/t/p/w154/"
let research: string = "/discover/movie?sort_by=popularity.desc" // partie pour définir notre recherche

//Variable pour la recherche
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const accueil = document.querySelector(".accueil")
const search = document.querySelector("#sec-search")
const image_contener = document.querySelector(".image-contener")
const header = document.querySelector("#header")
const back = document.querySelector("#bouton-back")
const next = document.querySelector("#bouton-next")
const home = document.querySelector("#bouton-home")
const pagination = document.querySelector("#nombre-de-page")
const res_search = document.querySelector("#res-search")

let page: number = 1
let page_max: number = 0

//Gestion du menu burguer
const toggleNav = e => {
    // Animation du bouton
    toggler?.classList.toggle("open");

    const ariaToggle =
        toggler?.getAttribute("aria-expanded") === "true" ? "false" : "true";
    toggler?.setAttribute("aria-expanded", ariaToggle);

    // Slide de la navigation
    navLinksContainer?.classList.toggle("open");
};

toggler?.addEventListener("click", toggleNav);

new ResizeObserver(entries => {
    if (entries[0].contentRect.width <= 900 && navLinksContainer) {
        navLinksContainer.style.transition = "transform 0.4s ease-out";
    } else if (navLinksContainer) {
        navLinksContainer.style.transition = "none";
    }
}).observe(document.body)

//Gestion du carousel
//Appel la fonction pour afficher le premier caroussel
showMovieData()

if (arrowL) {
    arrowL.addEventListener('click', () => sliderScrollLeft())
}

if (arrowR) {
    arrowR.addEventListener('click', () => sliderScrollRight())
}

if (most_popular) {
    most_popular.addEventListener('click', () => switchResearch(1))
}

if (kid) {
    kid.addEventListener('click', () => switchResearch(2))
}

if (most_like) {
    most_like.addEventListener('click', () => switchResearch(3))
}

//Fonction pour gérer le slide du caroussel
//Fonction pour aller sur la gauche
function sliderScrollLeft() {
    sliders?.scrollTo({
        top: 0,
        left: (scrollAmount -= scrollPerClick),
        behavior: "smooth",
    })

    if (scrollAmount < 0) {
        scrollAmount = 0
    }

}

//Fonction pour aller sur la droite
function sliderScrollRight() {
    if (scrollAmount <= sliders?.scrollWidth - sliders?.clientWidth) {
        sliders?.scrollTo({
            top: 0,
            left: (scrollAmount += scrollPerClick),
            behavior: "smooth",
        })
    }

}

//Fonction pour call les films dans le caroussel
async function showMovieData() {
    //Initialisation des variables
    scrollAmount = 0
    images = []
    overviews = []
    vote_averages = []
    titres = []
    img_info = ""


    // Supprimer tout le contenu des sliders 
    sliders?.innerHTML = ""
    try {
        // Fetch API pour récupérer les données
        const response = await fetch(link_site + research + api_key)
        const data = await response.json()
        const result = data.results
        console.log(result)
        result.map(function (cur, index) {
            //Ajouter les images au caroussel
            sliders?.insertAdjacentHTML(
                "beforeend",
                `<img class="img-${index} slider-img" src="${img_base_url}${cur.poster_path}" />`
            )
            //Remplir les différentes listes des éléments à afficher dans les popups d'infos
            titres.push(cur.original_title)
            images.push(img_base_url+cur.poster_path)
            overviews.push(cur.overview)
            vote_averages.push(cur.vote_average)
        })
        //Ajouter l'event pour pouvoir faire apparaitre les popup d'infos
        img_info = document.getElementsByClassName("slider-img")
        for (let i = 0; i < img_info.length; i++) {
            img_info[i].addEventListener('click', () => displayInfo(images[i], overviews[i], vote_averages[i], titres[i]))
        }
    } catch (error) {
        console.log(error)
    }

}

//Fonction pour changer le call api (var research) avec les onglets dans la barre de nav
function switchResearch(idResearch: number) {
    research = ""
    if (idResearch === 1) { // les plus populaire
        research = "/discover/movie?sort_by=popularity.desc"
    } else if (idResearch === 2) { // Pour les enfants
        research = "/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc"
    } else if (idResearch === 3) { // les plus likes
        research = "/discover/movie/?certification_country=US&certification=R&sort_by=vote_average.desc"
    }
    showMovieData()
}

//Fonction pour créer la popup d'infos des films
function displayInfo(image, overview, vote, titre) {
    // Ferme toutes les popups précédemment ouvertes
    const popups = document.querySelectorAll(".popup");
    popups.forEach((popup) => popup.remove());

    //Création de la popup
    const popup = document.createElement("div");
    popup.classList.add("popup"); // Ajoute la classe "popup"

    //Ajout des éléments dans la pop
    popup.innerHTML = `
      <h2>${titre}</h2>
      <img src="${image}"/>
      <p id="note">Note : ${vote}/10</p>
      <p id="overview">${overview}</p>
      <div>
      <button id="close-button"> CLOSE </button>
      <button id="play-button"> PLAY </button>
      </div>
      `

    // Ajoute un gestionnaire d'événements "click" pour le bouton "FERMER"
    const closeButton = popup.querySelector("#close-button");
    closeButton?.addEventListener("click", () => {
        popup.remove();
    });

    // Ajoute un gestionnaire d'événements "click" pour le bouton "PLAY"
    const playButton = popup.querySelector("#play-button");
    const links = [ // Liste de meme appeler de manière aléatoire avec le bouton play
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://youtube.com/shorts/IEdz05-Glw4?feature=share",
        "https://www.youtube.com/watch?v=yw35BYhKVoo",
        "https://www.youtube.com/watch?v=5V2D1aXX_UM",
        "https://www.youtube.com/watch?v=DhwDsmns_DE",
        "https://www.youtube.com/watch?v=W-C3F2J2fls",
        "https://www.youtube.com/shorts/0i3QIBW62E4",
        "https://www.youtube.com/watch?v=YlXBpLjSSMc",
        "https://www.youtube.com/watch?v=wdbfZExK7R0",
        "https://www.youtube.com/shorts/hQAxuJfseyY",
        "https://www.youtube.com/watch?v=Cw_fwHTB26U",
        "https://www.youtube.com/watch?v=7gVsq3IZOR4",
        "https://www.youtube.com/watch?v=oVO3M8X9ukM",
        "https://www.youtube.com/shorts/Yulhtn10b5s",
        "https://www.youtube.com/shorts/olJH-uOE3Ek",
        "https://www.youtube.com/watch?v=SbsJK9BwwYs"
    ];
    playButton?.addEventListener("click", () => {
        const randomLink = links[Math.floor(Math.random() * links.length)];
        window.open(randomLink);
    });

    document.body.appendChild(popup);

}

// Gestion de la recherche
//Attribution de la fonction au boutton rechercher par click
searchButton?.addEventListener('click', () => {
    doSearche()
});

//Attribution de la fonction au boutton rechercher avec la touche ENTER
searchInput?.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        doSearche()
    }
});

//Fonction pour lancer la requête/recherche de l'utilisateur
function doSearche() {
    let searchQuery: string = searchInput?.value //Récupère la Query entré par l'utilisateur
    if(searchQuery !== "") { //La condition pour ne pas pouvoir faire de recherche si l'input est vide
        accueil?.classList.add("hide")
        accueil?.classList.remove("accueil")
        header?.classList.add("hide")
        search?.classList.add("search")
        search?.classList.remove("hide")
        research = "/search/movie?language=en-US&query=" + searchQuery + "&include_adult=false&page="
        apiResearch(searchQuery, research, page)
    }
}

//Fonction pour la gGestion de l'api pour la recherche de l'utilisateur
async function apiResearch(searchQuery, research, page) {
    try {
        images = []
        overviews = []
        vote_averages = []
        titres = []
        image_contener?.innerHTML = ""
        // Fetch API pour récupérer les données
        let response = await fetch(link_site + research + page + api_key)
        let data = await response.json()
        let result = data.results
        page_max = data.total_pages
        console.log(page_max)


        result.map(function (cur, index) {
            titres.push(cur.original_title)
            images.push(cur.poster_path)
            overviews.push(cur.overview)
            vote_averages.push(cur.vote_average.toFixed(1))
            console.log(overviews[index])
        })

        for (let i = 0; i < images.length; i++) {
            let imgElement = document.createElement('img');
            if (images[i] == null) {
                imgElement.setAttribute("src", grogu)
                images[i] = grogu
            } else {
                imgElement.setAttribute("src", img_base_url + images[i])
                images[i] = img_base_url + images[i]
            }
            if (overviews[i] == "") {
                overviews[i] = "Ya R la famax"
            }
            image_contener?.appendChild(imgElement)
            imgElement.addEventListener('click', () => displayInfo(images[i], overviews[i], vote_averages[i], titres[i]))
        }
        res_search?.innerHTML = "Résultats pour : " + searchQuery
        pagination?.innerHTML = page + "/" + page_max
    }

    catch (error) {
        console.log(error)
    }
}

//Fonction pour pagination back
async function pageBack() {
    if(page == 1){
        page = 1
    } else {
        page = page - 1
        let searchQuery: string = searchInput?.value
        apiResearch(searchQuery,research,page)
    }

    

}

//Attribution de la fonction au boutton back
back?.addEventListener('click', () => {
    pageBack()
});

//Fonction pour pagination next
async function pageNext() {
    if(page == page_max){
        page = page_max
    } else {
        page = page + 1
        let searchQuery: string = searchInput?.value
        apiResearch(searchQuery,research,page)
    }
    
}

//Attribution de la fonction au boutton next
next?.addEventListener('click', () => {
    pageNext()
});

home?.addEventListener('click', () => {
    location.reload();
});