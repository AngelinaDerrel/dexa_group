import { Component } from 'react'

function ErrorFallback({ error }) {
  return (
    <main style={{ padding: 32, fontFamily: 'system-ui', color: '#8d1728' }}>
      <h1>Aplikasi gagal dimuat</h1>
      <p>{error.message}</p>
      <p>Silakan refresh halaman atau jalankan ulang Vite dari folder dexagroup.</p>
    </main>
  )
}

export default class AppErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    return this.state.error ? <ErrorFallback error={this.state.error} /> : this.props.children
  }
}
