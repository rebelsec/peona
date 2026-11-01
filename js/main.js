/* =========================================================

   PEONA

   PREMIUM INTERACTION SYSTEM V2.1


   PART 1


   CORE

   THEME

   PRELOADER

   HEADER

   SCROLL ENGINE


========================================================= */







/* =========================================================

   DOM HELPERS

========================================================= */


const $ = selector =>

    document.querySelector(selector);





const $$ = selector =>

    [
        ...document.querySelectorAll(selector)
    ];









/* =========================================================

   ELEMENT CACHE


   Menyimpan element penting agar tidak

   melakukan query DOM berulang.


========================================================= */


const DOM = {



    body:

        document.body,




    html:

        document.documentElement,




    header:

        $(".site-header"),




    themeToggle:

        $("#themeToggle"),




    preloader:

        $(".preloader"),




    year:

        $("#year"),




    menuButton:

        $(".menu-toggle"),




    mobileNavigation:

        $(".mobile-navigation"),




    imageLightbox:

        $(".image-lightbox"),




    lightboxImage:

        $(".lightbox-image"),




    lightboxClose:

        $(".lightbox-close")



};







const {


    body,

    html,

    header,

    themeToggle,

    preloader,

    year



} = DOM;











/* =========================================================

   CONFIGURATION


========================================================= */


const CONFIG = {


    themeKey:

        "peona-theme",



    headerOffset:

        45



};









/* =========================================================

   DARK MODE SYSTEM

========================================================= */





/*

    Mengambil theme terakhir user

*/



const savedTheme =

    localStorage.getItem(

        CONFIG.themeKey

    );







/*

    Mengikuti preferensi sistem

*/



const prefersDark =

    window.matchMedia(

        "(prefers-color-scheme: dark)"

    )
    .matches;









/*

    Fungsi utama penerapan theme


    Digunakan ulang agar tidak ada

    kode duplikat.


*/



function applyTheme(
    isDark
){



    body.classList.toggle(

        "dark-mode",

        isDark

    );





    themeToggle?.setAttribute(

        "aria-pressed",

        String(isDark)

    );



}









/*

    Initial theme


    Prioritas:

    1. pilihan user

    2. sistem device

    3. default light


*/



applyTheme(



    savedTheme === "dark"

    ||

    (

        !savedTheme &&

        prefersDark

    )



);









/*

    Toggle dark mode

*/



themeToggle?.addEventListener(

    "click",

    ()=>{



        const isDark =

            !body.classList.contains(

                "dark-mode"

            );





        applyTheme(

            isDark

        );





        localStorage.setItem(

            CONFIG.themeKey,

            isDark

            ?

            "dark"

            :

            "light"

        );



    }

);













/* =========================================================

   DYNAMIC YEAR

========================================================= */





if(year){



    year.textContent =

        new Date()

        .getFullYear();



}












/* =========================================================

   PRELOADER

========================================================= */





window.addEventListener(

    "load",

    ()=>{





        /*

            Menghapus class preload

            agar transition CSS aktif

        */



        html.classList.remove(

            "dark-preload"

        );







        if(!preloader)

            return;







        /*

            Delay agar animasi

            terlihat smooth

        */



        setTimeout(

            ()=>{



                preloader.classList.add(

                    "loaded"

                );



            },

            1100

        );





    }

);














/* =========================================================

   GLOBAL SCROLL ENGINE



   Optimasi:


   Semua fitur scroll menggunakan

   satu requestAnimationFrame.


   Mengurangi beban browser.


========================================================= */





const scrollTasks =

    new Set();






let scrollTicking = false;









function registerScrollTask(

    callback

){



    if(

        typeof callback === "function"

    ){



        scrollTasks.add(

            callback

        );



    }



}







function removeScrollTask(

    callback

){



    scrollTasks.delete(

        callback

    );



}











window.addEventListener(

    "scroll",

    ()=>{



        if(scrollTicking)

            return;





        scrollTicking = true;







        requestAnimationFrame(

            ()=>{



                scrollTasks.forEach(

                    task =>

                    task()

                );





                scrollTicking = false;



            }

        );





    },

    {

        passive:true

    }

);













/* =========================================================

   HEADER SCROLL EFFECT

========================================================= */





function updateHeader(){



    if(!header)

        return;







    header.classList.toggle(



        "scrolled",



        window.scrollY >

        CONFIG.headerOffset



    );



}









/*

    Masukkan header

    ke scroll engine

*/



registerScrollTask(

    updateHeader

);







/*

    Jalankan pertama kali

*/



updateHeader();









