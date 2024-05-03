import { canvasLineElementStore } from "../canvasLineElementStore";
import { ElementType } from "../../intefaces/ElementType";

const initialState = {} as ElementType;

describe("canvasLineElementStore", () => {
  beforeEach(() => {
    // Reset the store before each test
    canvasLineElementStore.selectedElement = initialState;
    canvasLineElementStore.elements = [] as ElementType[];
    canvasLineElementStore.cachedSnapshot = null;
  });

  it("should return correct snapshot", () => {
    // Modify the store's state for testing purposes
    canvasLineElementStore.selectedElement = {
      id: 1,
      x1: 30,
      y1: 50,
      x2: 70,
      y2: 100,
      type: "line",
    };
    canvasLineElementStore.elements = [
      { id: 1, x1: 30, y1: 50, x2: 70, y2: 100, type: "line" },
    ];

    // Call getSnapshot
    const snapshot = canvasLineElementStore.getSnapshot();

    // Verify that the snapshot matches the expected result
    expect(snapshot).toEqual({
      selectedElement: { id: 1, x1: 30, y1: 50, x2: 70, y2: 100, type: "line" },
      elements: [{ id: 1, x1: 30, y1: 50, x2: 70, y2: 100, type: "line" }],
    });
  });

  it("should return cached snapshot on subsequent calls", () => {
    // Modify the store's state for testing purposes
    canvasLineElementStore.selectedElement = {
      id: 1,
      x1: 30,
      y1: 50,
      x2: 70,
      y2: 100,
      type: "line",
    };
    canvasLineElementStore.elements = [
      { id: 1, x1: 30, y1: 50, x2: 70, y2: 100, type: "line" },
    ];

    // Call getSnapshot twice
    const snapshot1 = canvasLineElementStore.getSnapshot();
    const snapshot2 = canvasLineElementStore.getSnapshot();

    // Verify that both snapshots are the same object reference
    expect(snapshot1).toBe(snapshot2);
  });
  it("should call the listener when subscribe method is called", () => {
    const listener = jest.fn();

    // Call the subscribe method
    const unsubscribe = canvasLineElementStore.subscribe(listener);

    // Expect that the listener has been called
    expect(listener).toHaveBeenCalledTimes(1);

    // Call the unsubscribe function returned by subscribe
    unsubscribe();

    // After unsubscribing, listener should not be called anymore
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
