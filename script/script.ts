//Variable pour menu burguer
const toggler = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".navlinks-container");

//Variable pour carousel
const sliders:Element | null = document.querySelector(".carousel")
const arrowL:Element | null = document.querySelector("#arrow-left")
const arrowR:Element | null = document.querySelector("#arrow-right")

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
    if (entries[0].contentRect.width <= 900) {
        navLinksContainer.style.transition = "transform 0.4s ease-out";
    } else {
        navLinksContainer.style.transition = "none";
    }
}).observe(document.body)



//Gestion du carousel

showMovieData()

if (arrowL) {
    arrowL.addEventListener('click', () => sliderScrollLeft())
}

if (arrowR) {
    arrowR.addEventListener('click', () => sliderScrollRight())
}


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

function sliderScrollRight() {
    if(scrollAmount <= sliders?.scrollWidth - sliders?.clientWidth){
        sliders?.scrollTo({
            top: 0,
            left: (scrollAmount += scrollPerClick),
            behavior: "smooth",
        })
    }
}


async function showMovieData() {
    const api_key:string = "4202002edba3d2376674132c19d1dc98"
    try {
        // Fetch API pour récupérer les données
        const response = await fetch("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=" + api_key)
        const data = await response.json()
        const result = data.results

        console.log(result);
        
        

        result.map(function (cur,index){
            sliders?.insertAdjacentHTML(
                "beforeend",
                `<img class="img-${index} slider-img" src="https://image.tmdb.org/t/p/w154/${cur.poster_path}" />`
            )
        })
        //scrollPerClick = document.querySelector(".img-1")?.clientWidth + ImagePadding

    } catch (error) {
        console.log(error)
    }
}