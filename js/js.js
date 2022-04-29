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

