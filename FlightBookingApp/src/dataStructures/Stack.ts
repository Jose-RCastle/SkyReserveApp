class StackNode<T> {
  public value: T;
  public next: StackNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export default class Stack<T> {
  private top: StackNode<T> | null;
  private length: number;

  constructor(initialValues: T[] = []) {
    this.top = null;
    this.length = 0;

    initialValues.forEach((value) => this.push(value));
  }

  // Agrega un elemento a la parte superior de la pila.
  push(value: T): void {
    const node = new StackNode(value);
    node.next = this.top;
    this.top = node;
    this.length += 1;
  }

  // Retira y devuelve el último elemento agregado. Si está vacía, devuelve null.
  pop(): T | null {
    if (!this.top) return null;

    const removedValue = this.top.value;
    this.top = this.top.next;
    this.length -= 1;
    return removedValue;
  }

  // Devuelve el elemento superior sin retirarlo de la pila.
  peek(): T | null {
    return this.top ? this.top.value : null;
  }

  // Indica si la pila no contiene elementos.
  isEmpty(): boolean {
    return this.length === 0;
  }

  // Devuelve la cantidad de elementos almacenados.
  size(): number {
    return this.length;
  }

  // Convierte la pila a arreglo desde el elemento superior hasta el inferior.
  toArray(): T[] {
    const values: T[] = [];
    let current = this.top;

    while (current) {
      values.push(current.value);
      current = current.next;
    }

    return values;
  }
}
