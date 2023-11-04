import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { firestore } from "../js/firebase-config.js";

const totfd = collection(firestore, "totfd");
const totfdDocRef = doc(totfd, "totfdDoc");
const leadsCollection = collection(totfdDocRef, "leadsData");

var timestamp = serverTimestamp(firestore);

document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("contactForm");
	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("emailId");
	const mobileInput = document.getElementById("mobileNumber");
	const subjectInput = document.getElementById("subject");
	const commentsInput = document.getElementById("comments");

	const nameError = document.getElementById("nameError");
	const emailError = document.getElementById("emailError");
	const mobileError = document.getElementById("mobileNumberError");
	const subjectError = document.getElementById("subjectError");
	const commentsError = document.getElementById("commentsError");

	const submitButton = document.getElementById("submitButton");

	submitButton.addEventListener("click", function (e) {
		e.preventDefault();
		let isValid = false;

		if (nameInput.value.trim() === "") {
			nameError.textContent = "Please enter your Name";
			isValid = false;
		} else {
			nameError.textContent = "";
			isValid = true;
		}

		let isEmailValid = false;
		let isMobileValid = false;

		if (emailInput.value.trim() === "") {
			emailError.textContent = "Please enter your Email";
		} else if (!validateEmail(emailInput.value.trim())) {
			emailError.textContent = "Invalid Email";
		} else {
			emailError.textContent = "";
			isEmailValid = true;
		}

		if (mobileInput.value.trim() === "") {
			mobileError.textContent = "Please enter your Mobile Number";
		} else if (!validateMobile(mobileInput.value.trim())) {
			mobileError.textContent = "Invalid Mobile Number";
		} else {
			mobileError.textContent = "";
			isMobileValid = true;
		}

		if (isEmailValid || isMobileValid) {
			isValid = true;
			mobileError.textContent = "";
			emailError.textContent = "";
		}

		if (subjectInput.value.trim() === "") {
			subjectError.textContent = "Please enter your Subject";
			isValid = false;
		} else {
			subjectError.textContent = "";
			isValid = true;
		}

		if (commentsInput.value.trim() === "") {
			commentsError.textContent = "Please enter your Message";
			isValid = false;
		} else {
			commentsError.textContent = "";
			isValid = true;
		}

		if (isValid) {
			saveDataToFirebase();

			emailjs.init("crpJLdnvwLUGcZ7go");
			const templateParams = {
				to_email: "vishnukramakrishnan32@gmail.com",
				from_name: nameInput.value.trim(),
				from_email: emailInput.value.trim() || "Not Provided",
				mobile_number: mobileInput.value.trim() || "Not Provided",
				subject: subjectInput.value.trim(),
				message: commentsInput.value.trim(),
			};
			emailjs
				.send("service_6jdnwub", "template_ggn1pxs", templateParams)
				.then(function (response) {
					console.log("Email sent:", response);
					form.reset();
					setTimeout(function () {
						submissionMessage.textContent = "";
						submissionMessage.classList.remove("success-message");
					}, 3000);
				})
				.catch(function (error) {
					console.error("Email sending failed:", error);
				});
		}
	});

	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validateMobile(mobile) {
		const mobileRegex = /^\d{10}$/;
		return mobileRegex.test(mobile);
	}

	function saveDataToFirebase() {
		const formData = {
			timestamp: timestamp,
			name: nameInput.value.trim(),
			email: emailInput.value.trim(),
			mobile: mobileInput.value.trim(),
			subject: subjectInput.value.trim(),
			comments: commentsInput.value.trim(),
			status: "New",
		};

		const submissionMessage = document.getElementById("submissionMessage");
		addDoc(leadsCollection, formData)
			.then(function (docRef) {
				form.reset();
				setTimeout(function () {
					submissionMessage.textContent =
						"Your message has been sent successfully!";
					submissionMessage.classList.add("success-message");
				}, 2000);
			})

			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}
});

let contactData = sessionStorage.getItem("contactAndPaymentData");
if (contactData) {
	try {
		contactData = JSON.parse(contactData);
		showButtonsAndMaps(contactData);
	} catch (error) {
		console.log(error);
	}
}

function showButtonsAndMaps(data) {
	if (data.mobile && data.mobile !== null) {
		const mobileNumber = data.mobile;
		const formattedMobile = `+91 ${data.mobile.substring(
			0,
			5
		)} ${data.mobile.substring(5)}`;
		const mobile = document.getElementById("mobile");
		mobile.innerText = formattedMobile;
		const email = document.getElementById("email");
		email.innerText = data.email ? data.email : "";
		document.getElementById("whatsappButton").style.display = "block";
		document
			.getElementById("whatsappButton")
			.addEventListener("click", function () {
				const message = "Hello! I want to inquire about your products.";
				window.open(
					`https://wa.me/${mobileNumber}?text=${encodeURIComponent(message)}`
				);
			});
	} else {
		document.getElementById("whatsappButton").style.display = "none";
	}
	const showMapsButton = document.getElementById("showMapsBtn");
	const location = document.getElementById("location");
	location.innerText = data.location ? data.location : "";
	if (data.mapLocation && data.mapLocation !== null) {
		showMapsButton.style.display = "block";
		showMapsButton.addEventListener("click", function () {
			const mapUrl = data.mapLocation;
			window.location.href = mapUrl;
		});
	} else {
		showMapsButton.style.display = "none";
	}
}
