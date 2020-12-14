import React from 'react';
import { Button, Layout, Stack, Text } from 'src/components/matchbox';
import { Panel, Checkbox } from 'src/components/matchbox';
import { SubduedText } from 'src/components/text';
import { ExternalLink, SubduedLink } from 'src/components/links';
import useDomains from '../hooks/useDomains';
import { CopyField } from 'src/components';
import { EXTERNAL_LINKS } from '../constants';
import { useForm } from 'react-hook-form';

import _ from 'lodash';

export default function TrackingDnsSection({ domain, isSectionVisible, title }) {
  const { trackingDomainCname, verifyTrackingDomain, verifyingTrackingPending } = useDomains();
  const { unverified, domain: domainName, subaccount_id: subaccountId } = domain;
  const { handleSubmit, watch, register } = useForm();

  const onSubmit = () => {
    return verifyTrackingDomain({
      domain: domainName,
      subaccountId: subaccountId,
    });
  };
  if (!isSectionVisible) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">{title || 'Tracking'} </Layout.SectionTitle>
        <Stack>
          {unverified && (
            <SubduedText fontSize="200">
              Tracking domains are used by mail providers to determine where engagement rate (like
              opens and clicks) should be sent. This allows you to measure the health of your email
              campaigns so that your team is able to create content and mailing lists that maximize
              your potential.
            </SubduedText>
          )}
          <SubduedLink
            as={ExternalLink}
            to={EXTERNAL_LINKS.TRACKING_DOMAIN_DOCUMENTATION}
            fontSize="200"
          >
            Tracking Domain Documentation
          </SubduedLink>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Panel>
            {unverified ? (
              <Panel.Section>
                Add the{' '}
                <Text as="span" fontWeight="semibold">
                  CNAME
                </Text>{' '}
                records, Hostnames and Values for this domain in the settings section of your DNS
                provider.
              </Panel.Section>
            ) : (
              <Panel.Section>
                Below is the{' '}
                <Text as="span" fontWeight="semibold">
                  CNAME
                </Text>{' '}
                record for this domain at your DNS provider.
              </Panel.Section>
            )}
            <Panel.Section>
              <Stack>
                {unverified && (
                  <>
                    <Text as="label" fontWeight="500" fontSize="200">
                      Type
                    </Text>
                    <Text as="p">CNAME</Text>
                  </>
                )}
                <CopyField label="Hostname" value={domainName} hideCopy={!unverified} />
                <CopyField label="Value" value={trackingDomainCname} hideCopy={!unverified} />
              </Stack>

              {unverified && (
                <Checkbox
                  mt="600"
                  mb="100"
                  name="ack-checkbox-tracking"
                  ref={register({ required: true })}
                  label={<>The CNAME record has been added to the DNS provider.</>}
                />
              )}
            </Panel.Section>

            {unverified && (
              <Panel.Section>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!Boolean(watch('ack-checkbox-tracking'))}
                  loading={verifyingTrackingPending}
                >
                  Verify Domain
                </Button>
              </Panel.Section>
            )}
          </Panel>
        </form>
      </Layout.Section>
    </Layout>
  );
}
