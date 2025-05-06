export interface Asset {
  id: string;
  name: string;
  description?: string;
  category: Category;
  location: Location;
  status: Status;
  purchaseDate: Date;
  purchasePrice: number;
  serialNumber?: string;
  modelNumber?: string;
  manufacturer?: string;
  depreciationSchedule: DepreciationSchedule[];
  maintenanceRecords: MaintenanceRecord[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
}

export interface Status {
  id: string;
  name: string;
  description?: string;
}

export interface MaintenanceRecord {
  id: string;
  date: Date;
  description: string;
  cost: number;
  notes?: string;
}

export interface DepreciationSchedule {
  year: number;
  depreciationAmount: number;
  bookValue: number;
}