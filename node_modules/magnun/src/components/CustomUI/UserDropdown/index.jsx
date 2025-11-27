import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../../services/useAuth'

import { Dropdown, DropdownContent, DropdownItem } from '../../BaseUI/Dropdown'
import Avatar from '../Avatar'

import {
  MdOutlineAccountCircle,
  MdOutlineAdminPanelSettings,
  MdOutlineContactSupport,
} from 'react-icons/md'

import './style.scss'

export default function UserDropdown({ user }) {
  const navigate = useNavigate()

  const { logout } = useAuth()

  const sigout = () => {
    if (logout()) navigate('/login', { replace: true })
  }

  return (
    <div className="user-container">
      <Dropdown
        trigger={
          <Avatar
            src={user?.image || require('../../../assets/users/carolina.avif')}
          />
        }
        placement="right"
        hideDropdownIcon
        triggerClassName="u-pointer"
      >
        <DropdownContent className="user-container__content-dropdown">
          <div className="user-container__infos">
            <Avatar
              src={
                user?.image || require('../../../assets/users/carolina.avif')
              }
            />

            <div className="user-container__infos__info">
              <span>Carolina Ferreira</span>
              <span>ferreira.carol@email.com</span>
            </div>
          </div>

          <DropdownItem onClick={() => navigate('/dashboard/account/profile')}>
            <MdOutlineAccountCircle />
            <span className="user-container__content-dropdown__label">
              My Profile
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => navigate('/dashboard/account/settings')}>
            <MdOutlineAdminPanelSettings />
            <span className="user-container__content-dropdown__label">
              Account Settings
            </span>
          </DropdownItem>
          <DropdownItem>
            <Link to="/support" target="_blank">
              <MdOutlineContactSupport />
              <span className="user-container__content-dropdown__label">
                Support
              </span>
            </Link>
          </DropdownItem>

          <div className="user-container__content-dropdown__logout">
            <button
              className="user-container__content-dropdown__logout__button"
              onClick={() => sigout()}
            >
              Log out
            </button>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )
}
