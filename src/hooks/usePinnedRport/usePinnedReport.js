import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRelativeDates, getLocalTimezone } from 'src/helpers/date';
import { parseSearchNew as parseSearch } from 'src/helpers/reports';
import { hydrateFilters } from 'src/pages/reportBuilder/helpers';
import { PRESET_REPORT_CONFIGS } from 'src/pages/reportBuilder/constants/presetReport';
import _ from 'lodash';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { getReports } from 'src/actions/reports';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';

const defaultReportName = 'Summary Report';

export default function usePinnedReport(onboarding) {
  const pinnedReport = { options: {}, name: '', linkToReportBuilder: '/' };
  const dispatch = useDispatch();

  const reports = useSelector(state => state.reports.list);
  const subaccounts = useSelector(state => state.subaccounts.list);
  const pinnedReportId = useSelector(state =>
    selectCondition(isUserUiOptionSet('pinned_report_id'))(state),
  ); //TODO: this is the id stored in user ui option "pinned_report"

  useEffect(() => {
    if (onboarding === 'analytics') {
      dispatch(listSubaccounts());
      dispatch(getReports());
    }
  }, [dispatch, onboarding]);
  const getRelativeDateRange = ({ relativeRange, precision }) => {
    const { from, to } = getRelativeDates(relativeRange, {
      precision: precision,
    });
    return { from, to };
  };
  const reportOptionsWithDates = reportOptions => {
    return {
      ...reportOptions,
      ...getRelativeDateRange(reportOptions),
    };
  };
  let summaryReportQueryString = PRESET_REPORT_CONFIGS.find(x => x.name === defaultReportName)
    .query_string;
  const summaryReportOptions = parseSearch(summaryReportQueryString);
  const report = _.find(reports, { id: pinnedReportId });
  if (report) {
    const options = parseSearch(report.query_string);
    pinnedReport.name = report.name;
    pinnedReport.options = reportOptionsWithDates({
      timezone: getLocalTimezone(),
      metrics: summaryReportOptions.metrics,
      comparisons: [],
      relativeRange: '7days',
      precision: 'hour',
      ...options,
      isReady: true,
      filters: hydrateFilters(options.filters, { subaccounts }),
    });
    pinnedReport.linkToReportBuilder = `/signals/analytics?${report.query_string}&report=${pinnedReportId}`;
  } else {
    pinnedReport.name = defaultReportName;
    pinnedReport.options = reportOptionsWithDates({
      timezone: getLocalTimezone(),
      metrics: summaryReportOptions.metrics,
      comparisons: [],
      relativeRange: '7days',
      precision: 'hour',
      isReady: true,
      filters: hydrateFilters(summaryReportOptions.filters, { subaccounts }),
    });
    pinnedReport.linkToReportBuilder = `/signals/analytics?${summaryReportQueryString}`;
  }

  return { pinnedReport };
}
