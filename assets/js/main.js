// /*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
// const sections = document.querySelectorAll('section[id]')

// function scrollActive(){
//     const scrollY = window.pageYOffset

//     sections.forEach(current =>{
//         const sectionHeight = current.offsetHeight,
//             sectionTop = current.offsetTop - 50,
//             sectionId = current.getAttribute('id')

//         if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
//             document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
//         }else{
//             document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
//         }
//     })
// }
// window.addEventListener('scroll', scrollActive)

document.addEventListener("DOMContentLoaded", function() {
    var url = window.location.href;
    var activePage = url.substr(url.lastIndexOf('/') + 1); // Get the current page name

    // Loop through each navigation item
    var navItems = document.querySelectorAll('.nav__link');
    navItems.forEach(function(item) {
        var pageLink = item.getAttribute('href');
        if (pageLink === activePage || pageLink === '/' + activePage) {
            item.classList.add('active-link'); // Add 'active-link' class to the active page
        }
    });
});





/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)
