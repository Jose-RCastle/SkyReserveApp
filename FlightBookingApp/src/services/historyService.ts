import Stack from "../dataStructures/Stack";

export type HistoryActionInput = {
  type: string;
  title?: string;
  description: string;
  payload?: unknown;
};

export type HistoryAction = HistoryActionInput & {
  id: string;
  title: string;
  createdAt: string;
};

const history = new Stack<HistoryAction>();
let actionCounter = 1;

// Inserta una acción en la pila de historial para permitir deshacer la última acción.
export function pushAction(input: HistoryActionInput): HistoryAction | null {
  if (!input.type || !input.description) return null;

  const action: HistoryAction = {
    ...input,
    id: `ACT-${actionCounter.toString().padStart(4, "0")}`,
    title: input.title ?? input.description,
    createdAt: new Date().toISOString(),
  };

  actionCounter += 1;
  history.push(action);
  return action;
}

// Retira y devuelve la última acción registrada siguiendo comportamiento LIFO.
export function undoLastAction(): HistoryAction | null {
  return history.pop();
}

// Devuelve la última acción sin retirarla de la pila.
export function peekLastAction(): HistoryAction | null {
  return history.peek();
}

// Devuelve el historial como arreglo desde la acción más reciente hasta la más antigua.
export function getHistoryArray(): HistoryAction[] {
  return history.toArray();
}


// Alias amigable para obtener la última acción del historial real.
export function getLastAction(): HistoryAction | null {
  return peekLastAction();
}

// Limpia todo el historial en memoria sin romper la pila existente.
export function clearHistory(): void {
  while (!history.isEmpty()) {
    history.pop();
  }
}
