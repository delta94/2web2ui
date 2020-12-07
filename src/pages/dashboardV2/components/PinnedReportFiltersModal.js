import React from 'react';
import { Modal, Button } from 'src/components/matchbox';
import { ActiveFilters } from 'src/components/reportBuilder';

export default function PinnedReportFiltersModal({ pinnedReport, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
      <Modal.Header>{pinnedReport.name} Filters </Modal.Header>
      <Modal.Content>
        <ActiveFilters filters={pinnedReport.options.filters} />
      </Modal.Content>
      <Modal.Footer>
        <Button variant="primary" to={pinnedReport.linkToReportBuilder}>
          View Report
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
