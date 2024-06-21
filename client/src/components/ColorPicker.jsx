import React from "react";
import { SketchPicker } from "react-color";
import { useSnapshot } from "valtio";
import { close } from "../assets";
import state from "../store";

const ColorPicker = () => {
  const snap = useSnapshot(state);

  const handleClose = () => {
    state.showColorPicker = false;
  };

  const handleColorChange = (color) => {
    state.color = color.hex;
    handleClose();
  };

  if (!snap.showColorPicker) {
    return null;
  }

  return (
    <div className="absolute left-full ml-3 flex flex-row justify-start items-start p-2 rounded shadow-lg bg-white">
      <SketchPicker
        color={snap.color}
        disableAlpha
        onChange={handleColorChange}
      />
      <img
        src={close}
        alt="closebtn"
        className="w-8 cursor-pointer ml-2"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
      />
    </div>
  );
};

export default ColorPicker;
