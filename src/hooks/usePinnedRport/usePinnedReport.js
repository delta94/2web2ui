import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRelativeDates, getLocalTimezone } from 'src/helpers/date';
import { parseSearchNew as parseSearch } from 'src/helpers/reports';
import { hydrateFilters } from 'src/pages/reportBuilder/helpers';
import { PRESET_REPORT_CONFIGS } from 'src/pages/reportBuilder/constants/presetReport';
import _ from 'lodash';
import qs from 'qs';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { getReports } from 'src/actions/reports';

const defaultReportName = 'Summary Report';

// TODO: change args to (pinnedReportId, onboarding)
export default function usePinnedReport(onboarding) {
  const pinnedReport = { options: {}, name: '', linkToReportBuilder: '/' };
  const excludeOptionsFromLink = ['isReady'];
  const dispatch = useDispatch();
  const reports = useSelector(state => state.reports.list);
  const subaccounts = useSelector(state => state.subaccounts.list);
  const pinnedReportId = null; // TODO: change args to (pinnedReportId, onboarding)

  useEffect(() => {
    if (onboarding === 'done') {
      dispatch(listSubaccounts());
      dispatch(getReports());
    }
  }, [dispatch, onboarding]);

  const getLinktoReportBuilder = newParams => {
    const queryString = qs.stringify(newParams, {
      arrayFormat: 'repeat',
    });
    return `/signals/analytics?${queryString}`;
  };

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

  const report = _.find(reports, { id: pinnedReportId });

  if (report) {
    const options = parseSearch(report.query_string);
    pinnedReport.name = report.name;
    pinnedReport.options = reportOptionsWithDates({
      timezone: getLocalTimezone(),
      metrics: options.metrics,
      comparisons: [],
      relativeRange: '7days',
      precision: 'hour',
      isReady: true,
      filters: hydrateFilters(options.filters, { subaccounts }),
    });
    pinnedReport.linkToReportBuilder = getLinktoReportBuilder(
      _.omitBy(pinnedReport.options, (_value, key) => excludeOptionsFromLink.includes(key)),
    );
  } else {
    let summaryReportOptions = parseSearch(
      PRESET_REPORT_CONFIGS.find(x => x.name === defaultReportName).query_string,
    );
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
    pinnedReport.linkToReportBuilder = getLinktoReportBuilder(
      _.omitBy(pinnedReport.options, (_value, key) => excludeOptionsFromLink.includes(key)),
    );
  }

  return { pinnedReport };
}
