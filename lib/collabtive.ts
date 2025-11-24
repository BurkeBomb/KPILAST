export async function pushTask(endpoint:string, token:string, payload:any){
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type':'application/json', 'authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e:any){
    return { ok:false, error: e?.message || 'Network error' };
  }
}
