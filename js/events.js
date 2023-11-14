import {
	addDoc,
	collection,
	getDocs,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { firestore } from "../js/firebase-config.js";

const eventsCollection = collection(firestore, "events");
const eventsLeadsCollection = collection(firestore, "eventLeads");

function populateEventData() {
	const eventData = JSON.parse(sessionStorage.getItem("eventDataArray"));
	const eventContainer = document.getElementById("event-container");
	eventContainer.innerHTML = "";

	eventData.forEach((event) => {
		const card = document.createElement("div");
		card.classList.add("property-card");

		const carousel = document.createElement("div");
		carousel.classList.add("carousel");

		event.imageUrls.forEach((imageUrl) => {
			const propertyImage = document.createElement("img");
			propertyImage.src = imageUrl;
			propertyImage.alt = event.location;
			carousel.appendChild(propertyImage);
		});

		card.appendChild(carousel);

		const interestedButton = document.createElement("button");
		interestedButton.textContent = "Interested ?";
		interestedButton.classList.add(
			"btn",
			"btn-danger",
			"rounded",
			"position-absolute",
			"top-0",
			"end-0",
			"mt-2",
			"me-2"
		);
		interestedButton.addEventListener("click", () =>
			openApplicationModal(event)
		);
		card.appendChild(interestedButton);

		const stamp = document.createElement("div");
		stamp.classList.add("stamp");
		if (event.fashionType === "runway") {
			stamp.textContent = "Runway Show";
		} else if (event.fashionType === "exhibition") {
			stamp.textContent = "Fashion Exhibition";
		} else if (event.fashionType === "workshop") {
			stamp.textContent = "Fashion Workshop";
		}
		card.appendChild(stamp);

		const details = document.createElement("div");
		details.classList.add("property-details", "p-4");
		details.innerHTML = `
        <p class="font-weight-bold text-lg">${event.eventName.toUpperCase()}</p>
        <p class="text-sm">Date : ${event.eventDateTime.toUpperCase()}</p>
        <p class="text-sm">Location: ${event.eventLocation.toUpperCase()}</p>`;
		card.appendChild(details);

		eventContainer.appendChild(card);
	});

	if (!$(".carousel").hasClass("slick-initialized")) {
		$(".carousel").slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 2000,
			arrows: false,
		});
	}
}

function populateFeaturedEventsData() {
	const eventData = JSON.parse(sessionStorage.getItem("eventDataArray"));
	const carousel = document.querySelector(".featured-listings .slick-carousel");
	carousel.innerHTML = "";

	const maxListings = 3;
	const propertiesToDisplay = eventData.slice(0, maxListings);

	propertiesToDisplay.forEach((event, index) => {
		const card = document.createElement("div");
		card.classList.add("carousel-item");
		card.classList.add("property-card");
		card.id = `property-card-${index + 1}`;

		const propertyImage = document.createElement("img");
		propertyImage.src = event.imageUrls[0];
		propertyImage.alt = event.locality;
		card.appendChild(propertyImage);

		const stamp = document.createElement("div");
		stamp.classList.add("stamp");
		if (event.fashionType === "runway") {
			stamp.textContent = "Runway Show";
		} else if (event.fashionType === "exhibition") {
			stamp.textContent = "Fashion Exhibition";
		} else if (event.fashionType === "workshop") {
			stamp.textContent = "Fashion Workshop";
		}
		card.appendChild(stamp);

		const details = document.createElement("div");
		details.classList.add("property-details", "p-4");
		details.innerHTML = `
           <p class="font-bold text-lg">${event.eventName.toUpperCase()}</p>
           <p class="text-sm">Date : ${event.eventDateTime.toUpperCase()}</p>
           <p class="text-sm">Location: ${event.eventLocation.toUpperCase()}</p>`;
		card.appendChild(details);
		carousel.appendChild(card);
	});
	$(carousel).slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		arrows: false,
	});
}

function openApplicationModal(event) {
	const modal = document.getElementById("applicationModal");
	const form = document.getElementById("applicationForm");

	document.getElementById("eventName").value = event.eventName;
	document.getElementById("eventFee").value = event.eventFee;

	modal.style.display = "block";

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const name = document.getElementById("name").value;
		const mobile = document.getElementById("mobile").value;
		const email = document.getElementById("email").value;
		const eventName = document.getElementById("eventName").value;
		const timestamp = new Date();

		try {
			await addDoc(eventsLeadsCollection, {
				name: name,
				mobile: mobile,
				email: email,
				eventName: eventName,
				timestamp: timestamp,
			});
			const successMessage = document.getElementById("successMessage");
			successMessage.style.display = "block";

			setTimeout(() => {
				modal.style.display = "none";
				successMessage.style.display = "none";
			}, 2000);
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	});

	const closeButton = document.querySelector(".close");
	closeButton.addEventListener("click", () => {
		modal.style.display = "none";
	});

	window.addEventListener("click", (e) => {
		if (e.target === modal) {
			modal.style.display = "none";
		}
	});
}
function fetchDataAndPopulate() {
	const eventDataArray = [];

	getDocs(eventsCollection)
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.exists()) {
					const eventData = doc.data();
					eventDataArray.push(eventData);
				} else {
					console.log("No such document!");
				}
			});

			// Store the array in sessionStorage
			sessionStorage.setItem("eventDataArray", JSON.stringify(eventDataArray));

			// Call a function to handle populating with all data at once
			populateEventData();
			populateFeaturedEventsData();
		})
		.catch((error) => {
			console.log("Error getting documents:", error);
		});
}

$(document).ready(function () {
	fetchDataAndPopulate();
});
