import React, { useEffect } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { LINKS } from 'src/constants';
import { Abbreviation } from 'src/components';
import {
  Box,
  Button,
  Layout,
  Panel,
  Radio,
  RadioCard,
  Stack,
  TextField,
} from 'src/components/matchbox';
import { ExternalLink, SubduedLink } from 'src/components/links';
import { SubduedText, TranslatableText } from 'src/components/text';
import useRouter from 'src/hooks/useRouter';
import SubaccountTypeahead from 'src/components/typeahead/SubaccountTypeahead';
import useDomains from '../hooks/useDomains';

export default function CreateForm() {
  const { history } = useRouter();
  const {
    createSendingDomain,
    createTrackingDomain,
    hasSubaccounts,
    createPending,
    showAlert,
  } = useDomains();
  const { control, register, handleSubmit, errors, watch, setValue } = useForm({
    defaultValues: {
      primaryUse: 'sending',
      assignTo: 'shared',
    },
  });
  const watchedPrimaryUse = watch('primaryUse');

  useEffect(() => {
    if (watchedPrimaryUse === 'tracking') {
      setValue('assignTo', 'principalOnly');
    }
  }, [watchedPrimaryUse, setValue]);

  const onSubmit = data => {
    const { assignTo, domain, primaryUse, subaccount } = data;

    if (primaryUse === 'tracking') {
      return createTrackingDomain({
        domain,
        subaccount,
      }).then(() => {
        history.push(`/domains/details/${domain}/verify-tracking`);
      });
    }

    if (primaryUse === 'bounce') {
      return createSendingDomain({
        assignTo,
        domain,
        subaccount,
      }).then(() => {
        showAlert({ type: 'success', message: `Bounce Domain ${domain} created` });
        history.push(`/domains/details/${domain}/verify-bounce`);
      });
    }

    return createSendingDomain({
      assignTo,
      domain,
      subaccount,
    }).then(() => {
      showAlert({ type: 'success', message: `Sending Domain ${domain} created` });
      history.push(`/domains/details/${domain}/verify-sending`);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Layout>
        <Layout.Section annotated>
          <Layout.SectionTitle>Domain Type</Layout.SectionTitle>

          <Stack>
            <SubduedText>
              Adding a domain is very easy. You&rsquo;ll want to configure at least one domain for
              each domain type in order to get the most out of our sending and analytics.
            </SubduedText>

            <SubduedLink as={ExternalLink} to={LINKS.SENDING_REQS}>
              Domains Documentation
            </SubduedLink>
          </Stack>
        </Layout.Section>

        <Layout.Section>
          <Panel>
            <Panel.Section>
              <RadioCard.Group label="Primary Use for Domain">
                <RadioCard
                  ref={register}
                  disabled={createPending}
                  label="Sending Domain"
                  id="primary-use-sending-domain"
                  value="sending"
                  name="primaryUse"
                >
                  <TranslatableText>
                    A Sending Domain lets customers know where their mail is
                    &ldquo;From&rdquo;.&nbsp;
                  </TranslatableText>
                  <Abbreviation title="Domain Name System">DNS</Abbreviation>
                  <TranslatableText>
                    &nbsp;records should be configured based on this domain.
                  </TranslatableText>
                </RadioCard>

                <RadioCard
                  ref={register}
                  disabled={createPending}
                  label="Bounce Domain"
                  id="primary-use-bounce-domain"
                  value="bounce"
                  name="primaryUse"
                >
                  <TranslatableText>
                    Bounce domains are the return path address and are used for report bounces,
                    emails rejected from the recipient server.
                  </TranslatableText>
                </RadioCard>

                <RadioCard
                  ref={register}
                  disabled={createPending}
                  label="Tracking Domain"
                  id="primary-use-tracking-domain"
                  value="tracking"
                  name="primaryUse"
                >
                  Tracking domains are used to report engagement for your mail streams.
                </RadioCard>
              </RadioCard.Group>
            </Panel.Section>
          </Panel>
        </Layout.Section>
      </Layout>
      <Layout>
        <Layout.Section annotated>
          <Layout.SectionTitle>Domain and Assignment</Layout.SectionTitle>

          <SubduedText>
            We recommend using a subdomain e.g. mail.mydomain.com. Depending on how you want to use
            your domain, you may not be able to completely configure your DNS records if you use
            your organizational domain.
          </SubduedText>
        </Layout.Section>

        <Layout.Section>
          <Panel>
            <Panel.Section>
              <TextField
                ref={register({ required: 'A valid domain is required.' })}
                disabled={createPending}
                label="Domain"
                control={control}
                name="domain"
                id="textfield-domain"
                placeholder="e.g. sub.domain.com"
                error={errors.domain?.message}
              />
            </Panel.Section>

            {hasSubaccounts && (
              <Panel.Section>
                <Stack space="300">
                  <Radio.Group label="Subaccount Assignment">
                    {(watchedPrimaryUse === 'sending' || watchedPrimaryUse === 'bounce') && (
                      <Radio
                        ref={register}
                        disabled={createPending}
                        label="Principal and all Subaccounts"
                        id="assign-to-shared"
                        value="shared"
                        name="assignTo"
                      />
                    )}

                    <Radio
                      ref={register}
                      disabled={createPending}
                      label="Principal Account only"
                      id="assign-to-principal-only"
                      value="principalOnly"
                      name="assignTo"
                    />

                    <Radio
                      ref={register}
                      disabled={createPending}
                      label="Single Subaccount"
                      id="assign-to-subaccount"
                      value="singleSubaccount"
                      name="assignTo"
                    />
                  </Radio.Group>

                  {/* See https://react-hook-form.com/api#useWatch */}
                  <IsolatedSubaccountsField
                    control={control}
                    errors={errors}
                    createPending={createPending}
                  />
                </Stack>
              </Panel.Section>
            )}
          </Panel>
        </Layout.Section>
      </Layout>

      <Layout>
        <Layout.Section annotated />

        <Layout.Section>
          <Button loading={createPending} variant="primary" type="submit">
            Save and Continue
          </Button>
        </Layout.Section>
      </Layout>
    </form>
  );
}

function IsolatedSubaccountsField({ control, errors, createPending }) {
  const assignTo = useWatch({
    control,
    name: 'assignTo',
    defaultValue: 'shared',
  });

  if (assignTo !== 'singleSubaccount') return null;

  return (
    <Box marginLeft="500">
      <Controller
        control={control}
        name="subaccount"
        defaultValue=""
        rules={{ required: 'A valid subdomain is required.' }}
        render={({ name, onChange, value }) => {
          return (
            <SubaccountTypeahead
              name={name}
              disabled={createPending}
              onChange={item => {
                if (item) {
                  return onChange(item.id);
                }

                // Handles clear button
                return onChange(undefined);
              }}
              error={errors.subaccount?.message}
              placeholder="e.g. samplesubaccount"
              value={value}
            />
          );
        }}
      />
    </Box>
  );
}
