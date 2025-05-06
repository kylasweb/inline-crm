export interface Competitor {
  id: string;
  name: string;
  website: string;
  description: string;
}

export interface Product {
  id: string;
  competitorId: string;
  name: string;
  description: string;
  price: number;
}

export interface Strategy {
  id: string;
  competitorId: string;
  description: string;
}

export interface News {
  id: string;
  competitorId: string;
  title: string;
  content: string;
  url: string;
  publishedDate: Date;
}

export interface Analysis {
  id: string;
  competitorId: string;
  date: Date;
  summary: string;
  details: string;
}

export interface Report {
  id: string;
  competitorId: string;
  date: Date;
  summary: string;
  details: string;
}