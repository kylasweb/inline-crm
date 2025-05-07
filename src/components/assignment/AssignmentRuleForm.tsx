import React from 'react';
import { AssignmentRule } from '@/services/assignment/assignmentTypes';

interface AssignmentRuleFormProps {
  rule?: AssignmentRule;
  onSuccess?: () => void;
}

const AssignmentRuleForm: React.FC<AssignmentRuleFormProps> = ({ rule, onSuccess }) => {
  return (
    <div>
      {/* Assignment Rule Form Content */}
      <p>Assignment Rule Form</p>
    </div>
  );
};

export default AssignmentRuleForm;