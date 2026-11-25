import * as THREE from 'three';
import { FLIP_SPIN } from './Parameters.js';
import { scratch } from './Physics.js';

export function bindCardPointer({
  canvas,
  camera,
  cardGroup,
  bodyMesh,
  frontMesh,
  backMesh,
  sim,
  settingsRef,
  start,
}) {
  let press = null;
  let hovering = false;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const toPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
  };

  const pickCard = () => {
    cardGroup.updateMatrixWorld();
    const hits = raycaster.intersectObjects(
      [bodyMesh, frontMesh, backMesh],
      false,
    );
    return hits[0] || null;
  };

  const setCursor = (value) => {
    if (canvas.style.cursor !== value) canvas.style.cursor = value;
  };

  const flip = (point) => {
    const body = sim.body;
    const up = scratch.a.set(0, 1, 0).applyQuaternion(body.quaternion);
    let direction = sim.turn > 0 ? -1 : 1;
    if (sim.turn === 0) {
      const away = scratch.c.subVectors(point, camera.position).normalize();
      direction =
        scratch.b.subVectors(point, body.position).cross(away).dot(up) < 0
          ? -1
          : 1;
    }
    sim.turn = sim.turn === 0 ? Math.PI * direction : 0;
    body.angular.addScaledVector(up, FLIP_SPIN * direction);
  };

  const onPointerDown = (event) => {
    if (!settingsRef.current.interactive || event.button > 0) return;
    toPointer(event);
    const hit = pickCard();
    if (!hit) return;
    sim.grab = {
      local: hit.point
        .clone()
        .sub(sim.body.position)
        .applyQuaternion(sim.body.quaternion.clone().invert()),
      rotation: sim.body.quaternion.clone(),
      reach: hit.distance,
      from: hit.point.clone(),
      target: hit.point.clone(),
    };
    press = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      point: hit.point.clone(),
    };
    canvas.setPointerCapture?.(event.pointerId);
    setCursor('grabbing');
    event.preventDefault();
    start();
  };

  const onPointerMove = (event) => {
    if (!settingsRef.current.interactive) return;
    toPointer(event);
    if (sim.grab) {
      if (
        press &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6
      )
        press = null;
      raycaster.ray.at(sim.grab.reach, sim.grab.target);
      start();
      return;
    }
    if (event.pointerType === 'touch') return;
    hovering = !!pickCard();
    setCursor(hovering ? 'grab' : '');
  };

  const onPointerUp = (event) => {
    if (!sim.grab) return;
    sim.grab = null;
    if (
      press &&
      event.type === 'pointerup' &&
      performance.now() - press.time < 450
    )
      flip(press.point);
    press = null;
    canvas.releasePointerCapture?.(event.pointerId);
    setCursor(hovering && event.pointerType !== 'touch' ? 'grab' : '');
    start();
  };

  const onTouchStart = (event) => {
    if (!settingsRef.current.interactive || event.touches.length !== 1) return;
    toPointer(event.touches[0]);
    if (pickCard()) event.preventDefault();
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('lostpointercapture', onPointerUp);
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });

  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('lostpointercapture', onPointerUp);
    canvas.removeEventListener('touchstart', onTouchStart);
  };
}
