const moduleComponents = document.querySelectorAll("#module div"); 

const options = {
    root: null, 
    rootMargin: "0px", 
    threshold: 1, 
}

const callback = (entries) => {
    entries.forEach(entry => {  
        const p = entry.target.querySelector("p"); 

        if(entry.isIntersecting) {
            p.style.opacity = "1";
        } else {
            p.style.opacity = "0";
        }
    })
}

const observer = new IntersectionObserver(callback, options);

moduleComponents.forEach(component => {
    observer.observe(component);
})
