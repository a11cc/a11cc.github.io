function authToken() {
	try {
		return JSON.parse(localStorage.getItem("store")).accessToken.token;
	} catch(error) {
		return false;
	}
}

function uploadFile(file, outputCallback, progressCallback) {
	const auth = authToken();
	
	if(!auth) {
		console.log("Error: Failed to get auth token");
		outputCallback(false);
		return;
	}

	const form = new FormData();
	form.append("type", "emote");
	form.append("level", "channel");
	form.append("emote", file);
	
	const request = new XMLHttpRequest();

	request.upload.addEventListener("progress", event => {
		if(event.lengthComputable) {
			const percent = Math.floor(event.loaded / event.total * 100);
			progressCallback(percent);
		}
	});
	
	request.addEventListener("load", event => {
		let url = false;
		
		try {
			url = JSON.parse(request.response).imgURL;
		} catch(error) {
			console.log("Error: Invalid upload response");
		}

		outputCallback(url);
	});

	request.addEventListener("error", event => {
		console.log("Error: Upload request failed");
		outputCallback(false);
	});
	
	request.open("POST", "https://upload.prd.dlive.tv/emote");
	request.setRequestHeader("authorization", auth);
	request.send(form);
}

function createPage() {
	const svgFace = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100mm" height="100mm" viewBox="0 0 100 100"><g><g transform="translate(3.506 3.506) scale(.72646)"><circle cx="64" cy="64" r="57.944" fill="none" stroke="#1ca" stroke-width="8" stroke-linejoin="round"/><circle cx="42.441" cy="48" r="9.559" fill="#1ca"/><circle r="9.559" cy="48" cx="85.559" fill="#1ca"/><path d="M92 76.051s-8 16-28 16-28-16-28-16" fill="none" stroke="#1ca" stroke-width="8" stroke-linecap="round"/></g><g transform="matrix(.71734 0 0 .72584 4.136 103.585)"><circle cx="64" cy="64" r="57.944" fill="none" stroke="#1ca" stroke-width="8" stroke-linejoin="round"/><g transform="translate(-94.848 24)" fill="#1ca"><circle r="9.559" cy="48" cx="140.068"/><circle cx="177.627" cy="48" r="9.559"/></g><path d="M30.818 54.555s4.121-2.089 12.39.127C51.475 56.897 54 60.767 54 60.767m20 0s2.524-3.87 10.793-6.085c8.268-2.216 12.39-.127 12.39-.127" fill="none" stroke="#1ca" stroke-width="8" stroke-linecap="round"/><path d="M100.222 15.641c6.644-.135 15.803-1.963 22.447-6.302 0 17.763-7.23 24.788-7.23 24.788zm-72.57 0c-6.644-.135-15.803-1.963-22.447-6.302 0 17.763 7.23 24.788 7.23 24.788z" fill="#1ca" stroke="#1ca" stroke-width="8"/><path d="M36 88c24 12 32 12 56 0-12 16-24 16-28 16s-16 0-28-16z" fill="#1ca"/></g><g transform="translate(3.506 203.506) scale(.72646)"><circle cx="64" cy="64" r="57.944" fill="none" stroke="#1ca" stroke-width="8" stroke-linejoin="round"/><circle cx="42.441" cy="48" r="9.559" fill="#1ca"/><circle r="9.559" cy="48" cx="85.559" fill="#1ca"/><path d="M92 76.051s-8 16-28 16-28-16-28-16" fill="none" stroke="#1ca" stroke-width="8" stroke-linecap="round"/></g><animateTransform attributeName="transform" attributeType="XML" type="translate" values="0,0;0,-200" dur="2s" repeatCount="indefinite"/></g></svg>');

	const svgText = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100mm" height="400mm" viewBox="0 0 100 400"><defs><clipPath clipPathUnits="userSpaceOnUse" id="a"><path class="powerclip" d="M-5-5h110v410H-5zm73.898 25.184l-5.976 2.406c2.018 2.95 4.346 7.373 5.899 10.478l6.053-2.562c-1.474-2.794-4.113-7.605-5.976-10.322zm8.926-3.415l-6.054 2.406c2.173 2.872 4.579 7.296 6.131 10.4l5.976-2.561c-1.32-2.639-4.113-7.45-6.053-10.245zm-41.522 6.597H25.203c.31 1.863.544 5.666.544 7.839v41.056c0 6.52 3.802 10.09 10.322 11.254 3.26.543 7.76.854 12.65.854 8.538 0 19.791-.466 26.854-1.553V71.873c-6.209 1.63-18.394 2.561-26.233 2.561-3.415 0-6.519-.077-8.692-.465-3.337-.621-4.89-1.475-4.89-4.735V55.342c9.78-2.484 21.81-6.209 29.57-9.158 2.484-.931 5.821-2.406 8.77-3.648l-4.036-9.546c-3.026 1.785-5.588 3.027-8.226 4.113-6.752 2.794-17.152 6.132-26.078 8.382v-14.28c0-2.096.233-5.588.544-7.839zm18.16 76.06L43.52 96.087c-.698 2.483-2.328 5.976-3.492 7.839-3.803 6.519-10.71 16.841-23.904 25.068l8.149 6.286c7.606-5.277 14.59-12.573 19.868-19.558H65.64c-1.165 4.657-4.424 11.176-8.227 16.687-4.812-3.182-9.624-6.287-13.582-8.537l-6.675 6.752c3.88 2.483 8.848 5.898 13.738 9.468-6.21 6.21-14.591 12.418-27.63 16.376l8.77 7.606c11.642-4.424 20.257-10.865 26.853-17.85 3.105 2.483 5.899 4.811 7.994 6.752l7.14-8.537c-2.172-1.786-5.122-3.959-8.381-6.287 5.355-7.528 9.158-15.677 11.176-21.731.698-1.863 1.707-3.958 2.483-5.433l-7.683-4.657c-1.63.466-4.191.777-6.52.777H49.806c.931-1.63 2.794-5.045 4.657-7.684zm-20.644 77.843l-3.57 9.08c10.633 1.398 32.053 6.21 40.746 9.391l3.958-9.468c-9.546-3.337-31.277-7.761-41.134-9.003zm-3.492 20.412l-3.493 9.235c11.254 1.786 30.579 6.132 39.194 9.469l3.725-9.546c-9.469-3.26-28.638-7.373-39.426-9.158zm-3.803 21.653l-3.88 9.546c12.184 1.863 35.933 7.373 46.022 11.564l4.27-9.856c-10.4-3.88-33.529-9.236-46.412-11.254zm4.035 37.797l-7.062 7.606c5.51 3.803 14.979 12.03 18.86 16.22l7.683-7.916c-4.424-4.579-14.203-12.34-19.48-15.91zm-9.468 50.214l6.364 9.934c10.71-1.785 20.334-5.976 28.018-10.555 12.107-7.295 22.119-17.695 27.862-27.94l-5.898-10.555c-4.812 10.09-14.591 21.576-27.475 29.182-7.295 4.424-16.997 8.227-28.871 9.934zM39.54 337.68v34.523h5.23q8.944 0 13.643-4.434 4.737-4.434 4.737-12.885 0-8.412-4.7-12.808-4.699-4.396-13.68-4.396zm-14.59-11.028v56.579h15.386q12.733 0 19.1-1.82 6.366-1.856 10.914-6.252 3.979-3.828 5.912-8.83 1.932-5.04 1.932-11.445 0-6.328-1.932-11.33-1.933-5.003-5.912-8.83-4.51-4.396-10.838-6.215-6.291-1.857-19.176-1.857z"/></clipPath></defs><path clip-path="url(#a)" d="M0 0h100v400H0z" fill="#1ca"/></svg>');

	const css = "data:text/css;charset=UTF-8," + encodeURIComponent(`#imagePanel{padding-top:100%}#image{object-fit:contain}.btn,.form-control,.modal-content,.modal-header,.progress{border-radius:0!important}.btn-dark:hover,.form-control,.form-control::placeholder,.form-control:focus,.modal-body,.modal-footer{color:#1ca!important}.btn-dark,.modal-header,.progress-bar,::selection{background-color:#1ca}#imagePanel,.btn-dark,.form-control,.form-control:focus,.modal-content,.modal-footer,.modal-header,.progress{border-color:#1ca!important}.form-control::placeholder{opacity:.5}div.mobile-page div.width-100{background-image:url("${svgText}"),url("${svgText}");background-position:left,right;background-size:contain,contain}`);

	const modal = document.createElement("div");
	modal.classList.add("modal", "fade");
	modal.tabIndex = -1;
	document.body.appendChild(modal);

	modal.addEventListener("hidden.bs.modal", event => {
		location.reload();
	});

	const dialog = document.createElement("div");
	dialog.classList.add("modal-dialog", "modal-dialog-centered");
	modal.appendChild(dialog);

	const content = document.createElement("div");
	content.classList.add("modal-content", "bg-dark", "border");
	dialog.appendChild(content);

	const header = document.createElement("div");
	header.classList.add("modal-header");
	content.appendChild(header);

	const title = document.createElement("h3");
	title.classList.add("modal-title");
	title.textContent = "Create Sticker";
	title.title = "Made by Vitamin D (a11cc)";
	header.appendChild(title);

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.classList.add("btn-close", "btn-lg");
	closeButton.dataset.bsDismiss = "modal";
	header.appendChild(closeButton);

	const body = document.createElement("div");
	body.classList.add("modal-body");
	content.appendChild(body);

	const container = document.createElement("div");
	container.classList.add("container-fluid", "px-0");
	body.appendChild(container);

	const row = document.createElement("div");
	row.classList.add("row");
	container.appendChild(row);

	const columnLeft = document.createElement("div");
	columnLeft.classList.add("col-8");
	row.appendChild(columnLeft);

	const input = document.createElement("div");
	input.classList.add("d-flex", "flex-row");
	columnLeft.appendChild(input);

	const fileButton = document.createElement("label");
	fileButton.classList.add("btn", "btn-dark", "btn-lg", "text-dark");
	fileButton.title = "Image file";
	fileButton.textContent = "Browse";
	input.appendChild(fileButton);
	
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.accept = "image/png,image/jpeg,image/gif";
	fileInput.hidden = true;
	fileButton.appendChild(fileInput);

	const progress = document.createElement("div");
	progress.classList.add("progress", "w-100", "h-auto", "ml-1", "bg-dark",
		"border", "invisible");
	input.appendChild(progress);

	const progressBar = document.createElement("div");
	progressBar.classList.add("progress-bar", "text-dark", "h5", "mb-0");
	progressBar.role = "progressbar";
	progress.appendChild(progressBar);

	const infoList = document.createElement("ul");
	infoList.classList.add("list-unstyled", "h5", "mt-3");
	columnLeft.appendChild(infoList);

	const infoFormat = document.createElement("li");
	infoFormat.textContent = "PNG, JPEG, GIF";
	infoList.appendChild(infoFormat);

	const infoSize = document.createElement("li");
	infoSize.classList.add("mt-1");
	infoSize.textContent = "5MB maximum file size";
	infoList.appendChild(infoSize);
	const infoDimensions = document.createElement("li");
	infoDimensions.classList.add("mt-1");
	infoDimensions.textContent = "999px maximum width/height";
	infoList.appendChild(infoDimensions);

	const columnRight = document.createElement("div");
	columnRight.classList.add("col-4");
	row.appendChild(columnRight);
	
	const imagePanel = document.createElement("div");
	imagePanel.classList.add("position-relative", "h-0", "border");
	imagePanel.id = "imagePanel";
	columnRight.appendChild(imagePanel);
	
	const image = document.createElement("img");
	image.classList.add("position-absolute", "top-0", "left-0", "w-100",
		"h-100");
	image.id = "image";
	image.src = svgFace;
	imagePanel.appendChild(image);

	const footer = document.createElement("div");
	footer.classList.add("modal-footer");
	content.appendChild(footer);

	const group = document.createElement("div");
	group.classList.add("input-group", "input-group-lg");
	group.title = "Paste in chat";
	footer.appendChild(group);

	const copy = document.createElement("button");
	copy.classList.add("btn", "btn-dark", "text-dark");
	copy.type = "button";
	copy.textContent = "Copy";
	group.appendChild(copy);

	const output = document.createElement("input");
	output.classList.add("form-control", "bg-dark");
	output.type = "text";
	output.placeholder = "Output";
	output.readOnly = true;
	group.appendChild(output);

	copy.addEventListener("click", event => {
		output.select();
		document.execCommand("copy");
	});
	
	const outputCallback = url => {
		if(url) {
			image.src = url;
			output.value = `:emote/mine/dlive/${url.match(/(\w+)$/)[0]}:`;
		} else output.value = "Error, check browser console";

		fileInput.disabled = false;
		progress.classList.add("invisible");
		progressBar.textContent = "";
		progressBar.style.width = 0;
	}
	
	const progressCallback = progress =>
		progressBar.textContent = progressBar.style.width = `${progress}%`;

	fileInput.addEventListener("change", event => {
		if(!event.target.files.length) return;

		fileInput.disabled = true;
		image.src = svgFace;
		output.value = "";
		progress.classList.remove("invisible");

		uploadFile(event.target.files[0], outputCallback, progressCallback);
	}, false);

	const bscss = document.createElement("link");
	bscss.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css";
	bscss.rel = "stylesheet";
	bscss.crossOrigin = "anonymous";
	document.head.appendChild(bscss);

	const bsjs = document.createElement("script");
	bsjs.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js";
	bsjs.crossOrigin = "anonymous";
	document.head.appendChild(bsjs);

	bsjs.addEventListener("load", event =>
		(new bootstrap.Modal(modal)).show());

	const cssLink = document.createElement("link");
	cssLink.rel = "stylesheet";
	cssLink.href = css;
	document.head.appendChild(cssLink);

	const streamArea =
		document.querySelector("div.mobile-page > div.width-100");

	if(streamArea) streamArea.parentNode.replaceChild(
		streamArea.cloneNode(false), streamArea);
}

function initialise() {
	if(typeof globalThis.loaded === "undefined")
		globalThis.loaded = true;
	else return;
	
	if(document.querySelector("div.sign-register-buttons"))
		return;

	console.log(0xa11cc);
	createPage();
}

initialise();
