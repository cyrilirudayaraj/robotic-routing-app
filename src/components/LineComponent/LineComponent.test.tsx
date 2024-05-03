import { render, fireEvent } from "@testing-library/react";
import LineComponent from "./LineComponent";
import { canvasLineElementStore } from "../../store/canvasLineElementStore";

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useLayoutEffect: () => {
      jest.fn();
    },
    useState: (initialState: any) => [initialState, jest.fn()],
    useSyncExternalStore: (subscribe: any, getSnapshot: any) => {
      subscribe(canvasLineElementStore.getSnapshot);
      return getSnapshot();
    },
  };
});

describe("LineComponent", () => {
  it("matches snapshot", () => {
    // Render the component
    const { asFragment } = render(<LineComponent />);

    // Generate a snapshot of the rendered component
    expect(asFragment()).toMatchSnapshot();
  }),
    it("adds element on canvas click", () => {
      const { getByRole } = render(<LineComponent />);
      const canvas = getByRole("presentation");

      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas, { clientX: 100, clientY: 100 });

      // Assert that elements array is updated
      const elements = canvasLineElementStore.elements;
      expect(elements).toHaveLength(1);
      expect(elements[0]).toHaveProperty("type", "line");

      // Assert that selectedElement is updated
      const selectedElement = canvasLineElementStore.selectedElement;
      expect(selectedElement).toHaveProperty("type", "line");
      expect(selectedElement).toHaveProperty("x1", 100);
      expect(selectedElement).toHaveProperty("y1", 100);
      expect(selectedElement).toHaveProperty("x2", 100);
      expect(selectedElement).toHaveProperty("y2", 100);
    });

  it("moves element on canvas drag", () => {
    // Mock initial element

    const { getByRole } = render(<LineComponent />);
    const canvas = getByRole("presentation");

    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas, { clientX: 150, clientY: 150 });
    const elements = canvasLineElementStore.elements;
    expect(elements[0]).toHaveProperty("x1", 100);
    expect(elements[0]).toHaveProperty("y1", 100);
    // Assert that selectedElement is updated
    const selectedElement = canvasLineElementStore.selectedElement;
    expect(selectedElement).toHaveProperty("x2", 100);
    expect(selectedElement).toHaveProperty("y2", 100);
  });

  it("resizes element on canvas drag", () => {
    // Mock initial element
    const { getByRole } = render(<LineComponent />);
    const canvas = getByRole("presentation");
    fireEvent.mouseDown(canvas, { clientX: 200, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 250, clientY: 250 });
    fireEvent.mouseUp(canvas, { clientX: 250, clientY: 250 });

    const elements = canvasLineElementStore.elements;
    expect(elements[1]).toHaveProperty("x1", 100);
    expect(elements[1]).toHaveProperty("y1", 100);

    // Assert that selectedElement is updated
    const selectedElement = canvasLineElementStore.selectedElement;
    expect(selectedElement).toHaveProperty("x1", 200);
    expect(selectedElement).toHaveProperty("y1", 200);
  });
});
