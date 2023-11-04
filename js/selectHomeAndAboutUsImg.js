import {
	collection,
	doc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
	getDownloadURL,
	listAll,
	ref,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "../js/firebase-config.js";

const folderPath = "totfd/Home-page-images";

const folderRef = ref(storage, folderPath);

window.updateSelectedName = function (url) {
	document.getElementById("message").textContent = "Image selected";
};

listAll(folderRef)
	.then(function (result) {
		var i = 1;
		result.items.forEach(function (item) {
			var row = document.createElement("tr");
			getDownloadURL(item)
				.then(function (url) {
					// Set the image source using the URL
					row.innerHTML = `
<td>${i++}</td>
<td>${item.name}</td>
<td><img src="${url}" width="40" alt="homePageImage" height="40" onclick="
var modal = document.getElementById('imageModal');
var modalImage = document.getElementById('modalImage');
modal.style.display = 'block';
modalImage.src = '${url}';
"/></td>
<td><input type="radio" name="selectedName" id="radio-${i}" value="${
						item.name
					}"></td>`;
					// Add the row to the table body
					document.getElementById("table-body").appendChild(row);
				})
				.catch(function (error) {
					console.error("Error getting download URL: ", error);
				});
		});
		i = 1;
	})
	.catch(function (error) {
		console.error("Error fetching images: ", error);
	});

const totfdCollection = collection(firestore, "totfd");
const Homepage = doc(totfdCollection, "Homepage");

async function updateFirestoreWithSelectedURL(imageName) {
	try {
		const url = await getDownloadURL(
			ref(storage, "totfd/Home-page-images/" + imageName)
		);

		// Update Firestore with the fetched URL
		await updateDoc(Homepage, {
			homePageimageurl: url,
		});

		document.getElementById("message").textContent = "Home Page Image updated.";
		window.scrollTo(0, 0);

		setTimeout(function () {
			document.getElementById("message").textContent = "";
		}, 3000);
	} catch (error) {
		console.error("Error updating Firestore:", error);
	}
}
async function updateFirestoreWithSelectedURL1(imageName) {
	try {
		const url = await getDownloadURL(
			ref(storage, "totfd/Home-page-images/" + imageName)
		);

		// Update Firestore with the fetched URL
		await updateDoc(Homepage, {
			aboutUsPageimageurl: url,
		});

		document.getElementById("message").textContent = "about Us Image updated.";
		window.scrollTo(0, 0);

		setTimeout(function () {
			document.getElementById("message").textContent = "";
		}, 3000);
	} catch (error) {
		console.error("Error updating Firestore:", error);
	}
}

// Add event listener to the update button
document.getElementById("update-button").addEventListener("click", () => {
	const selectedRadio = document.querySelector(
		'input[name="selectedName"]:checked'
	);
	if (selectedRadio) {
		const selectedImageName = selectedRadio.value;
		// Call the function to update Firestore with the selected image URL
		updateFirestoreWithSelectedURL(selectedImageName);
	} else {
		document.getElementById("message").textContent = "Please select an image.";
		setTimeout(function () {
			document.getElementById("message").textContent = "";
		}, 3000);
	}
});

// Add event listener to the update button1
document.getElementById("update-button1").addEventListener("click", () => {
	const selectedRadio = document.querySelector(
		'input[name="selectedName"]:checked'
	);
	if (selectedRadio) {
		const selectedImageName = selectedRadio.value;
		// Call the function to update Firestore with the selected image URL
		updateFirestoreWithSelectedURL1(selectedImageName);
	} else {
		document.getElementById("message").textContent = "Please select an image.";
		setTimeout(function () {
			document.getElementById("message").textContent = "";
		}, 3000);
	}
});

function closeImageModal() {
	var modal = document.getElementById("imageModal");
	modal.style.display = "none";
}

var closeButton = document.querySelector(".close");
closeButton.addEventListener("click", function () {
	closeImageModal();
});
