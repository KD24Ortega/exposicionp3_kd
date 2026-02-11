import { useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

export default function PwaUpdater() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  const updateSWRef = useRef(null)

  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    updateSWRef.current = registerSW({
      immediate: true,
      onOfflineReady() {
        setOfflineReady(true)
      },
      onNeedRefresh() {
        setNeedRefresh(true)
      }
    })

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function installApp() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setCanInstall(false)
  }

  function refreshApp() {
    if (updateSWRef.current) updateSWRef.current(true)
  }

  return (
    <div className="d-grid gap-2">
      {offlineReady && (
        <div className="alert alert-success d-flex justify-content-between align-items-center gap-2 flex-wrap mb-0" role="alert">
          <div>✅ Lista para usarse sin conexión.</div>
          <button type="button" onClick={() => setOfflineReady(false)} className="btn btn-sm btn-outline-success">
            OK
          </button>
        </div>
      )}

      {needRefresh && (
        <div className="alert alert-primary d-flex justify-content-between align-items-center gap-2 flex-wrap mb-0" role="alert">
          <div>🔄 Hay una nueva versión disponible.</div>
          <button type="button" onClick={refreshApp} className="btn btn-sm btn-outline-primary">
            Actualizar
          </button>
        </div>
      )}

      {canInstall && (
        <div className="alert alert-info d-flex justify-content-between align-items-center gap-2 flex-wrap mb-0" role="alert">
          <div>📲 Puedes instalar la app.</div>
          <button type="button" onClick={installApp} className="btn btn-sm btn-outline-info">
            Instalar
          </button>
        </div>
      )}
    </div>
  )
}
