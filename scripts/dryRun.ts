(async ()=>{
  try{
    const m = await import('../app/api/ai/generate/route')
    const POST = (m as any).default?.POST || (m as any).POST
    if(!POST) throw new Error('POST not found')

    const req = new Request('http://local/api/ai/generate',{
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ imageUrl:'https://example.com/wireframe.png', model:'Auto', allowFallback:true })
    })

    const res = await POST(req)
    const json = await res.json()
    console.log('Generate route response:', JSON.stringify(json, null, 2))

    const admin = await import('../app/api/admin/provider-logs/route')
    const GET = (admin as any).default?.GET || (admin as any).GET
    const adminReq = new Request('http://local/api/admin/provider-logs', { method:'GET', headers: { 'x-admin-key': process.env.ADMIN_API_KEY || '' }})
    const adminRes = await GET(adminReq)
    const adminJson = await adminRes.json()
    console.log('Admin logs:', JSON.stringify(adminJson, null, 2))
  }catch(e){
    console.error('Dry run error:', e)
    process.exit(1)
  }
})()