/* =========================================================

   END OF PART 1


   PART 2:


   MOBILE NAVIGATION

   TESTIMONIAL SLIDER

   FAQ

   IMAGE LOADING

   REVEAL

   LIGHTBOX


========================================================= */

/* =========================================================

   PART 2


   MOBILE NAVIGATION

   TESTIMONIAL SLIDER

   FAQ

   IMAGE LOADING

   REVEAL

   LIGHTBOX


========================================================= */







/* =========================================================

   MOBILE NAVIGATION


========================================================= */



function openMobileMenu(){


    if(
        !DOM.mobileNavigation ||
        !DOM.menuButton
    )
        return;





    DOM.mobileNavigation.classList.add(

        "open"

    );





    DOM.menuButton.setAttribute(

        "aria-expanded",

        "true"

    );





    body.classList.add(

        "menu-open"

    );



}









function closeMobileMenu(){


    if(
        !DOM.mobileNavigation ||
        !DOM.menuButton
    )
        return;





    DOM.mobileNavigation.classList.remove(

        "open"

    );





    DOM.menuButton.setAttribute(

        "aria-expanded",

        "false"

    );





    body.classList.remove(

        "menu-open"

    );



}









function toggleMobileMenu(){



    const isOpen =

        DOM.mobileNavigation

        ?.classList.contains(

            "open"

        );





    if(isOpen){


        closeMobileMenu();



    }else{


        openMobileMenu();



    }



}









DOM.menuButton?.addEventListener(

    "click",

    toggleMobileMenu

);









/*

    Tutup menu ketika

    klik link navigasi


*/



$$(
    ".mobile-navigation a"
)
.forEach(

    link=>{


        link.addEventListener(

            "click",

            closeMobileMenu

        );


    }

);









/*

    Tutup ketika klik luar


*/



document.addEventListener(

    "click",

    event=>{



        if(
            !DOM.mobileNavigation ||
            !DOM.menuButton
        )

            return;







        const inside =

            DOM.mobileNavigation

            .contains(

                event.target

            )

            ||

            DOM.menuButton

            .contains(

                event.target

            );







        if(!inside){


            closeMobileMenu();



        }



    }

);











/* =========================================================

   TESTIMONIAL SLIDER


========================================================= */





const testimonials =

    $$(
        ".testimonial"
    );





const testimonialPrev =

    $(".testimonial-prev");





const testimonialNext =

    $(".testimonial-next");





const testimonialProgress =

    $(".testimonial-progress");







let testimonialIndex = 0;









function updateTestimonial(

    index

){



    if(
        !testimonials.length
    )

        return;









    testimonialIndex =

        (

            index +

            testimonials.length

        )

        %

        testimonials.length;











    testimonials.forEach(

        (item,i)=>{



            item.classList.toggle(

                "active",

                i === testimonialIndex

            );



        }

    );









    if(testimonialProgress){



        testimonialProgress.style.width =



        (

            (

                testimonialIndex + 1

            )

            /

            testimonials.length

            *

            100

        )

        +

        "%";



    }



}











testimonialNext?.addEventListener(

    "click",

    ()=>{


        updateTestimonial(

            testimonialIndex + 1

        );


    }

);









testimonialPrev?.addEventListener(

    "click",

    ()=>{


        updateTestimonial(

            testimonialIndex - 1

        );


    }

);







updateTestimonial(

    0

);









/* =========================================================

   FAQ ACCORDION


========================================================= */





const faqItems =

    $$(
        ".faq-item"
    );





let activeFAQ = null;









function closeFAQ(

    item

){


    if(!item)

        return;





    item.classList.remove(

        "open"

    );







    item.querySelector(

        ".faq-question"

    )

    ?.setAttribute(

        "aria-expanded",

        "false"

    );



}









function toggleFAQ(

    item

){



    const isOpen =

        item.classList.contains(

            "open"

        );





    if(

        activeFAQ &&

        activeFAQ !== item

    ){



        closeFAQ(

            activeFAQ

        );



    }









    if(isOpen){



        closeFAQ(

            item

        );



        activeFAQ = null;





    }else{



        item.classList.add(

            "open"

        );





        item.querySelector(

            ".faq-question"

        )

        ?.setAttribute(

            "aria-expanded",

            "true"

        );





        activeFAQ = item;



    }



}









document.addEventListener(

    "click",

    event=>{



        const button =

            event.target.closest(

                ".faq-question"

            );





        if(!button)

            return;







        const item =

            button.closest(

                ".faq-item"

            );







        if(item){



            toggleFAQ(

                item

            );



        }



    }

);









