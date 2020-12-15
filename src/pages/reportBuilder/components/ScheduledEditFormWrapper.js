import React from 'react';
import { ScheduledReportDetailsForm, ScheduledReportTimingForm } from './ScheduledReportForm';
import { useForm } from 'react-hook-form';

/*
This wrapper is used because of the difficulties in getting async default values to work
 */
export default function ScheduledReportEditFormWrapper({
  defaultValues,
  disabled,
  onSubmit,
  report,
  users,
}) {
  const { ...detailsFormControls } = useForm({
    defaultValues: defaultValues,
    mode: 'onBlur',
  });
  const { ...timingFormControls } = useForm({
    defaultValues: defaultValues,
    mode: 'onBlur',
  });

  const isSubmitting =
    detailsFormControls.formState.isSubmitting || timingFormControls.formState.isSubmitting;

  return (
    <>
      <form onSubmit={detailsFormControls.handleSubmit(onSubmit)} id="scheduledReportDetailsForm">
        <ScheduledReportDetailsForm
          formControls={detailsFormControls}
          disabled={disabled || isSubmitting}
          isUpdatingScheduledReport={true}
          report={report}
          users={users}
        />
      </form>
      <form onSubmit={timingFormControls.handleSubmit(onSubmit)} id="scheduledReportTimingForm">
        <ScheduledReportTimingForm
          formControls={timingFormControls}
          disabled={disabled || isSubmitting}
          isUpdatingScheduledReport={true}
          report={report}
        />
      </form>
    </>
  );
}
