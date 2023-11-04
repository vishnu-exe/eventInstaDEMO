import {
	addDoc,
	collection,
	doc,
	getDoc,
	serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
	listAll,
	ref,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "./firebase-config.js";

const totfdCollection = collection(firestore, "totfd");
const contactAndPaymentsDocRef = doc(totfdCollection, "ContactAndPayments");
const homepageDocRef = doc(totfdCollection, "Homepage");

function getHomePageDataFromFirestoreAndSave() {
	getDoc(homepageDocRef)
		.then((docSnapshot) => {
			if (docSnapshot.exists()) {
				const homepageData = docSnapshot.data();
				if (homepageData) {
					const navbar = document.querySelector(".navbar");
					const font = homepageData.font;
					const fontSize = homepageData.fontSize;
					if (font) {
						navbar.style.fontFamily = font;
						document.body.style.fontFamily = font;
						if (fontSize) {
							navbar.style.fontSize = fontSize;
						}
					}
					const aboutUsImage = document.getElementById("aboutUsImage");
					const aboutUsPageImageUrl = homepageData.aboutUsPageimageurl;

					if (aboutUsPageImageUrl) {
						aboutUsImage.src = aboutUsPageImageUrl;
					} else {
						aboutUsImage.style.display = "none";
					}
					console.log("Homepage data found in session storage");

					const homepageImageUrl = homepageData.homePageimageurl;

					document.getElementById("logoimage").src = homepageData.logoimageurl;

					const webAppName = document.getElementById("webAppName");
					if (webAppName) {
						webAppName.textContent = homepageData.webAppName;
					}

					// const captionSpan = document.getElementById("caption");
					// captionSpan.textContent = homepageData.webAppName;

					const homePageCaption = document.getElementById("homePageCaption");
					homePageCaption.textContent = homepageData.homePageCaption;

					const homePageWelcome = document.getElementById("homePageWelcome");
					homePageWelcome.textContent = homepageData.homePageWelcome;

					const footerMessage = document.getElementById("footerMessage");
					if (homepageData && homepageData.footerMessage !== undefined) {
						footerMessage.textContent = homepageData.footerMessage;
					} else {
						footerMessage.textContent = null;
					}

					if (homepageImageUrl) {
						document.getElementById("homePageImage").src = homepageImageUrl;
						document.getElementById("homePageImage2").src = homepageImageUrl;
					} else {
						console.log("No background image to set");
					}

					const aboutUsCaption = document.getElementById("aboutUsCaption");
					aboutUsCaption.textContent = homepageData.aboutUsCaption;

					const aboutUsHeader = document.getElementById("aboutUsHeader");
					aboutUsHeader.textContent = homepageData.aboutUsHeader;

					const aboutUsPoints = document.getElementById("aboutUsPoints");
					homepageData.aboutUsPoints.forEach((point, index) => {
						const col = document.createElement("div");
						col.className = "col-sm-6 wow zoomIn";
						col.setAttribute("data-wow-delay", 0.2 * (index + 1) + "s");

						const pointElement = document.createElement("h5");
						pointElement.className = "mb-3";
						//console.log(pointElement);
						addIconToElement(pointElement)
							.then((message) => {
								//console.log(message);
								//console.log(pointElement); // Check if the icon is present in the pointElement
							})
							.catch((error) => {
								console.error(error);
							});
						pointElement.textContent = point;
						col.appendChild(pointElement);
						aboutUsPoints.appendChild(col);
					});
					sessionStorage.setItem("homepageData", JSON.stringify(homepageData));
				}
			} else {
				console.log("Homepage document does not exist.");
			}
		})
		.catch((error) => {
			console.error("Error fetching Homepage document:", error);
		});
}

const addIconToElement = (pointElement) => {
	return new Promise((resolve, reject) => {
		const icon = document.createElement("i");
		icon.classList.add("fas", "fa-check", "text-primary", "me-3");

		setTimeout(() => {
			pointElement.insertBefore(icon, pointElement.firstChild);
			resolve("Icon successfully appended to pointElement");
		}, 1000);
	});
};

async function servicesAndProducts() {
	try {
		const homePageDataSnapshot = await getDoc(homepageDocRef);
		const homePageData = homePageDataSnapshot.data();

		const productsAndServicesDocRef = doc(
			totfdCollection,
			"ProductsAndServices"
		);
		if (homePageData && homePageData.showServiceSection) {
			const docSnapshot = await getDoc(productsAndServicesDocRef);
			const productsAndServicesData = docSnapshot.data();

			if (
				docSnapshot.exists &&
				productsAndServicesData.servicesCaption &&
				homePageData.showServiceSection === true
			) {
				sessionStorage.setItem(
					"productsAndServicesData",
					JSON.stringify(productsAndServicesData)
				);

				//console.log(homePageData);
				const servicesLink = document.getElementById("services");
				servicesLink.style.display = "block";
				const servicesLink2 = document.getElementById("services2");
				servicesLink2.style.display = "block";

				const serviceContainer = document.getElementById("serviceContainer");
				serviceContainer.style.display = "block";
				const serviceContainer2 = document.getElementById("serviceContainer2");
				serviceContainer2.style.display = "block";

				const servicesTitle = document.getElementById("servicesTitle");
				servicesTitle.textContent = productsAndServicesData.servicesCaption;

				const servicesRow = document.getElementById("servicesRow");
				productsAndServicesData.services.forEach((service, index) => {
					const serviceColumn = document.createElement("div");
					serviceColumn.className = "col-lg-4 col-md-6 wow zoomIn";
					serviceColumn.setAttribute("data-wow-delay", 0.3 * (index + 1) + "s");

					const serviceItem = document.createElement("div");
					serviceItem.className =
						"service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center";

					const serviceIcon = document.createElement("div");
					serviceIcon.className = "service-icon";
					const icon = document.createElement("i");
					icon.className = service.icon;
					icon.classList.add("text-white");
					icon.textContent = service.title.charAt(0);
					icon.style.fontSize = "24px";
					icon.style.fontWeight = "bold";
					serviceIcon.appendChild(icon);

					const serviceTitle = document.createElement("h4");
					serviceTitle.className = "mb-3";
					serviceTitle.textContent = service.title;

					const serviceDescription = document.createElement("p");
					serviceDescription.className = "m-0";
					serviceDescription.textContent = service.description;

					const serviceLink = document.createElement("a");
					serviceLink.className = "btn btn-lg btn-primary rounded";
					serviceLink.setAttribute("href", "./contact.html");
					const linkIcon = document.createElement("i");
					linkIcon.className = "bi bi-arrow-right";
					serviceLink.appendChild(linkIcon);

					serviceItem.appendChild(serviceIcon);
					serviceItem.appendChild(serviceTitle);
					serviceItem.appendChild(serviceDescription);
					serviceItem.appendChild(serviceLink);

					serviceColumn.appendChild(serviceItem);
					servicesRow.appendChild(serviceColumn);
				});

				const servicesDropdown = document.getElementById("servicesDropdown");
				productsAndServicesData.services.forEach((service) => {
					const option = document.createElement("option");
					option.value = service.title;
					option.text = service.title;
					servicesDropdown.appendChild(option);
				});
			}

			if (
				docSnapshot.exists &&
				productsAndServicesData.productCaption &&
				homePageData.showProductSection === true
			) {
				sessionStorage.setItem(
					"productsAndServicesData",
					JSON.stringify(productsAndServicesData)
				);

				const moreLink = document.getElementById("more");
				moreLink.style.display = "block";
				const productsLink = document.getElementById("products");
				productsLink.style.display = "block";
				const productsLink2 = document.getElementById("products2");
				productsLink2.style.display = "block";
			}
		}
	} catch (error) {
		console.log("Error checking for service data:", error);
	}
}
function displaySocialIcons(data) {
	const connectWithUsBanner = document.getElementById("connectWithUsBanner");
	connectWithUsBanner.innerHTML = "";
	if (
		data &&
		(data.hasOwnProperty("facebook") ||
			data.hasOwnProperty("instagram") ||
			data.hasOwnProperty("youtube") ||
			data.hasOwnProperty("twitter"))
	) {
		connectWithUsBanner.style.display = "flex";

		if (data.facebook && data.facebook !== null) {
			const facebookIcon = createSocialIcon(
				"facebook",
				data.facebook,
				"fab fa-facebook-f"
			);
			connectWithUsBanner.appendChild(facebookIcon);
		}
		if (data.instagram && data.instagram !== null) {
			const instagramIcon = createSocialIcon(
				"instagram",
				data.instagram,
				"fab fa-instagram"
			);
			connectWithUsBanner.appendChild(instagramIcon);
		}
		if (data.youtube && data.youtube !== null) {
			const youtubeIcon = createSocialIcon(
				"youtube",
				data.youtube,
				"fab fa-youtube"
			);
			connectWithUsBanner.appendChild(youtubeIcon);
		}
		if (data.twitter && data.twitter !== null) {
			const twitterIcon = createSocialIcon(
				"twitter",
				data.twitter,
				"fab fa-twitter"
			);
			connectWithUsBanner.appendChild(twitterIcon);
		}
	}
}
function createSocialIcon(platform, url, iconClass) {
	const icon = document.createElement("a");
	icon.className = "btn btn-primary btn-square me-2";
	icon.href = url;
	icon.target = "_blank";
	const iconImage = document.createElement("i");
	iconImage.className = iconClass + " fw-normal";
	icon.appendChild(iconImage);
	return icon;
}
function getDataFromFirestoreAndSave() {
	const careersDocRef = doc(totfdCollection, "Careers");

	getDoc(contactAndPaymentsDocRef)
		.then((doc) => {
			if (doc.exists) {
				const data = doc.data();
				if (
					data &&
					(data.facebook || data.instagram || data.youtube || data.twitter)
				) {
					displaySocialIcons(data);
				}
				sessionStorage.setItem("contactAndPaymentData", JSON.stringify(data));
				const locationData = document.querySelector(
					".location-section .contact-data"
				);
				if (data && data.location) {
					locationData.textContent = data.location;
				}

				// Update email data
				const emailData = document.querySelector(
					".email-section .contact-data"
				);
				if (data && data.email) {
					emailData.textContent = data.email;
				}

				const phoneData = document.querySelector(
					".phone-section .contact-data"
				);
				const phoneData2 = document.querySelector(
					".phone-section2 .contact-data2"
				);
				if (data && data.mobile) {
					const formattedMobile = `+91 ${data.mobile.substring(
						0,
						5
					)} ${data.mobile.substring(5)}`;
					phoneData.textContent = formattedMobile;
					phoneData2.textContent = formattedMobile;
				}

				if (data && data.imageUrl) {
					//console.log(data.imageUrl);
					const paymentsLink = document.getElementById("payments");
					paymentsLink.style.display = "block";
					const paymentsLink2 = document.getElementById("payments2");
					paymentsLink2.style.display = "block";
				}
			}
		})
		.catch((error) => {
			console.error("Error getting document:", error);
		});

	getDoc(careersDocRef)
		.then((docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const careersData = data.jobs || [];
				console.log(data);
				if (Array.isArray(careersData) && careersData.length > 0) {
					const moreLink = document.getElementById("more");
					moreLink.style.display = "block";
					const careersLink = document.getElementById("careers");
					careersLink.style.display = "block";
					const careersLink2 = document.getElementById("careers2");
					careersLink2.style.display = "block";
					sessionStorage.setItem("careersData", JSON.stringify(careersData));
				}
			}
		})
		.catch((error) => {
			console.log("Error checking for careers:", error);
		});

	const storageRef = ref(storage, "totfd/gallery-images");

	listAll(storageRef)
		.then((res) => {
			const hasGallery = res.items.length > 0;
			sessionStorage.setItem("hasGallery", hasGallery);
			if (res.items.length > 0) {
				const moreLink = document.getElementById("more");
				moreLink.style.display = "block";
				const galleryLink = document.getElementById("gallery");
				const galleryLink2 = document.getElementById("gallery2");
				galleryLink.style.display = "block";
				galleryLink2.style.display = "block";
			}
		})
		.catch((error) => {
			console.log("Error checking for files:", error);
			0;
		});
	console.log("session storage loaded");
}

