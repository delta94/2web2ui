import React, { Component } from 'react';
import { Button, Inline, Tooltip } from 'src/components/matchbox';
import { ContentCopy } from '@sparkpost/matchbox-icons';
import copy from 'copy-to-clipboard';

export default class CopyCodes extends Component {
  state = {
    copied: false,
  };
  timeout = null;

  copyToClipboard = () => {
    copy(this.props.codes.join('\n'));
    this.setState({ copied: true });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ copied: false }), 3000);
  };

  render() {
    const { copied } = this.state;

    return (
      <Tooltip dark content="Copied to clipboard!" disabled={!copied}>
        <Button variant="secondary" onClick={this.copyToClipboard}>
          <Inline space="100">
            <ContentCopy size={14} />
            Copy
          </Inline>
        </Button>
      </Tooltip>
    );
  }
}
