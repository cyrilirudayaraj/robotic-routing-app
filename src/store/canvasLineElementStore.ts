import { ElementType } from "../intefaces/ElementType";
const initialState: ElementType = {} as ElementType;
import { CanvasLineElementStore } from "../intefaces/CanvasLineElementStore";
export const canvasLineElementStore: CanvasLineElementStore = {
  selectedElement: initialState,
  elements: [] as ElementType[],
  cachedSnapshot: null as ReturnType<
    typeof canvasLineElementStore.getSnapshot
  > | null,
  subscribe: (listener: () => void) => {
    listener();
    const unsubscribe = () => {};
    return unsubscribe;
  },
  getSnapshot: () => {
    try {
      // If the snapshot is already cached, return it
      if (canvasLineElementStore.cachedSnapshot !== null) {
        return canvasLineElementStore.cachedSnapshot;
      }

      // Otherwise, compute the snapshot and cache it
      const snapshot = {
        selectedElement: canvasLineElementStore.selectedElement,
        elements: canvasLineElementStore.elements,
      };

      canvasLineElementStore.cachedSnapshot = snapshot;
      return snapshot;
    } catch (error) {
      throw new Error(`Error getting snapshot:error:  ${error}`);
    }
  },
};
