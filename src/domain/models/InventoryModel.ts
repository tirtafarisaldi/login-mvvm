import { BaseModel } from './BaseModel';

export type InventoryStatus = 'Tersedia' | 'Dipinjam' | 'Perlu Perawatan';

export interface IInventory {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  location: string;
  status: InventoryStatus;
  information?: string;
  image: string;
}

export interface InventoryInput {
  name: string;
  description: string;
  category: string;
  stock: number;
  location: string;
  status: InventoryStatus;
  information?: string;
  image: string;
}

export class InventoryModel extends BaseModel {
  name: string;
  description: string;
  category: string;
  stock: number;
  location: string;
  status: InventoryStatus;
  information?: string;
  image: string;

  constructor(data: IInventory) {
    super(data.id);
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.stock = data.stock;
    this.location = data.location;
    this.status = data.status;
    this.information = data.information;
    this.image = data.image;
  }
}
