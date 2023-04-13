import api_key from "./api_key"

//Variable pour menu burguer
const toggler = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".navlinks-container");

//Variable pour carousel
const sliders:Element | null = document.querySelector(".carousel")
const arrowL:Element | null = document.querySelector("#arrow-left")
const arrowR:Element | null = document.querySelector("#arrow-right")
const most_popular:Element | null = document.querySelector("#most-popular")
const kid:Element | null = document.querySelector("#kid")
const most_like:Element | null = document.querySelector("#most-like")

let scrollPerClick:number = 200
let ImagePadding:number = 20
let scrollAmount:number = 0

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

const link_site:string = "https://api.themoviedb.org/3" //Lien fixe de l'api du site
let research:string = "/discover/movie?sort_by=popularity.desc" // partie pour définir notre recherche

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
function sliderScrollLeft(){
    sliders?.scrollTo({
        top:0,
        left: (scrollAmount -= scrollPerClick),
        behavior: "smooth",
    })

    if (scrollAmount < 0){
        scrollAmount = 0
    }
}

//Fonction pour aller sur la droite
function sliderScrollRight() {
    if(scrollAmount <= sliders?.scrollWidth - sliders?.clientWidth){
        sliders?.scrollTo({
            top: 0,
            left: (scrollAmount += scrollPerClick),
            behavior: "smooth",
        })
    }
}

//Fonction pour call les films dans le caroussel
async function showMovieData() {
    // Supprimer tout le contenu des sliders
    sliders?.innerHTML = ""
    try {
        // Fetch API pour récupérer les données
        const response = await fetch(link_site + research + api_key)
        const data = await response.json()
        const result = data.results

        result.map(function (cur,index){
            sliders?.insertAdjacentHTML(
                "beforeend",
                `<img class="img-${index} slider-img" src="https://image.tmdb.org/t/p/w154/${cur.poster_path}" />`
            )
        })

    } catch (error) {
        console.log(error)
    }
}

//Fonction pour changer le call api (const research)

function switchResearch(arg1:number){
    research = ""
    if (arg1 === 1) { // les plus populaire
        research = "/discover/movie?sort_by=popularity.desc"
    } else if (arg1 === 2) { // Pour les enfants
        research = "/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc"
    } else if (arg1 === 3) { // les plus likes
        research = "/discover/movie/?certification_country=US&certification=R&sort_by=vote_average.desc"
    }

    showMovieData()
}