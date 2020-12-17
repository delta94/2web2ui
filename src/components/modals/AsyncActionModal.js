import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'src/components/matchbox';
import { Loading } from 'src/components/loading';

//Hibana Only
export default function AsyncActionModal(props) {
  const {
    ActionButtonWrapper,
    open,
    title,
    isPending,
    children,
    onAction,
    actionVariant = 'primary',
    cancelVariant = 'secondary',
    disabled,
    onCancel,
    actionVerb = 'Confirm',
    cancelVerb = 'Cancel',
    showCloseButton = true,
    maxWidth,
  } = props;
  return (
    <Modal open={open} onClose={onCancel} showCloseButton={showCloseButton} maxWidth={maxWidth}>
      {title && <Modal.Header>{title}</Modal.Header>}
      <Modal.Content>{isPending ? <Loading minHeight="25vh" /> : <>{children}</>}</Modal.Content>
      <Modal.Footer>
        {ActionButtonWrapper ? (
          <ActionButtonWrapper />
        ) : (
          <Button
            variant={actionVariant}
            disabled={disabled}
            name="async-modal-action-button"
            onClick={onAction}
          >
            {actionVerb}
          </Button>
        )}
        <Button variant={cancelVariant} onClick={onCancel}>
          {cancelVerb}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AsyncActionModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.node,
  disabled: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
  actionVerb: PropTypes.string,
  cancelVerb: PropTypes.string,
  isPending: PropTypes.bool,
  showCloseButton: PropTypes.bool,
};
