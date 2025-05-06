/**
 * Vendor type definition
 */
export interface Vendor {
  id: string;
  name: string;
  contact: Contact[];
  products: ProductService[];
  contracts: Contract[];
  performanceMetrics: PerformanceMetrics[];
}

/**
 * Partner type definition
 */
export interface Partner {
  id: string;
  name: string;
  contact: Contact[];
  products: ProductService[];
  contracts: Contract[];
  performanceMetrics: PerformanceMetrics[];
}

/**
 * Contact type definition
 */
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

/**
 * Product/Service type definition
 */
export interface ProductService {
  id: string;
  name: string;
  description: string;
}

/**
 * Contract type definition
 */
export interface Contract {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  terms: string;
}

/**
 * Performance metrics type definition
 */
export interface PerformanceMetrics {
  id: string;
  name: string;
  value: number;
  date: Date;
}