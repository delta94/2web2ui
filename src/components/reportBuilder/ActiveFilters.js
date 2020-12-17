import React from 'react';
import _ from 'lodash';
import { Box, Inline, Tag, Text } from 'src/components/matchbox';
import { Comparison, Emphasized } from 'src/components/text';
import {
  getIterableFormattedGroupings,
  getActiveFilterTagGroups,
} from 'src/pages/reportBuilder/helpers';

export default function ActiveFilters({ filters, handleFilterRemove }) {
  const iterableGroupings = getIterableFormattedGroupings(filters);
  const groupings = getActiveFilterTagGroups(iterableGroupings);

  // TODO: Once `Inline` supports the `data-id` prop, extra <div> elements with `data-id` will no longer needed.
  // Matchbox issue: https://github.com/SparkPost/matchbox/issues/661

  return (
    <div data-id="active-filter-tags">
      <Inline space="200">
        {groupings.map((grouping, groupingIndex) => {
          return (
            <div data-id="active-filter-group" key={`active-filter-tag-${groupingIndex}`}>
              <Inline
                key={`grouping-${groupingIndex}`}
                as="span"
                display="inline-flex"
                paddingY="100"
                paddingX="200"
                backgroundColor="gray.100"
                space="0"
              >
                <span aria-hidden="true">[</span>
                {grouping.filters.map((filter, filterIndex) => {
                  return (
                    <Box
                      key={`filter-${groupingIndex}-${filterIndex}`}
                      paddingY="100"
                      paddingX="100"
                      data-id="active-filter"
                    >
                      <Inline as="span" space="200">
                        <Text fontSize="200" as="span">
                          {filter.label}
                        </Text>

                        <Text fontWeight="500" as="span" fontSize="200">
                          <Emphasized>{filter.compareBy}</Emphasized>
                        </Text>

                        {filter.values.map((rawValue, valueIndex) => {
                          // Some values are objects when returned from the typeahead, others are just strings
                          const value = typeof rawValue === 'object' ? rawValue.value : rawValue;
                          // The remove method is not always present - conditionally rendering the remove button on the relevant `<Tag />`
                          const onRemoveFn = handleFilterRemove
                            ? () => handleFilterRemove({ groupingIndex, filterIndex, valueIndex })
                            : undefined;

                          return (
                            <Tag
                              key={`tag-${groupingIndex}-${filterIndex}-${valueIndex}`}
                              onRemove={onRemoveFn}
                            >
                              {value}
                            </Tag>
                          );
                        })}

                        {filter.hasComparisonBetweenFilters ? (
                          <Box marginX="200">
                            <Comparison>{grouping.type}</Comparison>
                          </Box>
                        ) : null}
                      </Inline>
                    </Box>
                  );
                })}
                <span aria-hidden="true">]</span>

                {grouping.hasAndBetweenGroups ? (
                  <Box marginX="200">
                    <Comparison>And</Comparison>
                  </Box>
                ) : null}
              </Inline>
            </div>
          );
        })}
      </Inline>
    </div>
  );
}
