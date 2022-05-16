const mainUrl = 'http://localhost:8000/api/v1/titles/'

class Carousel{
    /**
    *
    *@param {HTMLElement} element
    *@param {Objet} option
    *@param {Objet} [options.slidesToScroll=1] Nombre d'élément à faire défiler
    *@param {Objet} [options.slidesVisible=1] Nombre d'élément visible dans un slide
    *@param {boolean} [options.loop=false] faire une boucle en fin de carousel

    */
    constructor (element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.moveCallbacks = []

        // Modification du DOM
        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
            })
        this.setStyle()
        this.createNavigation()


        // Evenements
        this.moveCallbacks.forEach(cd => cd(0))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.root.addEventListener('keyup', e => {
            if (e.key === 'ArrowRight' || e.key === 'Right'){
                this.next()
            } else if (e.key === 'ArrowLeft'|| e.key === 'Left') {
                this.prev()
            }
        })
    }

    /**
    * Dimensions aux elements du carousel
    */

    setStyle () {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100/ this.slidesVisible) / ratio) + "%")
    }

    createNavigation () {
       let nextButton = this.createDivWithClass('carousel__next')
       let prevButton = this.createDivWithClass('carousel__prev')
       this.root.appendChild(nextButton)
       this.root.appendChild(prevButton)
       nextButton.addEventListener('click', this.next.bind(this))
       prevButton.addEventListener('click', this.prev.bind(this))
       if (this.options.loop === true) {
        return
       }
       this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
              prevButton.classList.remove('carousel__prev--hidden')
            }
            if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add('carousel__next--hidden')
            } else {
                nextButton.classList.remove('carousel__next--hidden')
            }
       })
    }


    next() {
        this.gotoItem(this.currentItem + this.slidesToScroll)
    }

    prev(){
        this.gotoItem(this.currentItem - this.slidesToScroll)
    }

    /**
    * deplace le carousel vers l'element ciblé
    * @param {numer} index
    */
    gotoItem (index) {
        if (index < 0) {
            index = this.items.length - this.options.slidesVisible
            } else if (index >= this.items.length || (this.items[this.currentItem + this.options.slidesVisible]
             === undefined && index > this.currentItem)){
                index = 0
            }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index
        this.moveCallbacks.forEach(cb => cb(index))
    }

    /**
    * @param {moveCallback} cb
    */
    onMove (cd) {
        this.moveCallbacks.push(cb)
    }

    onWindowResize(){
    let mobile = window.innerWidth < 800
    if (mobile !== this.isMobile) {
        this.isMobile = mobile
        this.setStyle()
        this.moveCallbacks.forEach(cb => cb(this.currentItem))
    }
    }

    /**
    * @param {string} className
    * @returns {HTMLElement}
    */
    createDivWithClass (className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }


    /**
    * @returns {number}
    */
    get slidesToScroll () {
    return this.isMobile ? 1  : this.options.slidesToScroll
    }
     get slidesVisible () {
    return this.isMobile ? 1  : this.options.slidesVisible
    }


}

document.addEventListener('DOMContentLoaded', function (){
    new Carousel(document.querySelector('#carousel1'), {
            slidesToScroll: 3,
            slidesVisible: 4,
        })

})
document.addEventListener('DOMContentLoaded', function (){
    new Carousel(document.querySelector('#carousel2'), {
            slidesToScroll: 3,
            slidesVisible: 4,
        })

})
document.addEventListener('DOMContentLoaded', function (){
    new Carousel(document.querySelector('#carousel3'), {
            slidesToScroll: 3,
            slidesVisible: 4,
        })

})
document.addEventListener('DOMContentLoaded', function (){
    new Carousel(document.querySelector('#carousel4'), {
            slidesToScroll: 3,
            slidesVisible: 4,
        })

})


fetch('http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=')
    .then(res => res.json())
    .then(data => {
        console.log(data)
        /*
        document.getElementById('img1').src = data["results"][0]["image_url"]
        document.getElementById('titre1').innerHTML = data["results"][0]["title"]
        document.getElementById('img2').src = data["results"][1]["image_url"]
        document.getElementById('titre2').innerHTML = data["results"][1]["title"]
        document.getElementById('img3').src = data["results"][2]["image_url"]
        document.getElementById('titre3').innerHTML = data["results"][2]["title"]
        document.getElementById('img4').src = data["results"][3]["image_url"]
        document.getElementById('titre4').innerHTML = data["results"][3]["title"]
        document.getElementById('img5').src = data["results"][4]["image_url"]
        document.getElementById('titre5').innerHTML = data["results"][4]["title"]*/
        for (i=0; i<5; i++){
            var elementImgBestMovie = document.getElementById('img'+(i+1));
            var elementtitleBestMovie = document.getElementById('titre'+(i+1));
            var imgBestMovie = data["results"][i]["image_url"];
            var titleBestMovie = data["results"][i]["title"];

            elementImgBestMovie.src = imgBestMovie;
            elementtitleBestMovie.innerHTML = titleBestMovie;

            var id = data["results"][i]["id"]

        url = mainUrl+id
        recupUrl(url)

        }
    })
function recupUrl(url){
    console.log(url)
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(url)
            document.getElementById('title').innerHTML = data["title"];
            document.getElementById('des').innerHTML = data["long_description"];
            document.getElementById('actor').innerHTML = data["actors"];
            document.getElementById('director').innerHTML = data["directors"];
            document.getElementById('year').innerHTML = data["year"];
        })
}



function voirLaDescription(){
    e= document.getElementByID('des');
    e.style.visibility = e.style.visibility=="visible" ? "hidden" : "visible";
}


