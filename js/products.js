function fetchProductsDataFromLocalStorage() {
    const productsData = JSON.parse(sessionStorage.getItem("productsAndServicesData"));
    return productsData;
}

async function populateProductsContainer() {
    const productsData = fetchProductsDataFromLocalStorage();

    if (!productsData || !productsData.products) {
        console.log("No product data available.");
        return;
    }

    const productsCaption = document.getElementById("ourProductsCaption");
    productsCaption.textContent = productsData.productCaption;

    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    productsData.products.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-lg-4", "col-md-6", "wow", "zoomIn");
        productCard.dataset.wowDelay = `${0.3 * (index + 1)}s`;

        const cardBody = document.createElement("div");
        cardBody.classList.add("product-item", "bg-light", "rounded", "d-flex", "flex-column", "align-items-center", "justify-content-center", "text-center");

        // Product Icon
        const productIcon = document.createElement("div");
        productIcon.className = "product-icon";
					const icon = document.createElement("i");
					icon.className = product.icon;
					icon.classList.add("text-white");
					icon.textContent = product.title.charAt(0);
					icon.style.fontSize = "24px";
					icon.style.fontWeight = "bold";
					productIcon.appendChild(icon);

        cardBody.appendChild(productIcon);

        // Product Title
        const productTitle = document.createElement("h4");
        productTitle.classList.add("mb-3");
        productTitle.textContent = product.title;

        cardBody.appendChild(productTitle);

        // Product Description
        const productDescription = document.createElement("p");
        productDescription.classList.add("m-0");
        productDescription.textContent = product.description;

        cardBody.appendChild(productDescription);

        // Product Link (hidden by default)
        const productLink = document.createElement("a");
        productLink.className = "btn btn-lg btn-primary rounded";
        productLink.setAttribute("href", "./contact.html");
        const linkIcon = document.createElement("i");
        linkIcon.className = "bi bi-arrow-right";
        productLink.appendChild(linkIcon);
        productLink.style.display = "none"; // Hide the link by default

        cardBody.appendChild(productLink);

        // Add event listeners for hover behavior
        cardBody.addEventListener("mouseenter", function () {
            productLink.style.display = "block";
        });

        cardBody.addEventListener("mouseleave", function () {
            productLink.style.display = "none";
        });

        productCard.appendChild(cardBody);

        productContainer.appendChild(productCard);
    });
}

populateProductsContainer();
