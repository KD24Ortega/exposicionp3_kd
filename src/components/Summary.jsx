import { formatMoney } from '../utils/money.js'

export default function Summary({ items, moneyConfig }) {
  const income = items.filter(x=>x.type==='INCOME').reduce((a,b)=>a+b.amount,0)
  const expense = items.filter(x=>x.type==='EXPENSE').reduce((a,b)=>a+b.amount,0)
  const balance = income - expense

  return (
    <div className="row g-2">
      <div className="col-12 col-md-4">
        <Card title="Ingresos" value={formatMoney(income, moneyConfig)} variant="success" />
      </div>
      <div className="col-12 col-md-4">
        <Card title="Gastos" value={formatMoney(expense, moneyConfig)} variant="danger" />
      </div>
      <div className="col-12 col-md-4">
        <Card title="Balance" value={formatMoney(balance, moneyConfig)} variant={balance >= 0 ? 'primary' : 'warning'} />
      </div>
    </div>
  )
}

function Card({ title, value, variant }) {
  return (
    <div className={'card border-' + variant}>
      <div className="card-body">
        <div className="text-body-secondary">{title}</div>
        <div className="fs-4 fw-semibold">{value}</div>
      </div>
    </div>
  )
}
