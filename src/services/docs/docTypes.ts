/**
 * @module docTypes
 * @description This module defines the TypeScript types for the Documentation Repository module.
 */

/**
 * @typedef Document
 * @description Represents a document in the repository.
 */
export type Document = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  versionId: string;
  metadataId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * @typedef Category
 * @description Represents a category for documents.
 */
export type Category = {
  id: string;
  name: string;
  description: string;
};

/**
 * @typedef Tag
 * @description Represents a tag for documents.
 */
export type Tag = {
  id: string;
  name: string;
};

/**
 * @typedef Version
 * @description Represents a version of a document.
 */
export type Version = {
  id: string;
  documentId: string;
  versionNumber: string;
  createdAt: Date;
};

/**
 * @typedef Metadata
 * @description Represents metadata for a document.
 */
export type Metadata = {
  id: string;
  author: string;
  keywords: string[];
  summary: string;
};