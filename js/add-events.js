import {
	collection,
	doc,
	setDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "../js/firebase-config.js";

const eventsCollection = collection(firestore, "events");

const addImageBtn = document.getElementById("addImage");
const imageInputContainer = document.getElementById("imageInputContainer");
const productForm = document.getElementById("productForm");
const errorText = document.getElementById("errorText");

addImageBtn.addEventListener("click", function (e) {
	e.preventDefault();
	const newImageInput = document.createElement("input");
	newImageInput.type = "file";
	newImageInput.className = "image-upload-input";
	newImageInput.name = "productImages[]";
	newImageInput.multiple = true;
	imageInputContainer.appendChild(newImageInput);
	newImageInput.style.marginTop = "10px";
});
productForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	errorText.textContent = ""; // Clear any previous error message

	const eventName = document.getElementById("eventNameInput").value;
	const eventDateTime = document.getElementById("eventDateTimeInput").value;
	const eventLocation = document.getElementById("eventLocationInput").value;
	const fashionType = document.getElementById("fashionTypeSelect").value;
	const eventFee = document.getElementById("eventFee").value;

	const eventImageInputs = document.querySelectorAll(".image-upload-input");
	const imageUrls = [];

	let hasSelectedImage = false;

	for (const input of eventImageInputs) {
		const eventImageFile = input.files[0];

		if (eventImageFile) {
			hasSelectedImage = true;

			// Show confirmation message during upload
			errorText.textContent = "Uploading images, please wait...";

			const imageStorageRef = ref(
				storage,
				"eventImages/" + eventImageFile.name
			);

			try {
				const uploadTask = uploadBytesResumable(
					imageStorageRef,
					eventImageFile
				);
				await uploadTask;

				const imageUrl = await getDownloadURL(imageStorageRef);
				imageUrls.push(imageUrl);
			} catch (error) {
				console.log(error);
			}
		}
	}

	if (!hasSelectedImage) {
		errorText.textContent = "Please select at least one image.";
		return;
	}

	const eventData = {
		eventName,
		eventDateTime,
		eventLocation,
		fashionType,
		eventFee,
		imageUrls,
	};

	try {
		await setDoc(doc(eventsCollection), eventData);

		const successMessage = document.getElementById("successMessage");
		successMessage.style.display = "block";
		successMessage.textContent = "Event added successfully";

		// Clear the input fields
		document.getElementById("eventNameInput").value = "";
		document.getElementById("eventDateTimeInput").value = "";
		document.getElementById("eventLocationInput").value = "";
		document.getElementById("fashionTypeSelect").value = "";
		document.getElementById("eventFee").value = "";

		eventImageInputs.forEach((input) => {
			imageInputContainer.removeChild(input);
		});

		const clonedImageContainer = imageInputContainer.cloneNode(true);
		productForm.appendChild(clonedImageContainer);

		errorText.textContent = "";

		setTimeout(() => {
			successMessage.style.display = "none";
		}, 2000);
	} catch (error) {
		console.log(error);
	}
});
