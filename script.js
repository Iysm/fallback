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
	"https://iysm.github.io/fallback-cdn1/2019-09-29_03-46-23.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-10-01_01-33-05.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-10-22_16-36-49.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-11-04_01-29-35.webm", 
	"https://iysm.github.io/fallback-cdn1/2019-11-07_16-03-15.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-05-14_03-54-04.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-09-21_23-38-15.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-10-06_21-16-26.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-11-28_19-48-02.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-12-03_06-41-08.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-12-03_11-06-56.webm", 
	"https://iysm.github.io/fallback-cdn1/2020-12-16_21-26-06.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-01-03_16-56-21.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-02-06_17-12-09.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-02-16_19-14-26.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-03-04_16-11-32.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-03-22_18-18-17.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-03-29_19-28-28.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-04-08_21-10-49.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-04-13_00-11-03.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-04-20_13-37-06.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-04-26_15-19-59.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-05-17_19-56-04.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-05-19_01-13-37.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-06-08_23-04-48.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-06-25_23-16-52.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07-02_16-22-05.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07-05_16-32-56.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07-13_22-07-37.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07-13_22-54-21.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07-16_20-32-34.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07-18_18-21-14.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-07-27_12-59-50.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08-06_21-02-52.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08-08_21-32-52.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08-09_23-04-08.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08-10_03-41-59.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08-11_00-26-32.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-08-30_00-46-22.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09-04_23-06-30.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09-05_21-13-46.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09-08_16-55-09.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09-13_18-02-25.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09-13_18-18-35.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-09-27_15-21-12.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10-02_11-36-12.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10-02_12-30-17.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10-04_17-03-25.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10-22_14-33-37.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10-24_21-57-32.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-10-31_23-32-57.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-11-08_17-17-27.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-11-15_23-07-05.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-11-30_11-37-15.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-11-30_16-58-22.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-12-25_17-25-59.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-12-28_15-12-46.webm", 
	"https://iysm.github.io/fallback-cdn1/2021-12-29_21-05-24.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01-07_16-43-45.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01-16_17-54-26.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01-16_21-52-33.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01-26_00-44-24.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01-28_04-17-50.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-01-30_04-23-00.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-02-08_14-21-20.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-02-10_11-34-59.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-02-20_23-11-54.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-03-11_23-00-45.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-03-15_19-02-37.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-03-19_20-17-50.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-04-02_01-02-27.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-04-18_07-57-53.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-04-19_13-04-46.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-05-11_02-42-17.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-01_02-16-50.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-06_11-53-22.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-10_21-54-26.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-18_22-50-52.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-20_05-01-24.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-20_20-17-21.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-20_20-38-51.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-21_01-23-28.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-21_03-12-39.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-22_07-18-12.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-06-25_15-23-55.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-06_21-48-51.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-08_03-01-50.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-08_03-09-59.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-09_14-22-20.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-09_14-53-38.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-09_15-49-35.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-09_18-02-11.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-12_02-25-39.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-12_20-43-36.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-12_21-42-27.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-12_23-24-10.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-13_01-42-40.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-18_16-09-07.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-24_23-08-40.webm", 
	"https://iysm.github.io/fallback-cdn2/2022-07-25_00-27-02.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-03_13-42-00.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-03_13-48-51.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-06_19-05-39.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-06_20-03-10.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-07_20-07-52.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-08_17-43-55.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-08_19-16-08.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-08_19-16-43.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-11_15-55-33.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-17_20-41-19.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-08-22_22-32-43.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-08_23-04-49.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-09_11-51-09.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-11_18-53-30.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-11_20-20-23.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-11_23-08-42.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-12_01-50-14.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-12_17-30-37.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-12_17-35-19.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-12_19-27-30.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-09-13_21-45-03.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-10-02_17-10-24.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-10-13_13-21-10.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-10-19_10-45-17.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-10-24_23-41-59.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-16_15-07-31.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-16_22-18-37.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-16_22-24-09.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-19_21-39-40.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-19_22-51-04.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-19_23-07-32.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-20_01-25-29.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-20_16-23-38.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-21_14-49-40.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-22_22-46-25.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-23_00-16-27.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-11-23_00-33-54.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-12-08_19-44-10.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-12-15_22-59-18.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-12-21_00-03-59.webm", 
	"https://iysm.github.io/fallback-cdn3/2022-12-29_21-05-07.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-01-02_17-20-18.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-01-03_00-18-24.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-01-14_07-23-47.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-02-05_04-25-12.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03-02_23-33-07.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03-14_22-13-37.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03-18_17-20-04.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03-23_02-18-01.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03-23_03-16-30.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03-28_23-17-52.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03-29_00-12-57.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-03-30_23-07-50.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-04-01_04-59-47.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-04-18_22-15-27.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-06-11_12-05-25.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-06-30_21-47-30.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07-17_03-02-13.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07-21_21-22-50.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07-24_21-56-53.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07-31_01-13-38.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07-31_01-21-36.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-07-31_03-11-08.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-08-13_21-13-03.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-08-25_19-13-47.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-08-27_18-50-47.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09-05_14-07-45.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09-07_15-39-31.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09-09_05-00-09.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09-10_00-58-52.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09-12_21-15-09.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-09-25_19-42-20.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10-03_23-39-17.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10-04_23-12-33.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10-12_00-51-16.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10-17_02-20-31.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-10-23_22-34-12.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11-04_19-49-16.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11-04_23-29-18.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11-09_22-52-07.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11-22_19-50-46.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11-23_11-06-40.webm", 
	"https://iysm.github.io/fallback-cdn4/2023-11-27_00-07-37.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02-01_01-29-05.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02-04_19-46-19.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02-04_20-24-09.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02-12_18-00-39.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02-13_19-36-17.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-02-28_16-23-52.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-04-11_19-32-22.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-05-13_22-41-10.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-06-22_21-26-30.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-06-22_21-34-44.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-07-15_17-03-52.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-07-17_23-09-41.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-08-03_06-26-09.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-08-08_15-20-42.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-08-12_16-16-02.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-09-02_10-03-07.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-09-27_17-40-42.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-10-07_18-07-02.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-10-15_13-00-53.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-11-02_03-04-15.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-11-13_21-43-00.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-11-23_17-53-07.webm", 
	"https://iysm.github.io/fallback-cdn5/2024-12-25_04-28-24.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-01-06_14-02-47.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-02-04_00-28-34.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-02-04_00-57-38.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-03-11_23-15-38.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-03-13_04-54-31.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-03-13_05-11-33.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-03-18_20-28-26.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-04-26_05-16-01.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-04-26_21-50-26.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-04-29_23-59-32.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-05-15_22-37-56.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-05-22_13-19-50.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-06-05_21-56-06.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-06-06_18-07-08.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-06-07_22-08-28.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-07-07_19-57-19.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-08-21_00-52-50.webm", 
	"https://iysm.github.io/fallback-cdn5/2025-09-01_22-58-29.webm", 
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
		if (fullscreen) {
			const match = nextSrc.match(/(\d{4}-\d{2}-\d{2})/);
			document.getElementById("clip-date").textContent = match ? match[1] : "";
		}
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

