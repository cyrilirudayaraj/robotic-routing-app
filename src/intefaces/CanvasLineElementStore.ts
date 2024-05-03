import { canvasLineElementStore } from "../store/canvasLineElementStore";
import { ElementType } from "../intefaces/ElementType";
export interface CanvasLineElementStore {
  selectedElement: ElementType;
  elements: ElementType[];
  cachedSnapshot: ReturnType<typeof canvasLineElementStore.getSnapshot> | null;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => {
    selectedElement: ElementType;
    elements: ElementType[];
  };
}
