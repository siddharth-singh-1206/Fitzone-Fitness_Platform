import React, { createContext, useContext, useState } from 'react'
import FreePassModal from '../components/FreePassModal'

const PassModalContext = createContext(null)

export function PassModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openPassModal = () => setIsOpen(true)
  const closePassModal = () => setIsOpen(false)

  return (
    <PassModalContext.Provider value={{ isOpen, openPassModal, closePassModal }}>
      {children}
      <FreePassModal isOpen={isOpen} onClose={closePassModal} />
    </PassModalContext.Provider>
  )
}

export function useFreePass() {
  const ctx = useContext(PassModalContext)
  if (!ctx) {
    throw new Error('useFreePass must be used within a PassModalProvider')
  }
  return ctx
}

export const usePassModal = useFreePass

export default PassModalContext