/* =========================================================

   IMAGE LOADING


========================================================= */





const lazyImages =

    $$(
        'img[loading="lazy"]'
    );









if(

    "IntersectionObserver"

    in window

){



    const imageObserver =

    new IntersectionObserver(

        entries=>{



            entries.forEach(

                entry=>{



                    if(
                        !entry.isIntersecting
                    )

                        return;







                    const image =

                        entry.target;







                    image.classList.add(

                        "image-loaded"

                    );







                    imageObserver.unobserve(

                        image

                    );



                }

            );



        },

        {

            threshold:

            0.15

        }

    );









    lazyImages.forEach(

        image=>{


            imageObserver.observe(

                image

            );


        }

    );



}









/* =========================================================

   REVEAL ANIMATION


========================================================= */





const revealElements =

    $$(
        ".reveal"
    );









if(

    "IntersectionObserver"

    in window

){



    const revealObserver =

    new IntersectionObserver(

        entries=>{



            entries.forEach(

                entry=>{



                    if(
                        !entry.isIntersecting
                    )

                        return;







                    entry.target.classList.add(

                        "visible"

                    );







                    revealObserver.unobserve(

                        entry.target

                    );



                }

            );



        },

        {

            threshold:

            0.12

        }

    );









    revealElements.forEach(

        element=>{


            revealObserver.observe(

                element

            );


        }

    );



}









/* =========================================================

   IMAGE LIGHTBOX


   Tidak mengubah logic lama


   Support:

   nail-01

   nail-02

   nail-03

   nail-04

   nail-05

   nail-06


========================================================= */







function openImageLightbox(

    image

){



    if(

        !DOM.imageLightbox ||

        !DOM.lightboxImage

    )

        return;









    DOM.lightboxImage.src =

        image.src;





    DOM.lightboxImage.alt =

        image.alt || "";









    DOM.imageLightbox.classList.add(

        "active"

    );







    DOM.imageLightbox.setAttribute(

        "aria-hidden",

        "false"

    );



}









function closeImageLightbox(){



    if(

        !DOM.imageLightbox

    )

        return;







    DOM.imageLightbox.classList.remove(

        "active"

    );







    DOM.imageLightbox.setAttribute(

        "aria-hidden",

        "true"

    );



}









document.addEventListener(

    "click",

    event=>{



        const image =

            event.target.closest(

                ".zoomable-image"

            );







        if(!image)

            return;







        openImageLightbox(

            image

        );



    }

);









DOM.lightboxClose?.addEventListener(

    "click",

    closeImageLightbox

);









DOM.imageLightbox?.addEventListener(

    "click",

    event=>{



        if(

            event.target ===

            DOM.imageLightbox

        ){



            closeImageLightbox();



        }



    }

);









document.addEventListener(

    "keydown",

    event=>{



        if(

            event.key === "Escape"

        ){



            closeImageLightbox();



        }



    }

);









/* =========================================================

   END OF PART 2


   PART 3:


   CUSTOM CURSOR

   PARALLAX

   SMOOTH SCROLL


========================================================= */

/* =========================================================

   PART 3


   CUSTOM CURSOR

   PARALLAX

   SMOOTH SCROLL


========================================================= */







/* =========================================================

   CUSTOM CURSOR


   Optimasi:

   - requestAnimationFrame

   - GPU transform

   - reduced motion support


========================================================= */





const cursorDot =

    $(".cursor-dot");





const cursorOutline =

    $(".cursor-outline");





const reduceMotion =

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    )

    .matches;







let mouseX = 0;

let mouseY = 0;



let outlineX = 0;

let outlineY = 0;









function animateCursor(){



    if(

        !cursorDot ||

        !cursorOutline

    )

        return;









    outlineX +=

    (

        mouseX -

        outlineX

    )

    *

    0.15;









    outlineY +=

    (

        mouseY -

        outlineY

    )

    *

    0.15;









    cursorDot.style.transform =



    `translate3d(

        ${mouseX}px,

        ${mouseY}px,

        0

    )`;









    cursorOutline.style.transform =



    `translate3d(

        ${outlineX}px,

        ${outlineY}px,

        0

    )`;









    requestAnimationFrame(

        animateCursor

    );



}









if(

    !reduceMotion &&

    cursorDot &&

    cursorOutline

){





    document.addEventListener(

        "mousemove",

        event=>{



            mouseX =

            event.clientX;





            mouseY =

            event.clientY;



        },

        {

            passive:true

        }

    );







    requestAnimationFrame(

        animateCursor

    );



}









