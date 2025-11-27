import React from 'react'
import ReactDOM from 'react-dom/client'
import { Modal, ModalBody, ModalHeader } from '../components/BaseUI/Modal'
import ButtonGroup from '../components/BaseUI/ButtonGroup'
import Button from '../components/BaseUI/Button'

import { PiWarningDiamondFill } from 'react-icons/pi'
import { RiErrorWarningFill } from 'react-icons/ri'

export const useModalConfirm = ({
  title = '',
  message = '',
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  appearance = 'primary', // primary, warning, danger
}) => {
  const modalDiv = document.createElement('div')
  document.body.appendChild(modalDiv)

  const root = ReactDOM.createRoot(modalDiv)

  const icons = {
    primary: '',
    warning: (
      <PiWarningDiamondFill style={{ color: '#F5CD47', fontSize: '20px' }} />
    ),
    danger: (
      <RiErrorWarningFill style={{ color: '#CA371C', fontSize: '20px' }} />
    ),
  }

  const handleConfirm = () => {
    onConfirm?.()
    cleanup()
  }

  const handleCancel = () => {
    onCancel?.()
    cleanup()
  }

  const cleanup = () => {
    root.unmount()
    document.body.removeChild(modalDiv)
  }

  const ModalComponent = (
    <Modal isOpen={true} width="small">
      <ModalHeader>
        <div className="d-flex align-items-center gap-1">
          {icons[appearance]}

          <span
            className="d-flex"
            style={{ fontWeight: 500, fontSize: '15px' }}
          >
            {title}
          </span>
        </div>
      </ModalHeader>
      <ModalBody>
        <p className="sub-title-page">{message}</p>
        <div className="my-3">
          <ButtonGroup placement="end" reverse>
            <Button appearance={appearance} onClick={handleConfirm}>
              {confirmButtonText}
            </Button>
            <Button appearance="subtle" onClick={handleCancel}>
              {cancelButtonText}
            </Button>
          </ButtonGroup>
        </div>
      </ModalBody>
    </Modal>
  )

  root.render(ModalComponent)
}
