import { translate } from '../../../hooks/translate'

const invoiceHighlights = [
  {
    title: translate('INVOICES.ALL_INVOICES'),
    type: 'number',
    value: 28382,
    percentage: 3.71,
  },
  {
    title: translate('INVOICES.LATE_INVOICES'),
    type: 'money',
    value: 73535.32,
    percentage: -2.98,
    decimals: 2,
  },
  {
    title: translate('INVOICES.OPEN_INVOICES'),
    type: 'money',
    value: 37463.46,
    percentage: 9.82,
    decimals: 2,
  },
  {
    title: translate('INVOICES.INVOICES_RECEIVED'),
    type: 'money',
    value: 635356.87,
    percentage: 1.54,
    decimals: 2,
  },
]

const headers = [
  { name: translate('INVOICES.INVOICE_ID'), dataType: 'text' },
  { name: 'Status', dataType: 'option', width: 120 },
  { name: translate('UI.DATE'), dataType: 'date', width: 120 },
  { name: translate('ECOMMERCE.CLIENT'), dataType: 'option', width: 250 },
  { name: translate('UI.TOTAL'), dataType: 'between' },
  { name: translate('INVOICES.AMOUNT_DUE'), dataType: 'between' },
]

const statusMap = {
  0: { label: translate('INVOICES.PROCESSING'), type: 'warning-subtle' },
  1: { label: translate('INVOICES.APPROVED'), type: 'success-subtle' },
  2: { label: translate('INVOICES.DISAPPROVED'), type: 'danger-subtle' },
}

const invoiceItems = [
  {
    name: 'Design landing page',
    amount: 1500.0,
    quantity: 1,
  },
  {
    name: 'Development PHP Aplication',
    amount: 87328.82,
    quantity: 1,
  },
  {
    name: 'Design landing page',
    amount: 1500.0,
    quantity: 1,
  },
  {
    name: 'Development PHP Aplication',
    amount: 87328.82,
    quantity: 1,
  },
]

export { invoiceHighlights, headers, statusMap, invoiceItems }