const sessionStorageSize = JSON.stringify(sessionStorage).length;
console.log("Session storage size:", sessionStorageSize, "bytes");

document.addEventListener("DOMContentLoaded", function () {
	const testimonialCarousel = document.querySelector(".testimonial-carousel");
	const moreLink = document.getElementById("more");
	const reviewSection = document.getElementById("reviewSection");
	const reviewsLink = document.getElementById("reviews");
	const reviewsLink2 = document.getElementById("reviews2");
	const reviewDocRef = doc(totfdCollection, "Reviews");

	const clientsDocRef = doc(totfdCollection, "Clients");

	//console.log("Fetching document...");
	getDoc(reviewDocRef)
		.then((docSnapshot) => {
			//console.log("Document snapshot received:", docSnapshot);
			if (docSnapshot.exists) {
				const data = docSnapshot.data();
				const reviewsData = data.reviews || [];

				if (Array.isArray(reviewsData) && reviewsData.length > 0) {
					//console.log("Reviews data found:", reviewsData);
					moreLink.style.display = "block";
					reviewsLink.style.display = "block";
					reviewsLink2.style.display = "block";
					reviewSection.style.display = "block";

					reviewsData.forEach((review) => {
						const testimonialItem = document.createElement("div");
						testimonialItem.classList.add("testimonial-item", "bg-light");

						const innerContent = `
                            <div class="d-flex align-items-center border-bottom pt-5 pb-4 px-5">
                                <img class="img-fluid rounded" src="${review.picUrl}" style="width: 60px; height: 60px" />
                                <div class="ps-4">
                                    <h4 class="text-primary mb-1">${review.name}</h4>
                                </div>
                            </div>
                            <div class="pt-4 pb-5 px-5">
                                ${review.text}
                            </div>
                        `;
						testimonialItem.innerHTML = innerContent;
						testimonialCarousel.appendChild(testimonialItem);
						console.log("Added testimonial:", review.name);
					});

					$(testimonialCarousel).owlCarousel({
						autoplay: true,
						smartSpeed: 1500,
						dots: true,
						loop: true,
						center: true,
						responsive: {
							0: {
								items: 1,
							},
							576: {
								items: 1,
							},
							768: {
								items: 2,
							},
							992: {
								items: 3,
							},
						},
					});

					sessionStorage.setItem("reviewsData", JSON.stringify(reviewsData));
					console.log("Reviews data stored in sessionStorage.");
				}
			} else {
				console.log("Document does not exist.");
			}
		})
		.catch((error) => {
			console.log("Error checking for reviews:", error);
		});

	const teamContainer = document.getElementById("teamContainer");
	const foundersDocRef = doc(totfdCollection, "Founders");

	getDoc(foundersDocRef)
		.then((docSnapshot) => {
			if (docSnapshot.exists) {
				const data = docSnapshot.data();
				const foundersData = data.founders || [];

				if (Array.isArray(foundersData) && foundersData.length > 0) {
					const foundersLink = document.getElementById("founders");
					foundersLink.style.display = "block";
					const foundersLink2 = document.getElementById("founders2");
					foundersLink2.style.display = "block";
					const TeamSection = document.getElementById("TeamSection");
					TeamSection.style.display = "block";
					sessionStorage.setItem("foundersData", JSON.stringify(foundersData));

					foundersData.forEach((founder, index) => {
						const colDelay = (index + 1) * 0.3;
						const colElement = document.createElement("div");
						colElement.classList.add("col-lg-4", "wow", "slideInUp");
						colElement.setAttribute("data-wow-delay", `${colDelay}s`);

						const teamItem = document.createElement("div");
						teamItem.classList.add(
							"team-item",
							"bg-light",
							"rounded",
							"overflow-hidden"
						);

						const teamImg = document.createElement("div");
						teamImg.classList.add(
							"team-img",
							"position-relative",
							"overflow-hidden"
						);

						const imgElement = document.createElement("img");
						imgElement.classList.add("img-fluid", "w-100");
						imgElement.src = founder.picUrl;
						imgElement.alt = founder.founderName;
						teamImg.appendChild(imgElement);

						const teamSocial = document.createElement("div");
						teamSocial.classList.add("team-social");
						teamSocial.style.display = "none";

						const socialIcons = [
							"fa fa-globe",
							"fab fa-facebook-f",
							"fab fa-instagram",
							"fab fa-linkedin-in",
						];

						socialIcons.forEach((iconClass) => {
							const icon = document.createElement("i");
							icon.setAttribute(
								"class",
								`btn btn-lg btn-primary btn-lg-square rounded ${iconClass} fw-normal`
							);
							teamSocial.appendChild(icon);
						});

						teamImg.appendChild(teamSocial);
						teamItem.appendChild(teamImg);
						teamImg.addEventListener("mouseover", () => {
							teamSocial.style.display = "block";
						});

						teamImg.addEventListener("mouseout", () => {
							teamSocial.style.display = "none";
						});

						const textCenter = document.createElement("div");
						textCenter.classList.add("text-center", "py-4");

						const nameElement = document.createElement("h4");
						nameElement.classList.add("text-primary");
						nameElement.textContent = founder.founderName;
						textCenter.appendChild(nameElement);

						const designationElement = document.createElement("p");
						designationElement.classList.add("text-uppercase", "m-0");
						designationElement.textContent = founder.founderDesignation;
						textCenter.appendChild(designationElement);

						const descriptionElement = document.createElement("p");
						descriptionElement.classList.add("text-muted", "mt-3");
						descriptionElement.textContent = founder.founderDescription;
						textCenter.appendChild(descriptionElement);

						const descriptionContainer = document.createElement("div");
						descriptionContainer.classList.add("row");
						const descriptionCol = document.createElement("div");
						descriptionCol.classList.add("col-12");
						descriptionContainer.appendChild(descriptionCol);

						teamItem.appendChild(textCenter);
						teamItem.appendChild(descriptionContainer);
						colElement.appendChild(teamItem);
						teamContainer.appendChild(colElement);
					});
				}
			}
		})
		.catch((error) => {
			console.log("Error checking for founders:", error);
		});

	getDoc(clientsDocRef)
		.then((docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const clientsData = data.clients || [];
				console.log(data.clients);
				if (Array.isArray(clientsData) && clientsData.length > 0) {
					const clientsLink = document.getElementById("clients");
					clientsLink.style.display = "block";
					const clientsLink2 = document.getElementById("clients2");
					clientsLink2.style.display = "block";
					const vendorSection = document.getElementById("vendorSection");
					vendorSection.style.display = "block";

					const clientsArray = [];

					clientsData.forEach((client) => {
						clientsArray.push(client);
					});
					sessionStorage.setItem("clientsData", JSON.stringify(clientsArray));
				}
			}
		})
		.catch((error) => {
			console.error("Error checking for clients:", error);
		});
});

