import {
	arrayRemove,
	collection,
	doc,
	getDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { firestore } from "../js/firebase-config.js";

const totfdCollection = collection(firestore, "totfd");
const homepageDocRef = doc(totfdCollection, "Homepage");
const productsAndServicesDocRef = doc(totfdCollection, "ProductsAndServices");

const messageElement = document.getElementById("message");

const websiteContentForm = document.getElementById("website-content-form");
const webAppNameInput = document.getElementById("webAppName1");
const homePageWelcomeInput = document.getElementById("homePageWelcome");
const homePageCaptionInput = document.getElementById("homePageCaption");
const footerMessageInput = document.getElementById("footerMessageInput");
const webAppNameError = document.getElementById("webAppName-error");
const homePageWelcomeError = document.getElementById("homePageWelcome-error");
const homePageCaptionError = document.getElementById("homePageCaption-error");
const footerMessageError = document.getElementById("footerMessage-error");

websiteContentForm.addEventListener("submit", (e) => {
	e.preventDefault(); // Prevent the form from submitting and reloading the page

	// Reset error messages
	webAppNameError.style.display = "none";
	homePageWelcomeError.style.display = "none";
	homePageCaptionError.style.display = "none";
	footerMessageError.style.display = "none";

	// Capture user inputs
	const webAppName = webAppNameInput.value;
	const homePageWelcome = homePageWelcomeInput.value;
	const homePageCaption = homePageCaptionInput.value;
	const footerMessage = footerMessageInput.value;

	// Basic form validation
	let isValid = true;

	if (!webAppName) {
		webAppNameError.textContent = "Enter WebApp Name";
		webAppNameError.style.display = "block";
		isValid = false;
	}

	if (!homePageWelcome) {
		homePageWelcomeError.textContent = "Enter Home Page Welcome";
		homePageWelcomeError.style.display = "block";
		isValid = false;
	}

	if (!homePageCaption) {
		homePageCaptionError.textContent = "Enter Home Page Caption";
		homePageCaptionError.style.display = "block";
		isValid = false;
	}
	if (!footerMessage) {
		footerMessageError.textContent = "Enter Footer Message";
		console.log("a");
		footerMessageError.style.display = "block";
		isValid = false;
	}

	if (!isValid) {
		return;
	}

	const newData = {
		webAppName: webAppName,
		homePageWelcome: homePageWelcome,
		homePageCaption: homePageCaption,
		footerMessage: footerMessage,
	};
	updateDoc(homepageDocRef, newData)
		.then(() => {
			console.log("Data updated successfully!");
			messageElement.textContent =
				"Home Page Data updated successfully!Go to Home Page and Refresh to see the changes.";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error updating data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
});

const aboutUsCaptionInput = document.getElementById("aboutUsCaption");
const aboutUsHeaderInput = document.getElementById("aboutUsHeader");
const aboutUsFooterInput = document.getElementById("aboutUsFooter");
const aboutUsPointsContainer = document.getElementById("aboutUsPoints");
const addAboutUsPointButton = document.getElementById("addAboutUsPoint");

async function checkToggleData() {
	getDoc(homepageDocRef).then((docSnapshot) => {
		if (docSnapshot.exists) {
			const data = docSnapshot.data();
			const isAboutUsSectionVisible = data.showAboutUsSection || false;
			const isProductSectionVisible = data.showProductSection || false;
			const isServiceSectionVisible = data.showServiceSection || false;

			document.getElementById("toggleAboutUs").checked =
				isAboutUsSectionVisible;
			document.getElementById("toggleService").checked =
				isServiceSectionVisible;
			document.getElementById("toggleProduct").checked =
				isProductSectionVisible;

			toggleAboutUsFormVisibility(isAboutUsSectionVisible);
			toggleProductFormVisibility(isProductSectionVisible);
			toggleServiceFormVisibility(isServiceSectionVisible);
		}
	});
}

checkToggleData();

document
	.getElementById("toggleAboutUs")
	.addEventListener("change", function () {
		const form = document.getElementById("aboutus-content-form");
		const isVisible = this.checked;
		form.style.display = isVisible ? "block" : "none";

		updateDoc(homepageDocRef, {
			showAboutUsSection: isVisible,
		});
	});

document
	.getElementById("toggleProduct")
	.addEventListener("change", function () {
		const form = document.getElementById("products-content-form");
		const isVisible = this.checked;
		form.style.display = isVisible ? "block" : "none";

		updateDoc(homepageDocRef, {
			showProductSection: isVisible,
		});
	});

document
	.getElementById("toggleService")
	.addEventListener("change", function () {
		const form = document.getElementById("service-content-form");
		const isVisible = this.checked;
		form.style.display = isVisible ? "block" : "none";

		updateDoc(homepageDocRef, {
			showServiceSection: isVisible,
		});
	});

function toggleAboutUsFormVisibility(isVisible) {
	const form = document.getElementById("aboutus-content-form");
	form.style.display = isVisible ? "block" : "none";
}
function toggleProductFormVisibility(isVisible) {
	const form = document.getElementById("products-content-form");
	form.style.display = isVisible ? "block" : "none";
}
function toggleServiceFormVisibility(isVisible) {
	const form = document.getElementById("service-content-form");
	form.style.display = isVisible ? "block" : "none";
}

toggleAboutUsFormVisibility();
toggleProductFormVisibility();
toggleServiceFormVisibility();

function saveAboutUsData() {
	const aboutUsData = collectFormData();

	updateDoc(homepageDocRef, aboutUsData)
		.then(() => {
			console.log("About Us data saved successfully!");
			console.log("Data updated successfully!");
			messageElement.textContent =
				"About Us Data updated successfully!Go to Home Page and Refresh to see the changes.";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error saving data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
}
function collectFormData() {
	const aboutUsData = {
		aboutUsCaption: aboutUsCaptionInput.value,
		aboutUsHeader: aboutUsHeaderInput.value,
		aboutUsFooter: aboutUsFooterInput.value,
		aboutUsPoints: [], // Initialize with an empty array
	};
	const pointInputs = aboutUsPointsContainer.querySelectorAll(
		".about-us-point input[type='text']"
	);
	pointInputs.forEach((pointInput) => {
		const pointValue = pointInput.value.trim();
		if (pointValue !== "") {
			aboutUsData.aboutUsPoints.push(pointValue);
		}
	});

	return aboutUsData;
}

const aboutUsForm = document.getElementById("aboutus-content-form");
aboutUsForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveAboutUsData();
});

function populateAboutUsForm(docSnapshot) {
	if (docSnapshot.exists()) {
		const aboutUsData = docSnapshot.data();
		aboutUsCaptionInput.value = aboutUsData.aboutUsCaption || "";
		aboutUsHeaderInput.value = aboutUsData.aboutUsHeader || "";
		aboutUsFooterInput.value = aboutUsData.aboutUsFooter || "";

		aboutUsData.aboutUsPoints.forEach((pointText) => {
			createPointDiv(pointText);
		});
	}
}
async function deletePointFromAboutUsDocRef(pointText) {
	try {
		const fieldValue = arrayRemove(pointText);
		await updateDoc(homepageDocRef, { aboutUsPoints: fieldValue });
		console.log("Point deleted from Firestore successfully!");
	} catch (error) {
		console.error("Error deleting point from Firestore: ", error);
	}
}

function createPointDiv(pointText) {
	const pointDiv = document.createElement("div");
	pointDiv.classList.add("about-us-point");
	pointDiv.innerHTML = `
    Point: <input type="text" class="form-control border border-primary" value="${pointText}" />
    <input type="button" class="btn btn-primary delete-point" value="Delete" />`;

	const deleteButton = pointDiv.querySelector(".delete-point");
	deleteButton.addEventListener("click", async () => {
		const pointText = pointDiv.querySelector("input[type='text']").value.trim();
		await deletePointFromAboutUsDocRef(pointText);
		pointDiv.remove();
		messageElement.textContent =
			"About Us Point Deleted successfully!Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		0;
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
		console.log("Point deleted from UI successfully!");
	});

	aboutUsPointsContainer.appendChild(pointDiv);
}

addAboutUsPointButton.addEventListener("click", () => {
	const newPointDiv = document.createElement("div");
	newPointDiv.classList.add("about-us-point");
	const pointInput = document.createElement("input");
	pointInput.type = "text";
	pointInput.classList.add("form-control", "border", "border-primary");
	const deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.classList.add("btn", "btn-primary", "delete-point");
	deleteButton.value = "Delete";

	deleteButton.addEventListener("click", async () => {
		const pointText = newPointDiv
			.querySelector("input[type='text']")
			.value.trim();
		await deletePointFromAboutUsDocRef(pointText);
		aboutUsPointsContainer.removeChild(newPointDiv);
	});

	newPointDiv.appendChild(document.createTextNode("Point: "));
	newPointDiv.appendChild(pointInput);
	newPointDiv.appendChild(deleteButton);

	aboutUsPointsContainer.appendChild(newPointDiv);
});

const serviceContentForm = document.getElementById("service-content-form");
const serviceCaptionInput = document.getElementById("ourServicesCaption");
const allOurServices = document.getElementById("allOurServices");
const addServiceButton = document.getElementById("addService");

function saveServicesData() {
	const ServicesData = collectServicesFormData();

	// Save the data to Firebase
	updateDoc(productsAndServicesDocRef, ServicesData)
		.then(() => {
			console.log("Services data saved successfully!");
			console.log("Data updated successfully!");
			messageElement.textContent =
				"Service Data updated successfully!Go to Home Page and Refresh to see the changes.";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error saving data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
}
function collectServicesFormData() {
	const servicesData = {
		servicesCaption: document.getElementById("ourServicesCaption").value,
		services: [], // Initialize with an empty array
	};
	var i = 0;
	const serviceElements = document.querySelectorAll(".service");
	serviceElements.forEach((serviceElement) => {
		const serviceTitleInput = serviceElement.querySelector(
			"input[placeholder='Service Title']"
		);
		const serviceDescInput = serviceElement.querySelector(
			"input[placeholder='Service Description']"
		);

		//console.log(serviceTitleInput);
		//console.log(serviceDescInput);
		const service = {
			title: serviceTitleInput.value,
			description: serviceDescInput.value,
		};

		servicesData.services.push(service);
	});
	return servicesData;
}

serviceContentForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveServicesData();
});

function populateServicesForm(docSnapshot) {
	if (docSnapshot.exists()) {
		const servicesData = docSnapshot.data();
		serviceCaptionInput.value = servicesData.servicesCaption || "";

		// Clear existing services
		allOurServices.innerHTML = "";

		servicesData.services.forEach((service) => {
			createServiceDiv(service.title, service.description);
			//console.log(service.title, service.description);
		});
	}
}

async function deleteServiceFromFirestore(title, description) {
	try {
		const serviceToRemove = {
			title: title,
			description: description,
		};
		await updateDoc(productsAndServicesDocRef, {
			services: arrayRemove(serviceToRemove),
		});

		console.log(
			"Service deleted from Firestore successfully!Go to Home Page and Refresh to see the changes."
		);
	} catch (error) {
		console.error("Error deleting service from Firestore: ", error);
	}
}

function createServiceDiv(title, description) {
	const serviceDiv = document.createElement("div");
	serviceDiv.classList.add("service");

	serviceDiv.innerHTML = `
	<p>Service Title: <input type="text" placeholder="Service Title" class="form-control border-2 border border-primary" value="${
		title || ""
	}" /></p>
	  Service Description: <input type="text" placeholder="Service Description" class="form-control border-2 border border-primary" value="${
			description || ""
		}" />
	  <input type="button" class="btn btn-primary delete-service" value="Delete" />
	`;

	//console.log(description);
	const deleteButton = serviceDiv.querySelector(".delete-service");
	deleteButton.addEventListener("click", async () => {
		const titleInput = serviceDiv.querySelector(
			"input[placeholder='Service Title']"
		);
		const descriptionInput = serviceDiv.querySelector(
			"input[placeholder='Service Description']"
		);
		//location.reload();
		//console.log(titleInput);
		//console.log(descriptionInput);
		await deleteServiceFromFirestore(titleInput.value, descriptionInput.value);
		serviceDiv.remove();
		messageElement.textContent =
			"Service Deleted successfully!Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
	});
	allOurServices.appendChild(serviceDiv);
}
// Add a click event listener to the button
addServiceButton.addEventListener("click", () => {
	// Create a new div for the service
	const newServiceDiv = document.createElement("div");
	newServiceDiv.classList.add("service");

	// Create input elements for the service title and description
	const titleInput = document.createElement("input");
	titleInput.type = "text";
	titleInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	titleInput.placeholder = "Service Title";

	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	descriptionInput.placeholder = "Service Description";

	// Create a delete button
	const deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.classList.add(
		"btn",
		"btn-primary",
		"delete-service",
		"red-button"
	);
	deleteButton.value = "Delete";

	// Add a click event listener to the delete button
	deleteButton.addEventListener("click", async () => {
		const titleInput = newServiceDiv
			.querySelector("input[placeholder='Service Title']")
			.value.trim();
		const descriptionInput = newServiceDiv
			.querySelector("input[placeholder='Service Description']")
			.value.trim();
		await deleteServiceFromFirestore(titleInput.value, descriptionInput.value);
		allOurServices.removeChild(newServiceDiv);
		messageElement.textContent =
			"Service Data Deleted successfully!Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
	});

	// Append the input elements and delete button to the service div
	newServiceDiv.appendChild(document.createTextNode("Service Title: "));
	newServiceDiv.appendChild(titleInput);
	newServiceDiv.appendChild(document.createTextNode("Service Description: "));
	newServiceDiv.appendChild(descriptionInput);
	newServiceDiv.appendChild(deleteButton);

	// Append the new service div to the container
	allOurServices.appendChild(newServiceDiv);
});
const productContentForm = document.getElementById("products-content-form");
const productCaptionInput = document.getElementById("ourProductsCaption");
const allOurProducts = document.getElementById("allourProducts");
const addProductsButton = document.getElementById("addProduct");

function saveProductsData() {
	const ProductData = collectProductsFormData();

	// Save the data to Firebase
	updateDoc(productsAndServicesDocRef, ProductData)
		.then(() => {
			console.log(
				"Products data saved successfully!Go to Home Page and Refresh to see the changes."
			);
			console.log(ProductData);
			messageElement.textContent = "Product Data updated successfully!";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error saving data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
}
function collectProductsFormData() {
	const productsData = {
		productCaption: document.getElementById("ourProductsCaption").value,
		products: [], // Initialize with an empty array
	};
	const productElements = document.querySelectorAll(".product");
	productElements.forEach((productElement) => {
		const productTitleInput = productElement.querySelector(
			"input[placeholder='Product Title']"
		);
		const productDescInput = productElement.querySelector(
			"input[placeholder='Product Description']"
		);

		//console.log(serviceTitleInput);
		//console.log(serviceDescInput);
		const product = {
			title: productTitleInput.value,
			description: productDescInput.value,
		};

		productsData.products.push(product);
	});
	return productsData;
}

productContentForm.addEventListener("submit", function (e) {
	e.preventDefault(); // Prevent the default form submission
	saveProductsData(); // Call the function to save data
});

function populateProductsForm(docSnapshot) {
	if (docSnapshot.exists()) {
		const productData = docSnapshot.data();
		productCaptionInput.value = productData.productCaption || "";

		allOurProducts.innerHTML = "";
		if (productData.products && Array.isArray(productData.products)) {
			productData.products.forEach((product) => {
				createProductDiv(product.title, product.description);
			});
		}
	}
}

async function deleteProductFromFirestore(title, description) {
	try {
		const productToRemove = {
			title: title,
			description: description,
		};
		console.log(productToRemove);

		await updateDoc(productsAndServicesDocRef, {
			products: arrayRemove(productToRemove),
		});

		console.log(
			"Product deleted from Firestore successfully!Go to Home Page and Refresh to see the changes."
		);
	} catch (error) {
		console.error("Error deleting Product from Firestore: ", error);
	}
}

function createProductDiv(title, description) {
	const productDiv = document.createElement("div");
	productDiv.classList.add("product");

	productDiv.innerHTML = `
    <p>Product Title: <input type="text" placeholder = "Product Title" class="form-control border-2 border border-primary" value="${
			title || ""
		}" /></p>
    Product Description: <input type="text" placeholder = "Product Description" class="form-control border-2 border border-primary" value="${
			description || ""
		}" />
    <input type="button" class="btn btn-primary delete-product" value="Delete" />
  `;

	const deleteButton = productDiv.querySelector(".delete-product");
	deleteButton.addEventListener("click", async () => {
		const titleInput = productDiv.querySelector(
			"input[placeholder='Product Title']"
		);
		const descriptionInput = productDiv.querySelector(
			"input[placeholder='Product Description']"
		);
		//location.reload();
		console.log(titleInput);
		console.log(descriptionInput);
		await deleteProductFromFirestore(titleInput.value, descriptionInput.value);

		productDiv.remove();
		messageElement.textContent =
			"Product Deleted successfully!Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
	});
	allOurProducts.appendChild(productDiv);
}
// Add a click event listener to the button
addProductsButton.addEventListener("click", () => {
	// Create a new div for the service
	const newProductDiv = document.createElement("div");
	newProductDiv.classList.add("product");

	// Create input elements for the service title and description
	const titleInput = document.createElement("input");
	titleInput.type = "text";
	titleInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	titleInput.placeholder = "Product Title";

	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	descriptionInput.placeholder = "Product Description";

	// Create a delete button
	const deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.classList.add(
		"btn",
		"btn-primary",
		"delete-product",
		"red-button"
	);
	deleteButton.value = "Delete";

	// Add a click event listener to the delete button
	deleteButton.addEventListener("click", async () => {
		const titleInput = newProductDiv
			.querySelector("input[placeholder='Product Title']")
			.value.trim();
		const descriptionInput = newProductDiv
			.querySelector("input[placeholder='Product Description']")
			.value.trim();
		await deleteProductFromFirestore(titleInput.value, descriptionInput.value);
		allOurProducts.removeChild(newProductDiv);
		messageElement.textContent =
			"Product Data Deleted successfully!Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
	});

	newProductDiv.appendChild(document.createTextNode("Product Title: "));
	newProductDiv.appendChild(titleInput);
	newProductDiv.appendChild(document.createTextNode("Product Description: "));
	newProductDiv.appendChild(descriptionInput);
	newProductDiv.appendChild(deleteButton);

	allOurProducts.appendChild(newProductDiv);
});

function populateFormFields() {
	getDoc(homepageDocRef)
		.then((docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				webAppNameInput.value = data.webAppName || "";
				homePageWelcomeInput.value = data.homePageWelcome || "";
				homePageCaptionInput.value = data.homePageCaption || "";
				footerMessageInput.value = data.footerMessage || "";
				populateAboutUsForm(docSnapshot);
			}
		})
		.catch((error) => {
			console.error("Error retrieving data: ", error);
		});
	getDoc(productsAndServicesDocRef)
		.then((docSnapshot) => {
			if (docSnapshot.exists()) {
				populateServicesForm(docSnapshot);
				populateProductsForm(docSnapshot);
			}
		})
		.catch((error) => {
			console.error("Error retrieving services data: ", error);
		});
}

var fontFamilyDropdown = document.getElementById("fontFamily");
fontFamilyDropdown.addEventListener("change", function () {
	var selectedFont = fontFamilyDropdown.value;
	var fontPreview = document.getElementById("fontPreview");
	fontPreview.style.fontFamily = selectedFont;
});

const applyButton = document.getElementById("applyButton");
const fontFamilyError = document.getElementById("fontFamily-error");

applyButton.addEventListener("click", async (event) => {
	event.preventDefault();
	event.stopPropagation();

	const selectedFont = document.getElementById("fontFamily").value;
	const selectedFontSize = document.getElementById("fontSize").value;

	if (!selectedFont) {
		fontFamilyError.style.display = "block";
		return;
	} else {
		fontFamilyError.style.display = "none";
	}

	try {
		await updateDoc(homepageDocRef, {
			font: selectedFont,
			fontSize: selectedFontSize || null,
		});
		messageElement.textContent =
			"Font Applied successfully, Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		console.log("Font updated successfully in Firebase.");
		window.scrollTo(0, 0);
	} catch (error) {
		console.error("Error updating font and preview in Firebase:", error);
	}
});

document.addEventListener("DOMContentLoaded", async function () {
	try {
		populateFormFields();
		try {
			const doc = await getDoc(homepageDocRef);
			const font = doc.data().font;
			const fontSize = doc.data().fontSize;

			if (font) {
				document.getElementById("fontFamily").value = font;
			}

			if (fontSize) {
				document.getElementById("fontSize").value = fontSize;
			}
		} catch (error) {
			console.error("Error getting font details from the database:", error);
		}
	} catch (error) {
		console.error("Error:", error);
	}
});
