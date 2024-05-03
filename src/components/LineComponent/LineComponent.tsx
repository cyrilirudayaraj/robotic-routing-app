import React, { useLayoutEffect, useState, useSyncExternalStore } from "react";
import { constructElement } from "../../../src/utilities/constructElement";
import { getSelectedElement } from "../../../src/utilities/findMousePosition";
import { cursor } from "../../../src/utilities/getPreferedCursor";
import { resizeElement } from "../../../src/utilities/resizeElement";
import {
  distanceOfaLine,
  calculateAngle,
} from "../../../src/utilities/findSpecificationOfElement";
import { getLayoutCoordinates } from "../../../src/utilities/getLayoutCoordinates";
import { BannerComponent } from "../BannerComponent/BannerComponent";
import { canvasLineElementStore } from "../../store/canvasLineElementStore";
import { ElementType } from "../../intefaces/ElementType";

type HistoryState<T> = {
  index: number;
  history: T[];
};

const useHistory = <T extends any[]>(
  initialState: T
): [T, (action: T | ((prevState: T) => T), overwrite?: boolean) => void] => {
  const [state, setState] = useState<HistoryState<T>>({
    index: 0,
    history: [initialState],
  });

  const setHistoryState = (
    action: T | ((prevState: T) => T),
    overwrite = false
  ) => {
    const newState =
      typeof action === "function"
        ? (action as (prevState: T) => T)(state.history[state.index])
        : action;
    if (overwrite) {
      const historyCopy = [...state.history];
      historyCopy[state.index] = newState;
      setState({ ...state, history: historyCopy });
    } else {
      const updatedState = state.history.slice(0, state.index + 1);
      setState({
        history: [...updatedState, newState],
        index: state.index + 1,
      });
    }
  };

  return [state.history[state.index], setHistoryState];
};

const compareAndGetSelectedElement = (
  x: ElementType,
  y: ElementType
): boolean => {
  return x.x1 === y.x1 && x.y1 === y.y1 && x.x2 === y.x2 && x.y2 === y.y2;
};

const drawElement = (
  context: CanvasRenderingContext2D,
  element: ElementType,
  selected?: ElementType | undefined
): void => {
  switch (element.type) {
    case "line":
      context.beginPath();
      context.moveTo(element.x1, element.y1);
      context.lineTo(element.x2, element.y2);
      context.strokeStyle =
        selected && compareAndGetSelectedElement(selected, element)
          ? "red"
          : "black";
      context.stroke();
      break;
    default:
      throw new Error(`Type is not defined: ${element.type}`);
  }
};