document.addEventListener("DOMContentLoaded", function () {
	showSpinner();
	getHomePageDataFromFirestoreAndSave();
	getDataFromFirestoreAndSave();
	servicesAndProducts();
	setTimeout(function () {
		hideSpinner();
	}, 2000);
});

var showSpinner = function () {
	$("#spinner").addClass("show");
};

var hideSpinner = function () {
	if ($("#spinner").length > 0) {
		$("#spinner").removeClass("show");
	}
};
document
	.getElementById("submitButton")
	.addEventListener("click", function (event) {
		event.stopPropagation();
		event.preventDefault();

		const name = document.querySelector('input[placeholder="Your Name"]').value;
		const email = document.querySelector(
			'input[placeholder="Your Email"]'
		).value;
		const mobile = document.querySelector(
			'input[placeholder="Your Mobile Number"]'
		).value;
		const service = document.getElementById("servicesDropdown").value || null;
		const message =
			document.querySelector('textarea[placeholder="Message"]').value || null;
		const timestamp = serverTimestamp(firestore);

		const nameError = document.getElementById("nameError");
		const emailError = document.getElementById("emailError");
		const mobileError = document.getElementById("mobileError");

		let isValid = true;

		if (!name) {
			nameError.style.display = "block";
			isValid = false;
		} else {
			nameError.style.display = "none";
		}

		if ((!email && !mobile) || (email && !validateEmail(email))) {
			emailError.style.display = "block";
			isValid = false;
		} else {
			emailError.style.display = "none";
		}

		if ((!email && !mobile) || (mobile && !validateMobile(mobile))) {
			mobileError.style.display = "block";
			isValid = false;
		} else {
			mobileError.style.display = "none";
		}

		if (isValid) {
			const totfd = collection(firestore, "totfd");
			const totfdDocRef = doc(totfd, "totfdDoc");
			const leadsCollection = collection(totfdDocRef, "leadsData");

			const formData = {
				timestamp: timestamp,
				name: name,
				email: email,
				mobile: mobile,
				subject: service,
				comments: message,
				status: "New",
			};

			addDoc(leadsCollection, formData)
				.then((docRef) => {
					console.log("Document written with ID: ", docRef.id);
					successMessage.style.display = "block";
					document.getElementById("serviceForm").reset();
					setTimeout(() => {
						successMessage.style.display = "none";
					}, 3000);
				})
				.catch((error) => {
					console.error("Error adding document: ", error);
				});
		}
	});

function validateEmail(email) {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
}
function validateMobile(mobile) {
	const re = /^\d{10}$/;
	return re.test(mobile);
}
