import React, { useState, useEffect } from 'react';
import { DocService } from '../../services/docs/docService';
import { Document } from '../../services/docs/docTypes';
import { Button } from '../../components/ui/button';

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const docService = new DocService();

  useEffect(() => {
    const fetchDocuments = async () => {
      const documents = await docService.getAllDocuments();
      setDocuments(documents);
    };

    fetchDocuments();
  }, []);

  return (
    <div>
      <h2>Document List</h2>
      <Button>Create New Document</Button>
      <ul>
        {documents.map((document) => (
          <li key={document.id}>{document.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;