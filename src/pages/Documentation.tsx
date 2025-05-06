import React from 'react';
import DocumentList from '../components/docs/DocumentList';
import DocumentForm from '../components/docs/DocumentForm';
import CategoryManager from '../components/docs/CategoryManager';
import TagManager from '../components/docs/TagManager';
import DocumentView from '../components/docs/DocumentView';
import SearchBar from '../components/docs/SearchBar';

const Documentation = () => {
  return (
    <div>
      <h1>Documentation Repository</h1>
      <SearchBar />
      <DocumentList />
      {/* <DocumentForm /> */}
      {/* <CategoryManager /> */}
      {/* <TagManager /> */}
      {/* <DocumentView /> */}
    </div>
  );
};

export default Documentation;