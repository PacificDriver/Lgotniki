import React, { useState, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmailContext } from '../../../../../contexts/email'

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
} from '../../../../../components/BaseUI/Dropdown'
import Pagination from '../../../../../components/BaseUI/Pagination'
import Avatar from '../../../../../components/CustomUI/Avatar'
import IconButton from '../../../../../components/BaseUI/Button/IconButton'
import Checkbox from '../../../../../components/BaseUI/Checkbox'

import {
  MdOutlineRefresh,
  MdOutlineSettings,
  MdOutlineTune,
  MdArrowDropDown,
  MdAttachFile,
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineArchive,
  MdDeleteOutline,
  MdOutlineReport,
  MdBookmarkBorder,
  MdAccessTime,
} from 'react-icons/md'

import { FiSearch } from 'react-icons/fi'

import styles from './EmailListWeb.module.scss'
import { translate } from '../../../../../hooks/translate'

const dropdownActions = [
  { name: 'Todos' },
  { name: 'Nenhum' },
  { name: 'Lidas' },
  { name: 'Não lidas' },
]

const actions = {
  actions: [
    { icon: <MdOutlineArchive />, name: 'archive-email' },
    { icon: <MdOutlineReport />, name: 'archive-email' },
    { icon: <MdDeleteOutline />, name: 'delete-email' },
    { icon: <MdBookmarkBorder />, name: 'mark-as-important' },
    { icon: <MdAccessTime />, name: 'postpone-email' },
  ],
  search: [
    { icon: <MdOutlineRefresh />, name: 'reload-emails' },
    { icon: <FiSearch />, name: 'search-emails' },
  ],
  config: [
    { icon: <MdOutlineTune />, name: 'reload-emails' },
    { icon: <MdOutlineSettings />, name: 'search-emails' },
  ],
}

const Header = ({ totalItems, onPaginate }) => {
  const { allEmailsSelected, anyEmailSelected, markAllEmails } =
    useContext(EmailContext)
  const [pagination, setPagination] = useState({})

  const handlePagination = values => {
    onPaginate(values)
    setPagination(values)
  }

  return (
    <div className={styles['email-list-container__header']}>
      <div className="d-flex align-items-center gap-1">
        <div className="d-flex align-items-center">
          {/* <IconButton 
                    label='mark-all-emails'
                    // icon={ anyEmailSelected ? <MdOutlineIndeterminateCheckBox /> : allEmailsSelected ? <MdOutlineCheckBox /> : <MdCheckBoxOutlineBlank className={styles['email-list-container__header--mark-all-icon']} />}
                    icon={ <Checkbox size='small'/> }
                    shape='circle'
                    appearance='subtle'
                    className={styles['email-list-container__header--icons']}
                    onClick={(event) => markAllEmails(event, pagination)}
                /> */}

          <Checkbox
            size="small"
            onChange={({ event }) => markAllEmails(event, pagination)}
          />

          <Dropdown
            trigger={
              <IconButton
                label="arrow-dropdown"
                icon={
                  <MdArrowDropDown
                    className={styles['email-list-container__header--icons']}
                  />
                }
                shape="circle"
                appearance="subtle"
              />
            }
            placement="bottom"
            triggerClassName={
              styles['email-list-container__header--checkbox-selector']
            }
            hideDropdownIcon
          >
            <DropdownContent>
              {dropdownActions.map((action, index) => (
                <DropdownItem key={index}>{action.name}</DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        <div className="d-flex align-items-center gap-1">
          {(allEmailsSelected || anyEmailSelected
            ? actions?.actions
            : actions?.search
          )?.map(({ icon, name }, index) => (
            <IconButton
              key={index}
              label={name}
              icon={icon}
              shape="circle"
              appearance="subtle"
              className={styles['email-list-container__header--icons']}
            />
          ))}
        </div>
      </div>

      <div className="d-flex align-items-center gap-1">
        <Pagination
          options={{
            skipPrevious: false,
            skipNext: false,
            selectQuantity: false,
          }}
          totalPerPage={15}
          totalItems={totalItems}
          onPageChange={({ pagination }) => handlePagination(pagination)}
        />

        <div className="d-flex align-items-center gap-1">
          {actions?.config?.map(({ icon, name }, index) => (
            <IconButton
              key={index}
              label={name}
              icon={icon}
              shape="circle"
              appearance="subtle"
              className={styles['email-list-container__header--icons']}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function EmailListWeb() {
  const [pagination, setPagination] = useState({})
  const navigate = useNavigate()

  const {
    emails,
    handleEmailClick,
    formatDate,
    toggleStarredEmail,
    toggleSelectEmail,
  } = useContext(EmailContext)

  const emailsFiltered = useMemo(() => {
    const endOffset = pagination?.offset + pagination?.itemsPerPage

    return emails?.slice(pagination.offset, endOffset)
  }, [pagination, emails])

  const getSenderName = name => {
    return name?.length > 17 ? name?.slice(0, 17) + '.' : name
  }

  return (
    <div className={styles['email-list-container']}>
      <Header
        onPaginate={pagination => setPagination({ ...pagination })}
        totalItems={emails?.length}
      />

      <div className={styles['email-list-container__content']}>
        {emailsFiltered?.map((email, index) => (
          <div
            key={index}
            className={`${styles['email-list-container__content__items']} ${!email?.status?.read && styles['email-list-container__content__items--unread']} ${email?.status?.selected && styles['email-list-container__content__items--selected']}`}
            onClick={() => {
              handleEmailClick(email?.id)
              navigate(`/dashboard/emails/${email?.uuid}`)
            }}
          >
            <div
              className={styles['email-list-container__content__items--info']}
            >
              <span
                className={
                  styles['email-list-container__content__items--info--icons']
                }
                onClick={event => toggleSelectEmail(event, email?.id)}
              >
                <Checkbox
                  size="small"
                  isChecked={email?.status?.selected ? true : false}
                />
              </span>

              <span
                className={
                  styles['email-list-container__content__items--info--icons']
                }
                onClick={event => toggleStarredEmail(event, email?.id)}
              >
                {email?.status.starred ? (
                  <MdOutlineStar
                    className={
                      styles[
                        'email-list-container__content__items--info--icons--starred'
                      ]
                    }
                  />
                ) : (
                  <MdOutlineStarBorder />
                )}
              </span>

              <div
                className={
                  styles['email-list-container__content__items--info--user']
                }
              >
                <Avatar src={email?.sender?.image} name={email?.sender?.name} />

                <span
                  className={
                    styles[
                      'email-list-container__content__items--info--user--name'
                    ]
                  }
                >
                  {getSenderName(email?.sender?.name)}
                </span>
              </div>
            </div>

            <div
              className={
                styles['email-list-container__content__items--content']
              }
            >
              <span
                className={
                  styles[
                    'email-list-container__content__items--content--subject'
                  ]
                }
              >
                {email.subject}
              </span>
              <span
                className={
                  styles[
                    'email-list-container__content__items--content--message'
                  ]
                }
              >
                {email.message}
              </span>
            </div>

            <div
              className={styles['email-list-container__content__items--date']}
            >
              {email?.attachments?.length > 0 && (
                <MdAttachFile
                  className={
                    styles[
                      'email-list-container__content__items--date--attachments'
                    ]
                  }
                />
              )}
              {formatDate(email?.date)}
            </div>
          </div>
        ))}

        {!emailsFiltered?.length && (
          <div className={styles['email-list-container__content__no-data']}>
            <span
              className={
                styles['email-list-container__content__no-data--message']
              }
            >
              {translate('EMAIL.NO_DATA')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