/*

    Cursor state

    berdasarkan

    data-cursor


*/



document.addEventListener(

    "mouseover",

    event=>{



        const target =

            event.target.closest(

                "[data-cursor]"

            );





        if(!target)

            return;







        cursorOutline?.classList.add(

            target.dataset.cursor

        );



    }

);









document.addEventListener(

    "mouseout",

    event=>{



        const target =

            event.target.closest(

                "[data-cursor]"

            );





        if(!target)

            return;







        cursorOutline?.classList.remove(

            target.dataset.cursor

        );



    }

);











/* =========================================================

   PARALLAX ENGINE


   Optimasi:

   - cache element

   - tidak query ulang saat scroll

   - memakai scroll engine


========================================================= */







const parallaxElements =

    $$(
        "[data-parallax]"
    );









const parallaxItems =

    parallaxElements.map(

        element=>({



            element,



            speed:

            Number(

                element.dataset.parallax

            )

            ||

            0.02



        })

    );









function updateParallax(){



    if(reduceMotion)

        return;









    const scrollY =

        window.scrollY;









    parallaxItems.forEach(

        item=>{





            item.element.style.transform =



            `translate3d(

                0,

                ${

                    scrollY *

                    item.speed

                }px,

                0

            )`;



        }

    );



}









registerScrollTask(

    updateParallax

);











/* =========================================================

   SMOOTH SCROLL


   Untuk:

   - navigation

   - CTA

   - section anchor


========================================================= */









$$(
    'a[href^="#"]'
)

.forEach(

    link=>{



        link.addEventListener(

            "click",

            event=>{





                const targetID =

                    link.getAttribute(

                        "href"

                    );







                if(

                    !targetID ||

                    targetID === "#"

                )

                    return;









                const target =

                    document.querySelector(

                        targetID

                    );







                if(!target)

                    return;









                event.preventDefault();









                const headerHeight =

                    header?.offsetHeight

                    ||

                    0;









                const targetPosition =



                    target.offsetTop

                    -

                    headerHeight;









                window.scrollTo({



                    top:

                    targetPosition,



                    behavior:

                    "smooth"



                });







            }

        );



    }

);













/* =========================================================

   VISIBILITY OPTIMIZATION


   Mengurangi animasi saat

   tab tidak aktif


========================================================= */









document.addEventListener(

    "visibilitychange",

    ()=>{



        if(

            document.hidden

        ){



            cursorOutline?.classList.add(

                "hidden"

            );



        }

        else{



            cursorOutline?.classList.remove(

                "hidden"

            );



        }



    }

);













/* =========================================================

   END OF PART 3


   PART 4:


   SERVICE CARD

   BOOKING ORIGINAL

   WHATSAPP

   DATE VALIDATION

   INIT


========================================================= */

/* =========================================================

   PART 4 FINAL


   SERVICE CARD

   BOOKING SYSTEM

   DATE VALIDATION

   WHATSAPP

   RESIZE

   INIT



========================================================= */









/* =========================================================

   SERVICE CARD AUTO SELECT


========================================================= */





const serviceCards =

    $$(
        ".service-card"
    );





const bookingService =

    $("#bookingService");





const selectedService =

    $("#selectedService");









serviceCards.forEach(

    card=>{



        card.addEventListener(

            "click",

            ()=>{





                const service =

                    card.dataset.service;







                if(!service)

                    return;









                if(
                    bookingService
                ){



                    bookingService.value =

                        service;



                }









                if(
                    selectedService
                ){



                    selectedService.textContent =

                        service;



                }





            }

        );



    }

);









/* =========================================================

   SERVICE SELECT UPDATE


========================================================= */





bookingService?.addEventListener(

    "change",

    ()=>{



        if(!selectedService)

            return;







        selectedService.textContent =

            bookingService.value ||

            "Select a service";



    }

);












/* =========================================================
   BOOKING MODAL SYSTEM
========================================================= */


const bookingModal =
$("#bookingModal");


const openBooking =
$("#openBooking");


const closeBooking =
$("#closeBooking");


const bookingBackdrop =
$(".booking-modal-backdrop");





function openBookingModal(){


    if(!bookingModal)
        return;



    bookingModal.classList.add(
        "open"
    );



    bookingModal.setAttribute(
        "aria-hidden",
        "false"
    );



    document.body.classList.add(
        "modal-open"
    );


}






function closeBookingModal(){


    if(!bookingModal)
        return;



    bookingModal.classList.remove(
        "open"
    );



    bookingModal.setAttribute(
        "aria-hidden",
        "true"
    );



    document.body.classList.remove(
        "modal-open"
    );


}


