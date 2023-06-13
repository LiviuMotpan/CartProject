const cartContainer = document.querySelector("main .cart-container");
const mainContainer = document.querySelector("#main-container");
const cartContent = document.querySelector("#cart-container");
const cartIcon = document.querySelector('#cart-icon');
const closeIcon = document.querySelector('#close-icon');
const totalPriceEl = document.querySelector("#card-price h1");
const sortsBtn = document.querySelectorAll(".sort-container div");
const clearBtn = document.querySelector("#clear-btn");
const weather = document.querySelector("#weather h1");
const addCartMessage = document.querySelector(".add-cart-message");

async function getData() {
    let res = await fetch("products.json");
    let data = await res.json();
    
    return data;
}

async function getWeather() {
    let res = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Chisinau&appid=51a4bc214f9cf6d865f07849e483fe32");
    let data = await res.json();
    weather.innerHTML = `${Math.round(data.main.temp - 273.15)} °C`;
    console.log();
}
getWeather()
let products = [];
let cartProducts = [];
let totalPrice = 0;

window.addEventListener("load",(e)=> {
    getData()
        .then(data => {
            products = data;
            start(data)
        });
})

clearBtn.addEventListener("click",(e)=> {
    mainContainer.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.classList.remove("active");
        btn.textContent = "Add To Cart";
    })
    cartProducts = [];
    updateCart();
    updatePrice();
})

function start(data) {
    mainContainer.innerHTML= "";
    data.forEach(el => {
        mainContainer.innerHTML+= `
        <div class="card ${el.id}">
            <div class="card-image">
                <img src="${el.image}" alt="${el.name}">
            </div>
            <div class="card-content">
                <h1 class="product-name">${el.name}</h1>
                <h4 class="product-brand">Brand: ${el.brand}</h1>
                <h4 class="release-year">Release year: ${el.year}</h1>
                <p class="product-price">Price: $${el.price}</p>
                <button class="add-to-cart">Add To Cart</button>
            </div>
        </div>
        `;
        mainContainer.querySelectorAll(".card").forEach(card => {
            card.querySelector(".add-to-cart").addEventListener("click",(e)=> {
                let btn = e.target;
                btn.textContent = "In Cart";
                btn.classList.add("active");
                btn.disabled = true;
                products.find(element => {
                    if(element.id == card.classList[1]) {
                        cartProducts.push(element);
                    }
                })        
                updateCart(); 
                addCartMessage.classList.add("show");
                setTimeout(()=> {
                    addCartMessage.classList.remove("show");
                },2000);
                
            })
        })
    })
}

sortsBtn.forEach(btn => {
    btn.addEventListener("click",(e) => {
        btn.querySelector("button").classList.toggle("active");
   
        sortsBtn.forEach(b => {
            if(b != btn) b.classList.remove("active");
        })
        

        if(btn.classList.contains("sort-alphabetical") && btn.querySelector("button").classList.contains("active")) {
            products.sort((a, b) => a.name.localeCompare(b.name));
            start(products);
        }else if(btn.classList.contains("sort-alphabetical") && !btn.querySelector("button").classList.contains("active")) {
            getData()
                .then(data => {
                    products = data;
                    start(data)
                });
        }
   
        if(btn.classList.contains("sort-price") && btn.querySelector("button").classList.contains("active")) {
            products.sort((a, b) => a.price - b.price);
            start(products);
        }else if(btn.classList.contains("sort-price") && !btn.querySelector("button").classList.contains("active")) {
            getData()
                .then(data => {
                    products = data;
                    start(data)
                });
        }
   
        if(btn.classList.contains("sort-brand") && btn.querySelector("button").classList.contains("active")) {
            products.sort((a, b) => a.name.localeCompare(b.name));
            start(products);
        }else if(btn.classList.contains("sort-brand") && !btn.querySelector("button").classList.contains("active")) {
            getData()
                .then(data => {
                    products = data;
                    start(data)
                });
        }
   
        if(btn.classList.contains("sort-year") && btn.querySelector("button").classList.contains("active")) {
            products.sort((a, b) => b.year - a.year);
            start(products);
        }else if(btn.classList.contains("sort-year") && !btn.querySelector("button").classList.contains("active")) {
            getData()
                .then(data => {
                    products = data;
                    start(data)
                });
        }
    });
})

function updateCart() {
    cartContent.innerHTML = "";
    cartProducts.forEach((el,id) => {
        cartContent.innerHTML += `
        <div class="card ${el.id}">
            <div class="card-image">
                <img src="${el.image}" alt="${el.name}">
            </div>
            <div class="card-content">
                <h1 class="product-name">${el.name}</h1>
                <h4 class="product-desc">${el.year} Year - $${el.price}</h1>
                <div class="quantity-container">
                    <h2 class="quantity">Quantity: <span id="quantity">${el.quantity}</span></h2>
                    <button class="quantity-btn" id="minus-btn">-</button>
                    <button class="quantity-btn" id="plus-btn">+</button>
                </div>
                <button class="remove-from-cart">Remove From Cart</button>
            </div>
        </div>
        `;

        cartContent.querySelectorAll(".card").forEach(card => {
            products.find(element => {
                if(element.id == card.classList[1]) {
                    ele = element;
                }
            })
            card.querySelector("#minus-btn").addEventListener("click",(e)=> {
                products.find(element => {
                    if(element.id == card.classList[1]) {
                        if(element.quantity > 1) element.quantity--;
                        e.target.parentElement.querySelector("#quantity").textContent = element.quantity;
                    }
                })
                updatePrice();
            })
            card.querySelector("#plus-btn").addEventListener("click",(e)=> {
                products.find(element => {
                    if(element.id == card.classList[1]) {
                        element.quantity++;
                        e.target.parentElement.querySelector("#quantity").textContent = element.quantity;
                    }
                })
                updatePrice();
            })
            card.querySelector(".remove-from-cart").addEventListener("click",(e)=> {
                products.find(element => {
                    if(element.id == card.classList[1]) {
                        cartProducts = cartProducts.filter(pr => pr != element);
                    }
                })
                e.target.parentElement.parentElement.remove();
                updatePrice();
                let index = card.classList[1];
                mainContainer.querySelectorAll(".card").forEach((c)=> {
                    if(c.classList[1] == index) {
                        console.log(c);
                        c.querySelector(".add-to-cart").classList.remove("active");
                        c.querySelector(".add-to-cart").disabled = false;
                    }
                })
            })
        })


    });
    updatePrice();
}

function updatePrice() {
    totalPrice = 0

    cartProducts.forEach(pr => {
        totalPrice += pr.price * pr.quantity;
    })
    totalPriceEl.innerHTML = `Total Price : $${totalPrice}`;
}

cartIcon.addEventListener("click",(e)=> {
    window.scrollTo({ top: 0, behavior: "smooth" });
    cartContainer.classList.add("show");
})

closeIcon.addEventListener("click",(e)=> {
    cartContainer.classList.remove("show");
})

setInterval(()=> {
    cartContainer.style.height = `${Math.max( document.querySelector("body").scrollHeight, document.querySelector("body").offsetHeight, 
    document.querySelector("html").clientHeight, document.querySelector("html").scrollHeight, document.querySelector("html").offsetHeight )}px`;
},500);
