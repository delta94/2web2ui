import styled from 'styled-components';
import { ChevronRight } from '@sparkpost/matchbox-icons';

export const StyledFilterFields = styled.div`
  display: grid;
  grid-gap: ${props => props.theme.space['500']};
  grid-template-columns: 2fr auto 250px;

  @media (max-width: ${props => props.theme.breakpoints[1]}) {
    grid-template-columns: 1fr;
  }
`;

export const StyledGridCell = styled.div`
  width: 250px;
  justify-self: end;

  @media (max-width: ${props => props.theme.breakpoints[1]}) {
    justify-self: start;
  }
`;

export const StatusPopoverChevron = styled(ChevronRight)`
  color: ${props => props.theme.colors.blue['700']};
  position: absolute;
  right: ${props => props.theme.space['300']};
  transform: rotate(90deg);
`;

// Set width of text to prevent overflow and tweak style
// note, Button's color prop controls focus outline, hover background and text color, if color=grey is used
//   the focus outline doesn't match the rest of the filters, instead this is only going to override text color
// note, add padding to make space for absolute positioning of icon
// see, https://stackoverflow.com/a/37427386
export const StatusPopoverContent = styled.span`
  color: ${props => props.theme.colors.gray['800']};
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
  width: 100px;
  padding-right: ${props => props.theme.space['500']};
`;
