import React, { useState, useEffect } from "react";


export type TVacation = {
  name: string;
  description: string;
  sku: number;
  price: number;
  inSeason: boolean;
}

export type VacationProps = {
  vacation: TVacation
}

export type NotifyWhenInSeasonProps = {
  sku: number;
}


export const Vacation: React.FC<VacationProps> = ({vacation}) => {
  return (
    <div>
      <h3>{vacation.name}</h3>
      <p>{vacation.description}</p>
      <span className="price">{vacation.price}</span>
      {!vacation.inSeason && (
        <div>
          <p><i>Этот тур временно вне сезона.</i></p>
          <NotifyWhenInSeason sku={vacation.sku} />
        </div>
      )}
    </div>
  )
}
export const NotifyWhenInSeason: React.FC<NotifyWhenInSeasonProps> = ({ sku }) => {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/vacation/${sku}/notify-when-in-season`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    if(res.status < 200 || res.status > 299) {
      return alert('Возникли проблемы… пожалуйста, попробуйте еще раз.')
    }

    setRegisteredEmail(email)
  }

  if(registeredEmail) {
    return (
      <i>Вам придет уведомление на {registeredEmail}, когда
        начнется сезон на этот тур!</i>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <i>Уведомить меня, когда начнется сезон на этот тур:</i>
      <input
        type="email"
        placeholder="(ваш email)"
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
      />
      <button>OK</button>
    </form>
  )
}

export const Vacations: React.FC = () => {
  const [vacations, setVacations] = useState<TVacation[]>([])

  useEffect(() => {
    fetch('api/vacations')
      .then((res) => res.json())
      .then((res) => setVacations(res))
      .catch((err) => {
        console.log('err', err);
        console.log('err', err.response);
      })
  }, []);
  console.log('vacations', vacations);
  return (
    <>
      <h2>Туры</h2>
      <div className="vacations">
        {vacations.map(vacation =>
          <Vacation key={vacation.sku} vacation={vacation} />
        )}
      </div>
    </>
  )
}