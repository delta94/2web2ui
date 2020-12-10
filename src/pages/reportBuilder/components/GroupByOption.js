import React, { useState } from 'react';
import styles from './ReportTable.module.scss';
import useUniqueId from 'src/hooks/useUniqueId';
import { Box, Grid, Checkbox, Select } from 'src/components/matchbox';
import { GROUP_BY_CONFIG } from '../constants';

export default function GroupByOption(props) {
  const { disabled, groupBy, hasSubaccounts, onChange } = props;
  const selectId = useUniqueId('break-down-by');
  const [topDomainsOnly, setTopDomainsOnly] = useState(true);

  const handleGroupChange = event => {
    if (event.target.value === 'placeholder') {
      return; // do nothing
    }

    onChange(event.target.value);
  };

  const handleDomainsCheckboxChange = () => {
    const nextState = !topDomainsOnly;

    setTopDomainsOnly(nextState);
    onChange(nextState ? 'watched-domain' : 'domain');
  };

  const getSelectOptions = () => {
    const filteredOptionsKeys = Object.keys(GROUP_BY_CONFIG).filter(key => {
      return !(
        (key === 'subaccount' && !hasSubaccounts) ||
        (key === 'domain' && topDomainsOnly) ||
        (key === 'watched-domain' && !topDomainsOnly)
      );
    });

    const options = filteredOptionsKeys.map(key => ({
      value: key,
      label: GROUP_BY_CONFIG[key].label,
    }));

    return options;
  };

  const renderDomainsCheckbox = () => {
    //Only show 'Top Domains Only' checkbox when on the recipient domains grouping
    if (groupBy !== 'watched-domain' && groupBy !== 'domain') {
      return null;
    }

    return (
      <Box marginTop="500" className={styles.TopDomainsCheckbox}>
        <Checkbox
          id="watchedDomains"
          label="Top Domains Only"
          checked={topDomainsOnly}
          onChange={handleDomainsCheckboxChange}
          disabled={disabled}
        />
      </Box>
    );
  };

  return (
    <Grid>
      <Grid.Column xs={12} md={5} lg={4}>
        <Select
          label="Break Down By"
          id={selectId}
          options={getSelectOptions()}
          value={GROUP_BY_CONFIG[groupBy] ? groupBy : 'placeholder'}
          disabled={disabled}
          onChange={handleGroupChange}
          placeholder="Select Resource"
          placeholderValue="placeholder"
        />
      </Grid.Column>

      <Grid.Column xs={12} md={4} mdOffset={3} lg={3} lgOffset={5}>
        {renderDomainsCheckbox()}
      </Grid.Column>
    </Grid>
  );
}
