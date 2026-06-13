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

function flashPurpleBackground() {
	const originalBackground = document.body.style.backgroundColor;
	
	document.body.style.backgroundColor = 'purple';
	
	setTimeout(() => {
		document.body.style.backgroundColor = originalBackground;
		
		setTimeout(() => {
			document.body.style.backgroundColor = 'purple';
			
			setTimeout(() => {
				document.body.style.backgroundColor = originalBackground;
			}, 100);
		}, 100);
	}, 100);
}

let lastTime = null;

const videoElement = document.getElementById("dvd-video");

const videoFiles = [
	"https://iysm.github.io/fallback-cdn1/2017-11.webm", 
	"https://iysm.github.io/fallback-cdn1/2018-04.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-09.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-09_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-10.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-10_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-11.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-11_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-05.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-09.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-10.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-11.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-12.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-12_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-12_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-01.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-02.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-02_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-03.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-03_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-03_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-04.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-04_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-04_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-04_4.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-05.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-05_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-06.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-06_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07_4.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07_5.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07_6.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07_7.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07_8.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08_4.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08_5.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09_4.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09_5.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09_6.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10_4.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10_5.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-11.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-11_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-11_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-11_4.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-12.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-12_2.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-12_3.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-12_4.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01_2.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01_3.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01_4.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01_5.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01_6.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01_7.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01_8.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01_9.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-02.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-02_2.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-02_3.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-02_4.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-03.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-03_2.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-03_3.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-03_4.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-04.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-04_2.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-04_3.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-05.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_10.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_11.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_2.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_3.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_4.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_5.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_6.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_7.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_8.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06_9.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_10.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_11.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_12.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_13.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_14.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_15.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_2.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_3.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_4.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_5.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_6.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_7.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_8.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07_9.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_10.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_11.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_2.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_3.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_4.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_5.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_6.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_7.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_8.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08_9.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_10.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_2.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_3.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_4.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_5.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_6.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_7.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_8.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09_9.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-10.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-10_2.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-10_3.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-10_4.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_10.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_11.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_12.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_2.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_3.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_4.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_5.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_6.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_7.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_8.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11_9.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-12.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-12_2.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-12_3.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-12_4.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-01.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-01_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-01_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-01_4.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-02.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-02_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-02_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-02_4.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03_4.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03_5.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03_6.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03_7.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03_8.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-04.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-04_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-06.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-06_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-06_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07_4.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07_5.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07_6.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07_7.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-08.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-08_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-08_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09_4.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09_5.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09_6.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09_7.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09_8.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09_9.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10_4.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10_5.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10_6.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10_7.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11_2.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11_3.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11_4.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11_5.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11_6.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11_7.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-12.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02_3.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02_4.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02_5.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02_6.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-04.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-04_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-05.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-06.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-06_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-07.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-07_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-08.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-08_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-08_3.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-09.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-09_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-10.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-10_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-11.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-11_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-12.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-01.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-02.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-02_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-03.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-03_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-03_3.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-03_4.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-04.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-04_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-05.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-05_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-05_3.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-06.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-06_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-06_3.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-07.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-07_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-07_3.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-08.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-09.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-09_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-09_3.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-10.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-10_2.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-10_3.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-10_4.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-10_5.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-11.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-12.webm",
	"https://iysm.github.io/fallback-cdn6/2026-01.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-03.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-03_2.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-03_3.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-03_4.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-03_5.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-04.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-04_2.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-04_3.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-05.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-05_2.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-05_3.webm", 
	"https://iysm.github.io/fallback-cdn6/2026-05_4.webm"
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

let preloadedVideo = null;
let preloadedSrc = null;
let isPreloading = false;

function getNextSrc() {
	if (currentIndex >= playlist.length) {
		loadPlaylist();
	}
	const src = playlist[currentIndex];
	currentIndex++;
	return src;
}

function preloadNextVideo() {
	if (isPreloading || preloadedVideo) return;
	isPreloading = true;

	const nextSrc = getNextSrc();

	const tempVideo = document.createElement('video');
	tempVideo.src = nextSrc;
	tempVideo.preload = 'auto';
	tempVideo.muted = videoElement.muted;
	tempVideo.volume = videoElement.volume;

	const onReady = () => {
		preloadedVideo = tempVideo;
		preloadedSrc = nextSrc;
		isPreloading = false;
	};

	tempVideo.addEventListener('canplaythrough', onReady, { once: true });
	tempVideo.addEventListener('error', () => {
		console.error('Error preloading video:', nextSrc);
		isPreloading = false;
		preloadNextVideo();
	}, { once: true });
}

function playNextVideo() {
	let nextSrc;

	if (preloadedVideo) {
		nextSrc = preloadedSrc;
		preloadedVideo = null;
		preloadedSrc = null;
	} else {
		nextSrc = getNextSrc();
	}

	videoElement.src = nextSrc;
	if (fullscreen) {
		const match = nextSrc.match(/(\d{4}-\d{2})/);
		document.getElementById("clip-date").textContent = match ? match[1] : "";
	}
	videoElement.load();
	videoElement.play().catch((error) => {
		console.error('Error playing video:', error);
	});

	preloadNextVideo();
}

videoElement.addEventListener("ended", playNextVideo);
videoElement.addEventListener("loadstart", preloadNextVideo);

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

		
		if (bouncedVerticalWall && bouncedHorizontalWall) {
			flashPurpleBackground();
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

	preloadNextVideo();

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
		const match = src.match(/(\d{4}-\d{2})/);
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
