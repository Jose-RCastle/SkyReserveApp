class QueueNode<T> {
  public value: T;
  public next: QueueNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export default class Queue<T> {
  private head: QueueNode<T> | null;
  private tail: QueueNode<T> | null;
  private length: number;

  constructor(initialValues: T[] = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    initialValues.forEach((value) => this.enqueue(value));
  }

  // Agrega un elemento al final de la cola.
  enqueue(value: T): void {
    const node = new QueueNode(value);

    if (!this.tail) {
      this.head = node;
      this.tail = node;
      this.length += 1;
      return;
    }

    this.tail.next = node;
    this.tail = node;
    this.length += 1;
  }

  // Retira y devuelve el primer elemento agregado. Si está vacía, devuelve null.
  dequeue(): T | null {
    if (!this.head) return null;

    const removedValue = this.head.value;
    this.head = this.head.next;
    this.length -= 1;

    if (!this.head) {
      this.tail = null;
    }

    return removedValue;
  }

  // Devuelve el primer elemento sin retirarlo de la cola.
  front(): T | null {
    return this.head ? this.head.value : null;
  }

  // Indica si la cola no contiene elementos.
  isEmpty(): boolean {
    return this.length === 0;
  }

  // Devuelve la cantidad de elementos almacenados.
  size(): number {
    return this.length;
  }

  // Convierte la cola a arreglo desde el frente hasta el final.
  toArray(): T[] {
    const values: T[] = [];
    let current = this.head;

    while (current) {
      values.push(current.value);
      current = current.next;
    }

    return values;
  }
}
