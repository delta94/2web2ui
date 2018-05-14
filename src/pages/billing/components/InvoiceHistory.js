import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Button } from '@sparkpost/matchbox';
import { TableCollection } from 'src/components';
import { formatDate } from 'src/helpers/date';
import { get as getInvoice, list as getInvoices } from 'src/actions/invoices';
import { showAlert } from 'src/actions/globalAlert';


//use showalert for errors

const columns = [
  'Date',
  'Amount',
  'Invoice Number',
  null
];


const formatCurrency = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export class InvoiceHistory extends Component {
  state = {
    invoiceNumber: null
  };

  componentDidMount () {
    this.props.getInvoices();
  }

  getRowData = ({ status, date, amount, invoice_number: invoiceNumber, id }) => {
    // const { invoiceLoading, invoiceId } = this.props;
    const { invoiceLoading } = this.props;
    const { invoiceId } = this.state;
    const thisInvoiceLoading = (id === invoiceId);
    return ([
      formatDate(date),
      formatCurrency(amount),
      invoiceNumber,
      <div style={{ textAlign: 'right' }}>
        <Button plain size='small' type='submit' disabled={invoiceLoading}
          onClick={() => this.getInvoice(id, invoiceNumber)}>
          {thisInvoiceLoading ? 'Downloading...' : 'Download'}
        </Button>
      </div>
    ]);
  }
  ;

  getInvoice = (id, invoiceNumber) => {
    this.setState({ invoiceNumber, invoiceId: id });
    this.props.getInvoice(id);
  };

  componentDidUpdate (prevProps) {
    const { invoice, listError, getError, showAlert, invoiceLoading } = this.props;
    const { invoiceNumber } = this.state;

    if (prevProps.invoiceLoading && !invoiceLoading) {
      this.setState({ invoiceId: null });
      return;
    }

    if (listError) {
      showAlert({ type: 'error', message: 'Error getting invoices' });
    }

    if (getError) {
      showAlert({ type: 'error', message: 'Error downloading invoice' });
    }

    if (!prevProps.invoice && invoice) {
      const url = URL.createObjectURL(invoice);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sparkpost-invoice-${invoiceNumber}.pdf`);
      link.click();
    }

  }

  render () {
    const { invoices, invoicesLoading } = this.props;

    if (invoicesLoading || (invoices.length < 1)) {
      return null;
    }

    // Perhaps need a "amounts shown in USD" message somewhere?
    //
    const maxWarning = invoices.length === 20
      ? <Panel.Footer left={<p><small>Only your last 20 invoices are available to be viewed</small></p>} />
      : null;

    return (
      <Fragment>
        <Panel title='Invoice History'>
          <TableCollection rows={invoices} columns={columns} getRowData={this.getRowData} />
        </Panel>
        {maxWarning}
      </Fragment>
    );

  }

}

const mapStateToProps = (state) => ({
  invoices: state.invoices.list,
  invoicesLoading: state.invoices.invoicesLoading,
  invoice: state.invoices.invoice,
  invoiceLoading: state.invoices.invoiceLoading,
  invoiceId: state.invoices.invoiceId,
  listError: state.invoices.listError,
  getError: state.invoices.getError
});

// In case 'status' & 'invoiceNumber' don't work out
// <Collection rows={invoices} rowComponent={Invoice}/>
// const Invoice = ({ date, amount, invoiceNumber }) => (
//   <Panel.Section actions={[{ content: 'Download' }]}>//
//     <h6 style={{ marginBottom: 0 }}><strong>{formatCurrency(amount)}</strong></h6>
//     <small>{formatDate(date)}</small>
//   </Panel.Section>
// );

export default connect(mapStateToProps, { getInvoices, getInvoice, showAlert })(InvoiceHistory);
