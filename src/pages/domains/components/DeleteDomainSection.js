import React from 'react';
import { Button, Layout, Text } from 'src/components/matchbox';
import { Panel } from 'src/components/matchbox';
import useDomains from '../hooks/useDomains';
import useModal from 'src/hooks/useModal';
import { DeleteModal } from 'src/components/modals';
import _ from 'lodash';

export default function DeleteDomainSection({ domain, isTracking, id, history }) {
  const { closeModal, isModalOpen, openModal } = useModal();
  const { deleteDomain, deleteTrackingDomain, showAlert, deletePending } = useDomains();
  const handleDeleteDomain = () => {
    if (isTracking) {
      return deleteTrackingDomain({
        domain: id,
        subaccountId: domain.subaccount_id,
      }).then(() => {
        history.push('/domains/list/tracking');
      });
    } else {
      const { id, subaccount_id: subaccount } = domain;

      return deleteDomain({ id, subaccount }).then(() => {
        showAlert({
          type: 'success',
          message: `Domain ${id} deleted.`,
        });
        history.push('/domains/list/sending');
      });
    }
  };
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Delete Domain</Layout.SectionTitle>
      </Layout.Section>
      <Layout.Section>
        <Panel accent="red" mb="0">
          <Panel.Section>
            Deleting a domain is permanent and cannot be undone.{' '}
            <Text as="span" fontWeight="semibold">
              Deletion of the domain affects any transmission that uses this domain.{' '}
            </Text>
          </Panel.Section>
          <Panel.Section>
            <Button color="red" outlineBorder size="default" onClick={() => openModal()}>
              Delete Domain
            </Button>

            <DeleteModal
              title="Are you sure you want to delete this domain?"
              open={isModalOpen}
              content={
                isTracking ? (
                  <p>
                    Any templates or transmissions that use this tracking domain directly will fail.
                  </p>
                ) : (
                  <p>Any future transmission that uses this domain will be rejected.</p>
                )
              }
              isPending={deletePending}
              onConfirm={handleDeleteDomain}
              onCancel={() => closeModal()}
            />
          </Panel.Section>
        </Panel>
      </Layout.Section>
    </Layout>
  );
}
