const dvd = document.getElementById("dvd");
const container = document.getElementById("container");

let dx, dy;
let speed = 200;
let x, y;
let fullscreen = false;
let paused = false;

function degToRad(deg) {
	return deg * (Math.PI / 180);
}

function radToDeg(rad) {
	return rad * (180 / Math.PI);
}

function getRandomAllowedAngle() {
	const ranges = [
		[20, 40],
		[140, 160],
		[200, 220],
		[320, 340]
	];

	const [min, max] = ranges[Math.floor(Math.random() * ranges.length)];
	const angleDeg = min + Math.random() * (max - min);
	return degToRad(angleDeg);
}

function clampAngle(angleRad) {
	let angle = angleRad % (2 * Math.PI);
	if (angle < 0) angle += 2 * Math.PI;

	const margin = degToRad(15);

	function inRange(center) {
		return (angle > center - margin) && (angle < center + margin);
	}

	const forbiddenCenters = [
		0,
		Math.PI / 2,
		Math.PI,
		(3 * Math.PI) / 2
	];

	for (const center of forbiddenCenters) {
		if (inRange(center)) {
			if (angle < center) {
				angle = center - margin;
			} else {
				angle = center + margin;
			}
			break;
		}
	}

	return angle;
}

function initializeDirection() {
	const angle = getRandomAllowedAngle();
	dx = Math.cos(angle);
	dy = Math.sin(angle);
}

function varyDirection() {
	const variation = (Math.random() - 0.5) * 0.3;
	let angle = Math.atan2(dy, dx) + variation;

	angle = clampAngle(angle);

	dx = Math.cos(angle);
	dy = Math.sin(angle);
}

let lastTime = null;

const videoElement = document.getElementById("dvd-video");

const videoFiles = [
	"https://iysm.github.io/fallback-cdn1/2017-11-24_21-53-51.webm", 
	"https://iysm.github.io/fallback-cdn1/2018-04-15_17-12-01.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-09-13_01-06-43.webm", 
];

function shuffle(array) {
	let currentIndex = array.length, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

let playlist = [];
let currentIndex = 0;

function loadPlaylist() {
	playlist = shuffle([...videoFiles]);
	currentIndex = 0;
}

let isLoadingNext = false;

function playNextVideo() {
	if (isLoadingNext) return;
	isLoadingNext = true;
	
	if (currentIndex >= playlist.length) {
		loadPlaylist();
	}
	
	const nextSrc = playlist[currentIndex];
	currentIndex++;
	
	const tempVideo = document.createElement('video');
	tempVideo.src = nextSrc;
	tempVideo.preload = 'auto';
	tempVideo.muted = videoElement.muted;
	tempVideo.volume = videoElement.volume;
	
	const switchVideo = () => {
		videoElement.src = nextSrc;
		videoElement.load();
		videoElement.play().then(() => {
			isLoadingNext = false;
		}).catch((error) => {
			console.error('Error playing video:', error);
			isLoadingNext = false;
		});
	};
	
	tempVideo.addEventListener('canplaythrough', switchVideo);
	tempVideo.addEventListener('error', () => {
		console.error('Error loading video:', nextSrc);
		isLoadingNext = false;
		if (currentIndex < playlist.length) {
			playNextVideo();
		} else {
			loadPlaylist();
			playNextVideo();
		}
	});
}

videoElement.addEventListener("ended", playNextVideo);

function updatePosition(timestamp) {
	if (!lastTime) lastTime = timestamp;
	const delta = (timestamp - lastTime) / 1000;
	lastTime = timestamp;

	if (!paused) {
		const rect = dvd.getBoundingClientRect();
		const contRect = container.getBoundingClientRect();

		x += dx * speed * delta;
		y += dy * speed * delta;

		let bouncedVerticalWall = false;
		let bouncedHorizontalWall = false;

		if (x + rect.width >= contRect.width) {
			x = contRect.width - rect.width;
			dx *= -1;
			bouncedVerticalWall = true;
		} else if (x <= 0) {
			x = 0;
			dx *= -1;
			bouncedVerticalWall = true;
		}

		if (y + rect.height >= contRect.height) {
			y = contRect.height - rect.height;
			dy *= -1;
			bouncedHorizontalWall = true;
		} else if (y <= 0) {
			y = 0;
			dy *= -1;
			bouncedHorizontalWall = true;
		}

		if (bouncedVerticalWall) {
			varyDirection();
		}

		dvd.style.left = `${x}px`;
		dvd.style.top = `${y}px`;
	}

	requestAnimationFrame(updatePosition);
}

window.addEventListener("load", () => {
	const rect = dvd.getBoundingClientRect();
	const contRect = container.getBoundingClientRect();

	x = (contRect.width - rect.width) / 2;
	y = (contRect.height - rect.height) / 2;

	initializeDirection();

	dvd.style.left = `${x}px`;
	dvd.style.top = `${y}px`;

	loadPlaylist();
	
	videoElement.src = playlist[currentIndex];
	videoElement.play();
	currentIndex++;

	requestAnimationFrame(updatePosition);
});

function handleVideoClick() {
	fullscreen = !fullscreen;
	paused = fullscreen;

	if (fullscreen) {
		document.body.classList.add("fullscreen");
		dvd.style.left = "0px";
		dvd.style.top = "0px";

		const src = videoElement.currentSrc || videoElement.src;
		const match = src.match(/(\d{4}-\d{2}-\d{2})/);
		if (match) {
			document.getElementById("clip-date").textContent = match[1];
		}

		videoElement.play();
	} else {
		document.body.classList.remove("fullscreen");
		document.getElementById("clip-date").textContent = "";
		videoElement.play();
	}
}

const video = document.getElementById("dvd-video");
video.addEventListener("click", handleVideoClick);
