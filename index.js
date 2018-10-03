import React, { Component } from "react";
import { View, ART, Text } from "react-native";
import parser from "svg-path-parser";

const iconSet = new Set();

export default class MoonIcon extends Component {
  render() {
    const { width, height, size, type } = this.props;

    return (
      <Surface
        width={width || size}
        height={height || size}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Shape d={this.getPath(type)} fill="#444" />
      </Surface>
    );
  }
  getPath(type) {
    return iconSet[type];
  }
}

const structure = function(d, scale) {
  const descrip = parser(d);

  const path = new Path();

  let nextX1 = 0;
  let nextY1 = 0;

  descrip.forEach(command => {
    if (command.code === "M") {
      path.moveTo(command.x / scale, command.y / scale);
    } else if (command.code === "h") {
      path.line(command.x / scale, 0);
    } else if (command.code === "v") {
      path.line(0, command.y / scale);
    } else if (command.code === "Z") {
      path.close();
    } else if (command.code === "c") {
      const { x1, y1, x2, y2, x, y } = command;
      path.curve(
        x1 / scale,
        y1 / scale,
        x2 / scale,
        y2 / scale,
        x / scale,
        y / scale
      );

      nextX1 = x - x2;
      nextY1 = y - y2;
    } else if (command.code === "s") {
      const { x2, y2, x, y } = command;
      path.curve(
        nextX1 / scale,
        nextY1 / scale,
        x2 / scale,
        y2 / scale,
        x / scale,
        y / scale
      );

      nextX1 = x - x2;
      nextY1 = y - y2;
    } else if (command.code === "l") {
      path.line(command.x / scale, command.y / scale);
    } else {
      console.log("unknown", command);
    }
  });

  return path;
};

export const registerIconSet = function(selectionJson) {
  selectionJson.icons.forEach(function(icon) {
    const d = icon.paths.join("");

    const path = structure(d);

    iconSet.add(icon.name, path);
  });
};
