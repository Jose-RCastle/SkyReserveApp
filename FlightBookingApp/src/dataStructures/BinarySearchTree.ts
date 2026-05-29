class BinarySearchTreeNode<T> {
  public value: T;
  public values: T[];
  public left: BinarySearchTreeNode<T> | null;
  public right: BinarySearchTreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.values = [value];
    this.left = null;
    this.right = null;
  }
}

export default class BinarySearchTree<T> {
  private root: BinarySearchTreeNode<T> | null;
  private compare: (a: T, b: T) => number;
  private length: number;

  constructor(compare: (a: T, b: T) => number) {
    this.root = null;
    this.compare = compare;
    this.length = 0;
  }

  // Inserta un elemento usando la función comparadora configurada.
  // Si el comparador devuelve 0, el valor se almacena como duplicado en el mismo nodo.
  insert(value: T): boolean {
    if (!this.compare) return false;

    if (!this.root) {
      this.root = new BinarySearchTreeNode(value);
      this.length += 1;
      return true;
    }

    let current = this.root;

    while (current) {
      const comparison = this.compare(value, current.value);

      if (comparison === 0) {
        current.values.push(value);
        this.length += 1;
        return true;
      }

      if (comparison < 0) {
        if (!current.left) {
          current.left = new BinarySearchTreeNode(value);
          this.length += 1;
          return true;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = new BinarySearchTreeNode(value);
          this.length += 1;
          return true;
        }
        current = current.right;
      }
    }

    return false;
  }

  // Busca un elemento equivalente al valor indicado según la función comparadora.
  // Si existen duplicados, devuelve el primer valor almacenado en el nodo encontrado.
  search(value: T): T | null {
    const node = this.searchNode(value);
    return node ? node.values[0] : null;
  }

  // Busca todos los elementos equivalentes al valor indicado, incluyendo duplicados.
  searchAll(value: T): T[] {
    const node = this.searchNode(value);
    return node ? [...node.values] : [];
  }

  // Busca internamente el nodo que coincide con el valor recibido.
  private searchNode(value: T): BinarySearchTreeNode<T> | null {
    if (!this.compare) return null;

    let current = this.root;

    while (current) {
      const comparison = this.compare(value, current.value);

      if (comparison === 0) return current;
      current = comparison < 0 ? current.left : current.right;
    }

    return null;
  }

  // Recorre el árbol en inorden: izquierda, raíz, derecha.
  // Los duplicados se agregan juntos en la posición ordenada del nodo.
  inOrder(): T[] {
    const values: T[] = [];

    const visit = (node: BinarySearchTreeNode<T> | null) => {
      if (!node) return;
      visit(node.left);
      values.push(...node.values);
      visit(node.right);
    };

    visit(this.root);
    return values;
  }

  // Recorre el árbol en preorden: raíz, izquierda, derecha.
  preOrder(): T[] {
    const values: T[] = [];

    const visit = (node: BinarySearchTreeNode<T> | null) => {
      if (!node) return;
      values.push(...node.values);
      visit(node.left);
      visit(node.right);
    };

    visit(this.root);
    return values;
  }

  // Recorre el árbol en postorden: izquierda, derecha, raíz.
  postOrder(): T[] {
    const values: T[] = [];

    const visit = (node: BinarySearchTreeNode<T> | null) => {
      if (!node) return;
      visit(node.left);
      visit(node.right);
      values.push(...node.values);
    };

    visit(this.root);
    return values;
  }

  // Devuelve el elemento mínimo del árbol según la función comparadora.
  findMin(): T | null {
    if (!this.root) return null;

    let current = this.root;
    while (current.left) {
      current = current.left;
    }

    return current.values[0];
  }

  // Devuelve el elemento máximo del árbol según la función comparadora.
  findMax(): T | null {
    if (!this.root) return null;

    let current = this.root;
    while (current.right) {
      current = current.right;
    }

    return current.values[current.values.length - 1] ?? null;
  }

  // Devuelve la cantidad total de elementos almacenados, incluyendo duplicados.
  size(): number {
    return this.length;
  }

  // Indica si el árbol no contiene elementos.
  isEmpty(): boolean {
    return this.length === 0;
  }

  // Convierte el árbol a arreglo ordenado usando el recorrido inorden.
  toArray(): T[] {
    return this.inOrder();
  }
}
