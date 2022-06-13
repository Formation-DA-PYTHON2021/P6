const mainUrl = 'http://localhost:8000/api/v1/titles/' // url de base


/* Creation d'une class Carousel*/
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
        let children = [].slice.call(element.children);
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

/* Creation des 4  carousel suivant la class Carousel*/
document.addEventListener('DOMContentLoaded', function (){
    new Carousel(document.querySelector('#carousel1'), {
            slidesToScroll: 2,
            slidesVisible: 4,
        })

})
document.addEventListener('DOMContentLoaded', function (){
    new Carousel(document.querySelector('#carousel2'), {
            slidesToScroll: 2,
            slidesVisible: 4,
        })

})
document.addEventListener('DOMContentLoaded', function (){
    new Carousel(document.querySelector('#carousel3'), {
            slidesToScroll: 2,
            slidesVisible: 4,
        })

})
document.addEventListener('DOMContentLoaded', function (){
    new Carousel(document.querySelector('#carousel4'), {
            slidesToScroll: 2,
            slidesVisible: 4,
        })

})

Container('',0)
Container('',1)
Container('comedy',2)
Container('drama',3)
Container('fantasy',4)

/* carousel by category */
function Container(category, numCarousel){

    var urlPage1 = mainUrl + "?sort_by=-imdb_score&genre=" + category;
    var urlPage2 = mainUrl  + "?sort_by=-imdb_score&genre=" + category + "&page=2";

    fetch(urlPage1)
        .then(res => res.json())
        .then(data => {
            var dataPage1 = data["results"];

    fetch(urlPage2)
        .then(res => res.json())
        .then(data => {
            var dataPage2 = data["results"];
            var dataAll = dataPage1.concat(dataPage2);

            if (category == '')
                dataAll.shift();
        for (i=0; i<7; i++){
            /* pictures*/
            var elementImgMovie = document.getElementById('carousel'+ numCarousel +'__img'+(i+1));
            var imgMovie = dataAll[i]["image_url"];
            elementImgMovie.src = imgMovie;
            /* title*/
            var elementTitreMovie = document.getElementById('carousel'+ numCarousel +'__titre'+(i+1));
            var titreMovie = dataAll[i]["title"];
            elementTitreMovie.innerHTML = titreMovie;
            /* id*/
            var idMovie = dataAll[i]["id"]
            var elementId = document.getElementById(category+(i+1));
            elementId.setAttribute('carousel'+ numCarousel +'__id',idMovie);
            var elementIdMovie = document.getElementById('carousel'+ numCarousel +'__id'+(i+1));
             elementIdMovie.innerHTML = idMovie;
            }

            ModalData(0,1)
            ModalData(1,1)
            ModalData(1,2)
            ModalData(1,3)
            ModalData(1,4)
            ModalData(1,5)
            ModalData(1,6)
            ModalData(1,7)
            ModalData(2,1)
            ModalData(2,2)
            ModalData(2,3)
            ModalData(2,4)
            ModalData(2,5)
            ModalData(2,6)
            ModalData(2,7)
            ModalData(3,1)
            ModalData(3,2)
            ModalData(3,3)
            ModalData(3,4)
            ModalData(3,5)
            ModalData(3,6)
            ModalData(3,7)
            ModalData(4,1)
            ModalData(4,2)
            ModalData(4,3)
            ModalData(4,4)
            ModalData(4,5)
            ModalData(4,6)
            ModalData(4,7)
        })
    })

}


/* modal function: display of information */
function ModalData(numCarousel,num){
        var urlid = document.getElementById('carousel'+ numCarousel +'__id'+ num);
        var urldata = urlid.innerHTML;

        fetch(mainUrl + urldata)
            .then(res => res.json())
            .then(data => {
            console.log(data);
                /* image*/
                var elementImgMovie = document.getElementById('carousel'+ numCarousel +'__image'+ num);
                var imgMovie = data["image_url"];
                elementImgMovie.src = imgMovie;
                /* title*/
                var elementTitleMovie = document.getElementById('carousel'+ numCarousel +'__title'+ num);
                var titleMovie = data["title"];
                elementTitleMovie.innerHTML = titleMovie;
                /* genre*/
                var elementGenreMovie = document.getElementById('carousel'+ numCarousel +'__genre'+ num);
                var genreMovie = data["genres"];
                elementGenreMovie.innerHTML = genreMovie;
                /* date published */
                var elementYearMovie = document.getElementById('carousel'+ numCarousel +'__year'+ num);
                var yearMovie = data["year"];
                elementYearMovie.innerHTML = yearMovie;
                /* rated*/
                var elementRatedMovie = document.getElementById('carousel'+ numCarousel +'__rated'+ num);
                var ratedMovie = data["rated"];
                elementRatedMovie.innerHTML = ratedMovie;
                /* score Imdb */
                var elementImdbMovie = document.getElementById('carousel'+ numCarousel +'__imdb'+ num);
                var imdbMovie = data["imdb_score"];
                elementImdbMovie.innerHTML = imdbMovie;
                /* Director */
                var elementDirectorMovie = document.getElementById('carousel'+ numCarousel +'__director'+ num);
                var directorMovie = data["directors"];
                elementDirectorMovie.innerHTML = directorMovie;
                /* Actor */
                var elementActorMovie = document.getElementById('carousel'+ numCarousel +'__actor'+ num);
                var actorMovie = data["actors"];
                elementActorMovie.innerHTML = actorMovie;
                /* duration */
                var elementDurationMovie = document.getElementById('carousel'+ numCarousel +'__duration'+ num);
                var durationMovie = data["duration"];
                elementDurationMovie.innerHTML = durationMovie + "  min";
                /* country*/
                var elementCountryMovie = document.getElementById('carousel'+ numCarousel +'__country'+ num);
                var countryMovie = data["countries"];
                if (countryMovie == null) {
                    elementCountryMovie.innerHTML = "N/A";
                } else {
                    elementCountryMovie.innerHTML = countryMovie;}
                /* Box Office*/
                var elementBoxOfficeMovie = document.getElementById('carousel'+ numCarousel +'__boxOffice'+ num);
                var boxOfficeMovie = data["worldwide_gross_income"];
                if (boxOfficeMovie == null){
                    elementBoxOfficeMovie.innerHTML = "N/A";  // placeholder for unspecified box-office
                } else {
                    elementBoxOfficeMovie.innerHTML = boxOfficeMovie;
                   }
                /* description long */
                var elementDescripMovie = document.getElementById('carousel'+ numCarousel +'__descrip'+ num);
                var descripMovie = data["long_description"];
                elementDescripMovie.innerHTML = descripMovie;
                /* description*/
                var elementDescripCourteMovie = document.getElementById('carousel'+ numCarousel +'__descripcourte'+ num)
                var descripCourteMovie = data["description"];
                elementDescripCourteMovie.innerHTML =descripCourteMovie;
                })
}
/* modal function: open modal */
function OpenModal(numCarousel, num) {
  var div = document.getElementById('carousel'+ numCarousel +'__openModal' + num);
  if (div.style.display === "none") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}