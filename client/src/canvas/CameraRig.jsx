import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame(({ camera, pointer }, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // Determine the target position based on screen size and intro state
    const targetPosition = snap.intro
      ? isMobile
        ? [0, 0.2, 2.5]
        : isBreakpoint
        ? [0, 0, 2]
        : [-0.4, 0, 2]
      : isMobile
      ? [0, 0, 2.5]
      : [0, 0, 2];

    // Smoothly update the camera position
    easing.damp3(camera.position, targetPosition, 0.25, delta);

    // Smoothly update the group rotation based on pointer position
    easing.dampE(
      group.current.rotation,
      [pointer.y / 10, -pointer.x / 5, 0],
      0.25,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