const LineComponent: React.FC = () => {
  const [elements, setElements] = useHistory<ElementType[]>([]);
  const [mouseAction, setMouseAction] = useState<string>("none");
  const [tool, setTool] = useState<string>("line");
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(
    null
  );
  useSyncExternalStore(
    canvasLineElementStore.subscribe,
    canvasLineElementStore.getSnapshot
  );

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    console.log("canvasLineElementStore", canvasLineElementStore);
    canvasLineElementStore.elements.forEach((element: ElementType) => {
      drawElement(context, element, canvasLineElementStore.selectedElement);
    });

    context.restore();
  }, [
    canvasLineElementStore.elements,
    elements,
    selectedElement,
    canvasLineElementStore.selectedElement,
  ]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: string
  ) => {
    const elements = [...canvasLineElementStore.elements];

    switch (type) {
      case "line":
        elements[id] = constructElement(id, x1, y1, x2, y2, type);
        break;
      case "selection":
        return;

      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    canvasLineElementStore.elements = [...elements];
    setElements(elements, true);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getLayoutCoordinates(event);
    if (tool === "selection") {
      const element = getSelectedElement(
        clientX,
        clientY,
        canvasLineElementStore.elements
      );
      if (element) {
        if (element.type === "line") {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          const distance = (
            distanceOfaLine(element.x1, element.y1, element.x2, element.y2) *
            0.026458
          ).toFixed(1);
          const angle = Math.round(
            calculateAngle(element.x1, element.y1, element.x2, element.y2)
          );

          canvasLineElementStore.selectedElement = {
            ...element,
            offsetX,
            offsetY,
            distance,
            angle,
          };
          setSelectedElement({ ...element, offsetX, offsetY, distance, angle });
        }
        updateElement(
          element.id,
          element.x1,
          element.y1,
          element.x2,
          element.y2,
          element.type
        );
        // setElements((prevState) => prevState);
        element.position === "inside"
          ? setMouseAction("moving")
          : setMouseAction("resizing");
      }
    } else {
      const id = canvasLineElementStore.elements.length;
      const element = constructElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );

      canvasLineElementStore.elements.push(element);
      canvasLineElementStore.selectedElement = { ...element };
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      setMouseAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getLayoutCoordinates(event);
    const element = getSelectedElement(
      clientX,
      clientY,
      canvasLineElementStore.elements
    );

    event.currentTarget.style.cursor = element
      ? cursor(element.position as string)
      : "crosshair";
    element ? setTool("selection") : setTool("line");

    if (mouseAction === "drawing") {
      const index = canvasLineElementStore.elements.length - 1;
      const { id, x1, y1, type } = canvasLineElementStore.elements[index];
      const distance = (
        distanceOfaLine(x1, y1, clientX, clientY) * 0.026458
      ).toFixed(1);
      const angle = Math.round(calculateAngle(x1, y1, clientX, clientY));

      canvasLineElementStore.selectedElement = {
        ...canvasLineElementStore.selectedElement,
        id,
        x1,
        y1,
        x2: clientX,
        y2: clientY,
        type,
        distance,
        angle,
      };
      setSelectedElement((prevState) => ({
        ...(prevState as ElementType),
        x1: x1,
        y1: y1,
        x2: clientX,
        y2: clientY,
        distance,
        angle,
      }));
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (mouseAction === "moving") {
      if (canvasLineElementStore.selectedElement?.type === "line") {
        const {
          id,
          x1,
          x2,
          y1,
          y2,
          type,
          offsetX = 0,
          offsetY = 0,
        } = canvasLineElementStore.selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;

        canvasLineElementStore.selectedElement = {
          ...canvasLineElementStore.selectedElement,
          id,
          x1: newX1,
          y1: newY1,
          x2: newX1 + width,
          y2: newY1 + height,
          type,
        };

        updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
      }
    } else if (mouseAction === "resizing") {
      const { id, type, position, ...coordinates } =
        canvasLineElementStore.selectedElement as ElementType;
      const { x1, y1, x2, y2 }: any = resizeElement(
        clientX,
        clientY,
        position as string,
        coordinates
      );
      const distance = (distanceOfaLine(x1, y1, x2, y2) * 0.026458).toFixed(1);
      const angle = Math.round(calculateAngle(x1, y1, x2, y2));

      canvasLineElementStore.selectedElement = {
        ...canvasLineElementStore.selectedElement,
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        distance,
        angle,
      };
      setSelectedElement((prevState) => ({
        ...(prevState as ElementType),
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        distance,
        angle,
      }));
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasLineElementStore.selectedElement) {
      const index = canvasLineElementStore.selectedElement.id;
      const { id, type, x1, y1, x2, y2 } =
        canvasLineElementStore.elements[index];
      if (
        mouseAction === "drawing" ||
        mouseAction === "resizing" ||
        mouseAction === "moving"
      ) {
        updateElement(id, x1, y1, x2, y2, type);
        const distance = (distanceOfaLine(x1, y1, x2, y2) * 0.026458).toFixed(
          1
        );
        console.log("event type is", event);
        const angle = Math.round(calculateAngle(x1, y1, x2, y2));
        canvasLineElementStore.selectedElement = {
          ...canvasLineElementStore.selectedElement,
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          distance,
          angle,
        };
        setSelectedElement((prevState) => ({
          ...(prevState as ElementType),
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          distance,
          angle,
        }));
      }
    }
    setMouseAction("none");
    //setTool("line");
  };

  return (
    <div>
      <canvas
        role="presentation"
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight - 10}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ zIndex: 1 }}
      >
        Canvas
      </canvas>
      {canvasLineElementStore.selectedElement &&
      Object.keys(canvasLineElementStore.selectedElement).length > 0 ? (
        <BannerComponent
          selectedElement={canvasLineElementStore.selectedElement}
        />
      ) : null}
    </div>
  );
};

export default LineComponent;
