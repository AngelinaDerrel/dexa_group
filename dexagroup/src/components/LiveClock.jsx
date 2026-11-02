import { useEffect, useState } from 'react'

export default function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer) }, [])
  return <div className="clock-box"><small>WAKTU SAAT INI</small><div className="clock">{now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div><div className="date-text">{now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
}
