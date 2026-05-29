type HashTableEntry<T> = {
  key: string;
  value: T;
  next: HashTableEntry<T> | null;
};

export default class HashTable<T> {
  private buckets: Array<HashTableEntry<T> | null>;
  private capacity: number;
  private length: number;

  constructor(capacity: number = 31) {
    this.capacity = capacity > 0 ? capacity : 31;
    this.buckets = new Array(this.capacity).fill(null);
    this.length = 0;
  }

  // Genera un índice numérico para una clave de texto.
  private hash(key: string): number {
    if (!key) return 0;

    let hashValue = 0;

    for (let index = 0; index < key.length; index += 1) {
      hashValue = (hashValue * 31 + key.charCodeAt(index)) % this.capacity;
    }

    return hashValue;
  }

  // Inserta o actualiza un valor usando una clave. Maneja colisiones por encadenamiento.
  set(key: string, value: T): boolean {
    if (!key) return false;

    const index = this.hash(key);
    const entry: HashTableEntry<T> = { key, value, next: null };

    if (!this.buckets[index]) {
      this.buckets[index] = entry;
      this.length += 1;
      return true;
    }

    let current: HashTableEntry<T> | null = this.buckets[index];
    let previous: HashTableEntry<T> | null = null;

    while (current) {
      if (current.key === key) {
        current.value = value;
        return true;
      }

      previous = current;
      current = current.next;
    }

    if (previous) {
      previous.next = entry;
      this.length += 1;
      return true;
    }

    return false;
  }

  // Obtiene un valor por clave. Si no existe, devuelve null.
  get(key: string): T | null {
    if (!key) return null;

    let current: HashTableEntry<T> | null = this.buckets[this.hash(key)];

    while (current) {
      if (current.key === key) return current.value;
      current = current.next;
    }

    return null;
  }

  // Indica si existe una clave en la tabla hash sin depender del valor almacenado.
  has(key: string): boolean {
    if (!key) return false;

    let current: HashTableEntry<T> | null = this.buckets[this.hash(key)];

    while (current) {
      if (current.key === key) return true;
      current = current.next;
    }

    return false;
  }

  // Elimina una entrada por clave. Devuelve true si fue eliminada.
  remove(key: string): boolean {
    if (!key) return false;

    const index = this.hash(key);
    let current: HashTableEntry<T> | null = this.buckets[index];
    let previous: HashTableEntry<T> | null = null;

    while (current) {
      if (current.key === key) {
        if (previous) {
          previous.next = current.next;
        } else {
          this.buckets[index] = current.next;
        }

        this.length -= 1;
        return true;
      }

      previous = current;
      current = current.next;
    }

    return false;
  }

  // Devuelve todas las claves almacenadas.
  keys(): string[] {
    return this.toEntries().map((entry) => entry.key);
  }

  // Devuelve todos los valores almacenados.
  values(): T[] {
    return this.toEntries().map((entry) => entry.value);
  }

  // Devuelve la cantidad de pares clave-valor almacenados.
  size(): number {
    return this.length;
  }

  // Indica si la tabla hash no contiene entradas.
  isEmpty(): boolean {
    return this.length === 0;
  }

  // Convierte la tabla hash a arreglo de entradas para inspección o renderizado.
  toEntries(): Array<{ key: string; value: T; bucketIndex: number }> {
    const entries: Array<{ key: string; value: T; bucketIndex: number }> = [];

    for (let index = 0; index < this.buckets.length; index += 1) {
      let current: HashTableEntry<T> | null = this.buckets[index];

      while (current) {
        entries.push({ key: current.key, value: current.value, bucketIndex: index });
        current = current.next;
      }
    }

    return entries;
  }

  // Convierte la tabla hash a arreglo de valores para facilitar renderizado en React Native.
  toArray(): T[] {
    return this.values();
  }
}