/* =========================================================
   SERVICE CARD TO BOOKING
========================================================= */


document.addEventListener(
    "click",
    event => {


        const card = event.target.closest(
            ".service-card"
        );


        if(!card)
            return;



        const service =
            card.dataset.service;



        if(!service)
            return;



        /*
            Buka booking modal
        */

        openBookingModal();



        /*
            Pilih service otomatis
        */

        const serviceSelect =
            document.querySelector(
                "#bookingService"
            );


        const selectedService =
            document.querySelector(
                "#selectedService"
            );



        if(serviceSelect){

            serviceSelect.value =
                service;

        }



        if(selectedService){

            selectedService.textContent =
                service;

        }



    }

);


/* OPEN BUTTON */


openBooking?.addEventListener(
    "click",
    function(event){


        event.preventDefault();


        openBookingModal();


    }
);






/* CLOSE BUTTON */


closeBooking?.addEventListener(
    "click",
    function(){


        closeBookingModal();


    }
);






/* BACKDROP */


bookingBackdrop?.addEventListener(
    "click",
    function(){


        closeBookingModal();


    }
);







/* ESC BUTTON */


document.addEventListener(
    "keydown",
    function(event){


        if(
            event.key === "Escape"
        ){


            closeBookingModal();


        }


    }
);




/* =========================================================

   DATE VALIDATION


========================================================= */





const bookingDate =

    $("#bookingDate");







if(bookingDate){



    const today =

        new Date();







    const year =

        today.getFullYear();





    const month =

        String(

            today.getMonth()+1

        )

        .padStart(

            2,

            "0"

        );





    const day =

        String(

            today.getDate()

        )

        .padStart(

            2,

            "0"

        );







    bookingDate.min =



        `${year}-${month}-${day}`;



}











/* =========================================================

   WHATSAPP BOOKING


========================================================= */





const bookingForm =

    $("#bookingForm");







const PEONA_WHATSAPP =

    "6282173617200";









bookingForm?.addEventListener(

    "submit",

    event=>{





        event.preventDefault();









        const formData =

            new FormData(

                bookingForm

            );









        const getValue =

        name =>



            String(

                formData.get(

                    name

                )

                ||

                ""

            )

            .trim();









        const name =

            getValue(

                "name"

            );







        const phone =

            getValue(

                "phone"

            );







        const service =

            getValue(

                "service"

            );







        const date =

            getValue(

                "date"

            );







        const time =

            getValue(

                "time"

            );







        const notes =

            getValue(

                "notes"

            );









        if(

            !name ||

            !phone ||

            !service ||

            !date ||

            !time

        ){



            alert(

                "Please complete all required fields."

            );



            return;



        }









        const formattedDate =



            new Intl.DateTimeFormat(

                "en-US",

                {



                    day:

                    "numeric",



                    month:

                    "long",



                    year:

                    "numeric"



                }

            )

            .format(

                new Date(

                    date

                )

            );









        const message =



`Hello PEONA,

I would like to book an appointment.

Name:
${name}

WhatsApp:
${phone}

Service:
${service}

Date:
${formattedDate}

Time:
${time}

Notes:
${notes || "-"}

Please confirm the availability.

Thank you.`;









        const whatsappURL =



            `https://wa.me/${PEONA_WHATSAPP}?text=${encodeURIComponent(message)}`;









        window.open(

            whatsappURL,

            "_blank"

        );





    }

);













/* =========================================================

   RESIZE OPTIMIZATION


========================================================= */





let resizeTimeout;







window.addEventListener(

    "resize",

    ()=>{



        clearTimeout(

            resizeTimeout

        );







        resizeTimeout =

        setTimeout(

            ()=>{



                updateHeader();



            },

            150

        );



    },

    {

        passive:true

    }

);













/* =========================================================

   FINAL INITIALIZATION


========================================================= */





updateHeader();









html.classList.add(

    "peona-ready"

);









/* =========================================================

   PEONA MAIN.JS OPTIMIZED V2.1 COMPLETE


   FEATURES:


   ✓ Dark Mode

   ✓ Preloader

   ✓ Header Scroll

   ✓ Mobile Menu

   ✓ Testimonial Slider

   ✓ FAQ

   ✓ Lazy Image

   ✓ Reveal Animation

   ✓ Image Lightbox

   ✓ Custom Cursor

   ✓ Parallax

   ✓ Smooth Scroll

   ✓ Booking Modal

   ✓ WhatsApp Booking


========================================================= */