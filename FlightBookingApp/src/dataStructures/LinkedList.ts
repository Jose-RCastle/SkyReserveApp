class LinkedListNode<T> {
  public value: T;
  public next: LinkedListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export default class LinkedList<T> {
  private head: LinkedListNode<T> | null;
  private tail: LinkedListNode<T> | null;
  private length: number;

  constructor(initialValues: T[] = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    initialValues.forEach((value) => this.append(value));
  }

  // Inserta un elemento al final de la lista enlazada.
  append(value: T): void {
    const node = new LinkedListNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.length += 1;
      return;
    }

    if (this.tail) {
      this.tail.next = node;
    }

    this.tail = node;
    this.length += 1;
  }

  // Inserta un elemento al inicio de la lista enlazada.
  prepend(value: T): void {
    const node = new LinkedListNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.length += 1;
      return;
    }

    node.next = this.head;
    this.head = node;
    this.length += 1;
  }

  // Elimina el primer elemento que cumpla con la condición indicada.
  remove(predicate: (value: T) => boolean): T | null {
    if (!predicate || !this.head) return null;

    if (predicate(this.head.value)) {
      const removedValue = this.head.value;
      this.head = this.head.next;
      this.length -= 1;

      if (!this.head) {
        this.tail = null;
      }

      return removedValue;
    }

    let previous = this.head;
    let current = this.head.next;

    while (current) {
      if (predicate(current.value)) {
        previous.next = current.next;

        if (current === this.tail) {
          this.tail = previous;
        }

        this.length -= 1;
        return current.value;
      }

      previous = current;
      current = current.next;
    }

    return null;
  }

  // Busca y devuelve el primer elemento que cumpla con la condición indicada.
  find(predicate: (value: T) => boolean): T | null {
    if (!predicate) return null;

    let current = this.head;

    while (current) {
      if (predicate(current.value)) {
        return current.value;
      }

      current = current.next;
    }

    return null;
  }

  // Recorre la lista ejecutando una función por cada elemento.
  traverse(callback: (value: T, index: number) => void): void {
    if (!callback) return;

    let current = this.head;
    let index = 0;

    while (current) {
      callback(current.value, index);
      current = current.next;
      index += 1;
    }
  }

  // Devuelve la cantidad de elementos almacenados.
  size(): number {
    return this.length;
  }

  // Indica si la lista no contiene elementos.
  isEmpty(): boolean {
    return this.length === 0;
  }

  // Convierte la lista enlazada a arreglo para facilitar su renderizado en React Native.
  toArray(): T[] {
    const values: T[] = [];
    this.traverse((value) => values.push(value));
    return values;
  }
}
