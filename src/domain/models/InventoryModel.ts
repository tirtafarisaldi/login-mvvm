import { BaseModel } from './BaseModel';
import type { IPaginationResponse } from '../vo/Pagination';

export type InventoryStatus = 'Tersedia' | 'Dipinjam' | 'Perlu Perawatan';

export interface IInventory {
  id: string;
  name: string;
  category: string;
  stock: number;
  location: string;
  status: InventoryStatus;
  information?: string;
  image: string;
}

export interface InventoryInput {
  name: string;
  category: string;
  stock: number;
  location: string;
  status: InventoryStatus;
  information?: string;
  image: string;
}

export interface InventoryFilters {
  name?: string;
  category?: string;
  location?: string;
  status?: InventoryStatus;
  page: number;
  limit: number;
}

export interface IInventoryPaginationResponse extends IPaginationResponse {
  inventories: IInventory[];
}

export class InventoryModel extends BaseModel {
  name: string;
  category: string;
  stock: number;
  location: string;
  status: InventoryStatus;
  information?: string;
  image: string;

  constructor(data: IInventory) {
    super(data.id);
    this.name = data.name;
    this.category = data.category;
    this.stock = data.stock;
    this.location = data.location;
    this.status = data.status;
    this.information = data.information;
    this.image = data.image;
  }
}
