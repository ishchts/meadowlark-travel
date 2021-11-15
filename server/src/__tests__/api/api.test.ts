import fetch from "node-fetch";

const baseUrl = 'http://localhost:3000';

const _fetch = async (method: string, path: string, body?: string | object) => {
  body = typeof body === 'string' ? body : JSON.stringify(body)
  const headers = { 'Content-Type': 'application/json' }
  const res = await fetch(baseUrl + path, { method, body, headers })
  if(res.status < 200 || res.status > 299)
    throw new Error(`API вернул состояние ${res.status}`)
  return res.json()
}

describe('api test', () => {
  test('GET /api/vacations', async () => {
    const vacations: any = await _fetch('get', '/api/vacations');

    expect(vacations.length).not.toBe(0);

    const [vacation] = vacations;

    expect(vacation.name).toMatch(/\w/);

    expect(typeof vacation.price).toBe('number');

  });

  test('GET /api/vacation/:sku', async() => {
    const vacations: any = await _fetch('get', '/api/vacations')
    expect(vacations.length).not.toBe(0)
    const vacation0 = vacations[0]
    const vacation: any = await _fetch('get', '/api/vacation/' + vacation0.sku)
    expect(vacation.name).toBe(vacation0.name)
  });


  test('POST /api/vacation/:sku/notify-when-in-season', async() => {
    const vacations: any = await _fetch('get', '/api/vacations')
    expect(vacations.length).not.toBe(0)
    const vacation0 = vacations[0]
    // На данный момент все, что можно сделать, – удостовериться,
    // что HTTP-запрос был успешным.
    await _fetch('post', `/api/vacation/${vacation0.sku}/notify-when-in-season`,
      { email: 'test@meadowlarktravel.com' })
  });

  test('DELETE /api/vacation/:id', async() => {
    const vacations: any = await _fetch('get', '/api/vacations')
    expect(vacations.length).not.toBe(0)
    const vacation0 = vacations[0]
    // На данный момент все, что можно сделать, — удостовериться,
    // что HTTP-запрос был успешным.
    await _fetch('delete', `/api/vacation/${vacation0.sku}`)
  })
})