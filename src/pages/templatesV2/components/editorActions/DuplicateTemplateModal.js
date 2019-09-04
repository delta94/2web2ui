import React, { useState } from 'react';
import {
  Modal,
  Panel,
  TextField,
  Button
} from '@sparkpost/matchbox';
import { showAlert } from 'src/actions/globalAlert';
import ButtonWrapper from 'src/components/buttonWrapper';
import useEditorContext from '../../hooks/useEditorContext';

const DuplicateTemplateModal = (props) => {
  const {
    open,
    onClose,
    onPrimaryButtonClick
  } = props;
  const { draft, createTemplate } = useEditorContext();
  const [draftName, setDraftName] = useState(draft.name);
  const [draftId, setDraftId] = useState(draft.id);
  const handleButtonClick = (draft, callback) => {
    // Not currently working - lacking accessing to store?
    createTemplate({
      ...draft,
      name: draftName,
      id: draftId
    });

    // Not currently working - lacking accessing to store?
    showAlert({
      message: 'Template duplicated',
      type: 'success'
    });

    if (callback) {
      callback();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      showCloseButton={true}
    >
      <Panel
        title="Duplicate Template"
        sectioned
      >
        <TextField
          id="template-name"
          name="templateName"
          label="Template Name"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
        />

        <TextField
          id="template-id"
          name="templateId"
          label="Template ID"
          value={draftId}
          onChange={(e) => setDraftId(e.target.value)}
        />

        <ButtonWrapper>
          <Button color="orange" onClick={() => handleButtonClick(draft, onPrimaryButtonClick)}>
            Duplicate
          </Button>
        </ButtonWrapper>
      </Panel>
    </Modal>
  );
};

export default DuplicateTemplateModal;
