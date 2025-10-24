import * as THREE from 'three';
import { gsap } from 'gsap';
import './styles.css';
import './ui/overlay.css';
import { SceneManager } from './core/SceneManager.js';
import { SolarSystem } from './world/SolarSystem.js';
import { Overlay } from './ui/overlay.js';
import { Input } from './core/Input.js';

const canvas = document.getElementById('webgl');
const sceneManager = new SceneManager(canvas);

const solarSystem = new SolarSystem();
sceneManager.scene.add(solarSystem);
sceneManager.loop.add(solarSystem);

const input = new Input({ camera: sceneManager.camera, domElement: canvas });

const overlayRoot = document.getElementById('overlay-root');
const overlay = new Overlay(overlayRoot);
overlay.hide();

sceneManager.controls.maxPolarAngle = Math.PI * 0.55;
sceneManager.controls.minPolarAngle = Math.PI * 0.3;
sceneManager.controls.update();

const sunTarget = new THREE.Vector3(0, 0, 0);
const sunCameraPosition = new THREE.Vector3(0, 12, 30);

sceneManager.camera.position.set(0, 36, 60);
sceneManager.controls.update();

const focusResetButton = document.createElement('button');
focusResetButton.type = 'button';
focusResetButton.className = 'focus-reset';
focusResetButton.setAttribute('aria-label', 'Revenir à la vue générale');
focusResetButton.textContent = '×';
document.body.appendChild(focusResetButton);

const state = {
  focusedBody: null
};

const tempTarget = new THREE.Vector3();
const tempPosition = new THREE.Vector3();
const offset = new THREE.Vector3();
const direction = new THREE.Vector3();
const screenNormal = new THREE.Vector3();
const tempQuaternion = new THREE.Quaternion();
const SCREEN_FIT_RATIO = 0.9;

const computeScreenFocusDistance = screen => {
  const size = screen.userData?.size;
  const width = size?.width ?? 1;
  const height = size?.height ?? Math.max(width * 0.6, 0.4);

  const verticalFov = THREE.MathUtils.degToRad(sceneManager.camera.fov);
  const aspect = sceneManager.camera.aspect || 1;
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);

  const heightDistance = (height / (2 * SCREEN_FIT_RATIO)) / Math.tan(verticalFov / 2);
  const widthDistance = (width / (2 * SCREEN_FIT_RATIO)) / Math.tan(horizontalFov / 2);

  return Math.max(heightDistance, widthDistance) + 0.4;
};

const updateControls = () => {
  sceneManager.controls.update();
};

const animateCamera = (targetPosition, cameraPosition, options = {}) => {
  const duration = options.duration ?? 1.4;
  gsap.killTweensOf(sceneManager.controls.target);
  gsap.killTweensOf(sceneManager.camera.position);

  gsap.to(sceneManager.controls.target, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration,
    ease: options.targetEase ?? 'power2.out',
    onUpdate: updateControls
  });

  gsap.to(sceneManager.camera.position, {
    x: cameraPosition.x,
    y: cameraPosition.y,
    z: cameraPosition.z,
    duration,
    ease: options.cameraEase ?? 'power3.inOut',
    onUpdate: updateControls
  });
};

const focusOnBody = body => {
  if (!body || state.focusedBody === body) {
    return;
  }

  const isPlanet = body.userData?.isPlanet;
  const screen = isPlanet ? body.screenPivot?.userData?.screen : null;

  let minDistance = sceneManager.controls.minDistance;
  let maxDistance = sceneManager.controls.maxDistance;
  let animationOptions = { duration: 1.6 };
  const isScreenFocus = Boolean(screen);

  if (screen) {
    screen.getWorldPosition(tempTarget);
    screen.getWorldQuaternion(tempQuaternion);

    screenNormal.set(0, 0, 1).applyQuaternion(tempQuaternion).normalize();

    const distance = Math.max(computeScreenFocusDistance(screen), 0.6);
    tempPosition.copy(screenNormal).multiplyScalar(distance).add(tempTarget);

    minDistance = distance * 0.75;
    maxDistance = distance * 1.15;
    animationOptions = { duration: 1.2, targetEase: 'power2.out', cameraEase: 'power2.out' };
  } else {
    body.getWorldPosition(tempTarget);

    offset.copy(sceneManager.camera.position).sub(sceneManager.controls.target);
    if (offset.lengthSq() === 0) {
      offset.set(0, 8, 24);
    }

    direction.copy(offset).normalize();
    const radius = body.userData?.radius ?? 1;
    const focusDistance = Math.max(radius * 6, 8);

    tempPosition.copy(direction).multiplyScalar(focusDistance).add(tempTarget);

    minDistance = Math.max(radius * 1.8, 3);
    maxDistance = Math.max(focusDistance * 1.8, minDistance + 2);
  }

  sceneManager.controls.minDistance = Math.max(minDistance, 0.5);
  sceneManager.controls.maxDistance = Math.max(maxDistance, sceneManager.controls.minDistance + 0.5);
  sceneManager.controls.enableRotate = !isScreenFocus;
  sceneManager.controls.enableZoom = !isScreenFocus;

  animateCamera(tempTarget, tempPosition, animationOptions);

  state.focusedBody = body;
  focusResetButton.classList.add('is-visible');
  solarSystem.pause();
};

const resetCameraFocus = () => {
  if (!state.focusedBody) {
    return;
  }

  animateCamera(sunTarget, sunCameraPosition, { duration: 1.4 });

  sceneManager.controls.minDistance = 5;
  sceneManager.controls.maxDistance = 80;
  sceneManager.controls.enableRotate = true;
  sceneManager.controls.enableZoom = true;

  state.focusedBody = null;
  focusResetButton.classList.remove('is-visible');
  solarSystem.resume();
};

const findSelectableFromObject = object => {
  let current = object;
  while (current) {
    if (current.userData?.isPlanet || current.userData?.isSun) {
      return current;
    }
    current = current.parent;
  }
  return null;
};

const handleSelection = event => {
  input.updatePointer(event);
  const intersects = input.cast(solarSystem.selectables);
  if (!intersects.length) {
    return;
  }

  const target = findSelectableFromObject(intersects[0].object);
  if (!target) {
    return;
  }

  focusOnBody(target);
};

focusResetButton.addEventListener('click', resetCameraFocus);
canvas.addEventListener('click', handleSelection);

animateCamera(sunTarget, sunCameraPosition, {
  duration: 3,
  targetEase: 'power2.out',
  cameraEase: 'power2.out'
});

sceneManager.start();
