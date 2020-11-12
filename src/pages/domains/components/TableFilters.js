import React, { useState } from 'react';
import { Search } from '@sparkpost/matchbox-icons';
import {
  Box,
  Button,
  Checkbox,
  Popover,
  TextField,
  ScreenReaderOnly,
  Select,
  Label,
} from 'src/components/matchbox';
import { useUniqueId } from 'src/hooks';
import Divider from 'src/components/divider';
import { StyledFilterFields, StatusPopoverContent, StyledGridCell } from './styles';
import { ChevronRight } from '@sparkpost/matchbox-icons';
import styled from 'styled-components';

const Chevron = styled(ChevronRight)`
  color: ${props => props.theme.colors.blue['700']};
  transform: rotate(90deg);
`;

/* https://allyjs.io/tutorials/hiding-elements.html#how-to-hide-elements-visually */
const VisuallyHiddenBox = styled(Box)`
  position: absolute;

  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;

  white-space: nowrap;

  clip: rect(0 0 0 0);
  clip-path: inset(
    100%
  ); /* Added both since clip is deprecated now, but clip path isn't widely supported yet*/
  overflow: hidden;
`;

export function reducer(state, action) {
  switch (action.type) {
    case 'DOMAIN_FILTER_CHANGE': {
      return {
        ...state,
        domainName: action.value,
      };
    }

    case 'TOGGLE': {
      const isChecked = state.checkboxes.find(filter => filter.name === action.name).isChecked;

      if (action.name === 'selectAll' && !isChecked) {
        /* if Select All is Checked then all checkboxes should be checked */
        return {
          ...state,
          checkboxes: state.checkboxes.map(filter => {
            return {
              ...filter,
              isChecked: true,
            };
          }),
        };
      }

      return {
        ...state,
        // Return the relevant checked box and update its checked state,
        // otherwise, return any other checkbox.
        checkboxes: state.checkboxes.map(filter => {
          if (filter.name === action.name) {
            return {
              ...filter,
              isChecked: !isChecked,
            };
          }

          return filter;
        }),
      };
    }

    case 'LOAD': {
      const checkboxes = state.checkboxes.map(filter => {
        const isChecked = action.names.indexOf(filter.name) >= 0;

        return {
          ...filter,
          isChecked: isChecked,
        };
      });

      return {
        ...state,
        domainName: action.domainName,
        checkboxes,
      };
    }

    case 'RESET':
      return action.state;

    default:
      throw new Error(`${action.type} is not supported.`);
  }
}

function DomainField({ onChange, value, disabled }) {
  const uniqueId = useUniqueId('domains-name-filter');

  return (
    <TextField
      id={uniqueId}
      label="Filter Domains"
      prefix={<Search />}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
}

function SortSelect({ options, onChange, disabled }) {
  const uniqueId = useUniqueId('domains-sort-select');

  return (
    <StyledGridCell>
      <Select
        id={uniqueId}
        label="Sort By"
        options={options}
        onChange={onChange}
        disabled={disabled}
      />
    </StyledGridCell>
  );
}

function StatusPopover({ checkboxes, onCheckboxChange, disabled }) {
  const uniqueId = useUniqueId('domains-status-filter');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.isChecked);
  const hasCheckedCheckboxes = checkedCheckboxes?.length > 0;

  return (
    <Box>
      <Label label="Domain Status" />
      <Popover
        left
        id={uniqueId}
        open={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        trigger={
          <Button
            outline
            variant="monochrome"
            aria-expanded={isPopoverOpen}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            disabled={disabled}
          >
            {/* This content is purely visual and is not exposed to screen readers, rather, "Domain Status" is always exposed for those users */}
            <StatusPopoverContent aria-hidden="true">
              {/* Render the checked filters that visually replace the button's content */}
              {hasCheckedCheckboxes ? (
                checkedCheckboxes.map((checkbox, index) => (
                  <span key={`${checkbox.name}-${index}`}>{checkbox.label}&nbsp;</span>
                ))
              ) : (
                <span>Domain Status</span>
              )}
            </StatusPopoverContent>

            <ScreenReaderOnly>Domain Status</ScreenReaderOnly>
            <Button.Icon as={Chevron} ml="100" size={25} />
          </Button>
        }
      >
        <Box padding="300">
          <Checkbox
            key="select-all"
            label="Select All"
            id="select-all"
            name="selectAll"
            onChange={onCheckboxChange}
            checked={checkboxes.find(filter => filter.name === 'selectAll').isChecked}
          />
        </Box>
        <Divider />
        <Box padding="300">
          <Checkbox.Group label="Status Filters" labelHidden>
            {checkboxes
              .filter(filter => filter.name !== 'selectAll')
              .map((filter, index) => (
                <Checkbox
                  key={`${filter.name}-${index}`}
                  label={filter.label}
                  id={filter.name}
                  name={filter.name}
                  onChange={onCheckboxChange}
                  checked={filter.isChecked}
                />
              ))}
          </Checkbox.Group>
        </Box>

        <Divider />

        <VisuallyHiddenBox padding="300" display="flex" justifyContent="flex-end">
          <Button variant="primary" size="small" onClick={() => setIsPopoverOpen(false)}>
            Apply
          </Button>
        </VisuallyHiddenBox>
      </Popover>
    </Box>
  );
}

function TableFilters({ children }) {
  return <StyledFilterFields>{children}</StyledFilterFields>;
}

DomainField.dispayName = 'TableFilters.DomainField';
SortSelect.displayName = 'TableFilters.SortSelect';
StatusPopover.displayName = 'TableFilters.StatusPopover';
TableFilters.DomainField = DomainField;
TableFilters.SortSelect = SortSelect;
TableFilters.StatusPopover = StatusPopover;

export default TableFilters;
