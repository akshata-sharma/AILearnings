"use client";

import { useState, useCallback, useRef } from "react";

interface DragState {
  activeId: string | null;
  activeIndex: number;
  overIndex: number;
  offsetY: number;
}

interface UseDragReorderOptions<T extends { id: string }> {
  items: T[];
  onReorder: (newItems: T[]) => void;
}

export function useDragReorder<T extends { id: string }>({
  items,
  onReorder,
}: UseDragReorderOptions<T>) {
  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    activeIndex: -1,
    overIndex: -1,
    offsetY: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRectsRef = useRef<Map<string, DOMRect>>(new Map());

  const measureItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rects = new Map<string, DOMRect>();
    const children = container.querySelectorAll("[data-drag-id]");
    children.forEach((el) => {
      const id = el.getAttribute("data-drag-id");
      if (id) rects.set(id, el.getBoundingClientRect());
    });
    itemRectsRef.current = rects;
  }, []);

  const getInsertionIndex = useCallback(
    (clientY: number): number => {
      const rects = itemRectsRef.current;
      let closest = 0;
      let closestDist = Infinity;

      items.forEach((item, i) => {
        const rect = rects.get(item.id);
        if (!rect) return;
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(clientY - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = clientY > mid ? i + 1 : i;
        }
      });

      return Math.min(closest, items.length - 1);
    },
    [items]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, id: string, index: number) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      measureItems();
      setDragState({
        activeId: id,
        activeIndex: index,
        overIndex: index,
        offsetY: 0,
      });
    },
    [measureItems]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.activeId) return;
      const overIndex = getInsertionIndex(e.clientY);
      setDragState((prev) => ({
        ...prev,
        overIndex,
        offsetY: e.movementY + prev.offsetY,
      }));
    },
    [dragState.activeId, getInsertionIndex]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragState.activeId) return;

    const fromIndex = dragState.activeIndex;
    const toIndex = dragState.overIndex;

    if (fromIndex !== toIndex) {
      const newItems = [...items];
      const [moved] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, moved);
      onReorder(newItems);
    }

    setDragState({ activeId: null, activeIndex: -1, overIndex: -1, offsetY: 0 });
  }, [dragState, items, onReorder]);

  const moveItem = useCallback(
    (fromIndex: number, direction: "up" | "down") => {
      const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= items.length) return;
      const newItems = [...items];
      [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
      onReorder(newItems);
    },
    [items, onReorder]
  );

  return {
    dragState,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    moveItem,
    isDragging: dragState.activeId !== null,
  };
}
