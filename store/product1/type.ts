export interface IProduct {
  _id: number,
  title: string,
  price: number,
}

export enum MutationTypes {
  UPDATE = 'UPDATE',
}

export enum ActionTypes {
  LOAD = 'LOAD',
}

export enum StateTypes {
  PRODUCT = 'PRODUCT',
}
