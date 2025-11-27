const headers = [
  { name: 'Invoice', width: 200 },
  { name: 'Billing Date', width: 200 },
  { name: 'Plan', width: 200 },
  { name: 'Amount', width: 200 },
  { name: 'Status', width: 200 },
]

const invoices = [
  {
    id: '#234562',
    billingDate: '2023-01-23 00:00:00',
    plan: 'Basic Plan',
    amount: 1200,
    status: 'Paid',
  },
  {
    id: '#564891',
    billingDate: '2023-02-23 00:00:00',
    plan: 'Pro Plan',
    amount: 7000,
    status: 'Paid',
  },
  {
    id: '#564894',
    billingDate: '2023-03-23 00:00:00',
    plan: 'Pro Plan',
    amount: 7000,
    status: 'Paid',
  },
  {
    id: '#983807',
    billingDate: '2023-04-23 00:00:00',
    plan: 'Growth Plan',
    amount: 5698,
    status: 'Paid',
  },
  {
    id: '#903948',
    billingDate: '2023-05-23 00:00:00',
    plan: 'Basic Plan',
    amount: 1200,
    status: 'Pending',
  },
  {
    id: '#929348',
    billingDate: '2023-06-23 00:00:00',
    plan: 'Growth Plan',
    amount: 1200,
    status: 'Paid',
  },
  {
    id: '#102340',
    billingDate: '2023-07-23 00:00:00',
    plan: 'Pro Plan',
    amount: 4500,
    status: 'Paid',
  },
  {
    id: '#102356',
    billingDate: '2023-08-23 00:00:00',
    plan: 'Basic Plan',
    amount: 2000,
    status: 'Paid',
  },
]

export { headers, invoices }
