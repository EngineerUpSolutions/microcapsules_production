'use client'
import dynamic from 'next/dynamic'
const PrototypeView = dynamic(() => import('./PrototypeView.client'), { ssr: false })
export default function PrototypeViewWrapper() {
  return <PrototypeView />
}
