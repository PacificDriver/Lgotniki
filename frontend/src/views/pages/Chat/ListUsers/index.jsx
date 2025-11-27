import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useChat } from '../../../../hooks/useChat'
import { createHash } from '../../../../utils/utils'

import Button from '../../../../components/BaseUI/Button'
import IconButton from '../../../../components/BaseUI/Button/IconButton'
import Input from '../../../../components/BaseUI/Input'
import {
  Modal,
  ModalBody,
  ModalHeader,
} from '../../../../components/BaseUI/Modal'
import Select from '../../../../components/BaseUI/Select'
import Avatar from '../../../../components/CustomUI/Avatar'

import { FiSearch } from 'react-icons/fi'
import { RiEditBoxLine } from 'react-icons/ri'

import { translate } from '../../../../hooks/translate'
import styles from './ListUsers.module.scss'

export default function ListUsers() {
  const {
    chats,
    chatGroup,
    tabs,
    formatDate,
    users,
    addNewChat,
    handleChatSelection,
  } = useChat()
  const [openModal, setOpenModal] = useState(false)
  const [userSelected, setUserSelected] = useState()
  const [searchValue, setSearchValue] = useState('')

  const navigate = useNavigate()

  const handleSearch = useCallback(value => {
    setSearchValue(value.toLowerCase())
  }, [])

  const filteredChats = useMemo(() => {
    return chats.filter(
      chat =>
        chat?.user?.name?.toLowerCase().includes(searchValue) ||
        chat?.content?.message?.toLowerCase().includes(searchValue)
    )
  }, [chats, searchValue])

  const handleUserSelection = async () => {
    const chat = chats?.find(chat => chat?.user?.id === userSelected?.id)

    if (chat) {
      setOpenModal(false)
      navigate(`/dashboard/chat/${chat.uuid}`)
    } else {
      const data = {
        uuid: await createHash(),
        user: {
          id: userSelected?.id,
          name: userSelected?.name,
          image: userSelected?.image,
          active: userSelected?.active,
        },
        unread: 0,
        content: {},
        createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      }

      addNewChat(data).then(() => {
        setOpenModal(false)
        navigate(`/dashboard/chat/${data.uuid}`)
      })
    }
  }

  return (
    <div className={styles['list-users-container']}>
      <div className={styles['header']}>
        <Input
          type="text"
          placeholder="Search"
          iconBefore={
            <FiSearch style={{ fontSize: '18px', color: '#66718F' }} />
          }
          onChange={value => handleSearch(value)}
          className={styles['header__custom-input']}
          iconClassName={styles['header__custom-icon']}
        />

        <IconButton
          icon={<RiEditBoxLine style={{ fontSize: '18px' }} />}
          appearance="subtle"
          shape="circle"
          onClick={() => setOpenModal(true)}
          className={styles['header__new-chat']}
          size="medium"
        />
      </div>

      {tabs[0].active ? (
        <div className={styles['chats']}>
          {filteredChats.map((chat, index) => (
            <div
              key={index}
              className={`${styles['chats__list']} ${chat?.selected && styles['chats--selected']}`}
              onClick={() => handleChatSelection(chat?.uuid, index)}
            >
              <Avatar
                name={chat?.user?.name}
                src={chat?.user?.image}
                status={chat?.user?.active ? 'online' : 'offline'}
              />

              <div className={styles['chats__list__infos']}>
                <div
                  className={`${styles['info']} ${chat?.unread > 0 && styles['info--unread']}`}
                >
                  <span className={styles['info__name']}>
                    {chat?.user?.name}
                  </span>
                  <span className={styles['info__date']}>
                    {formatDate(chat?.content?.date)}
                  </span>
                </div>

                <div
                  className={`${styles['info']} ${chat?.unread > 0 && styles['info--unread']}`}
                >
                  <span className={styles['info__message']}>
                    {chat?.content?.message}
                  </span>
                  {chat?.unread > 0 && (
                    <span className={styles['info__count']}>
                      {chat?.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles['chats']}>
          {chatGroup.map((chat, index) => (
            <div key={index} className={`${styles['chats__list']}`}>
              <div className={styles['chats__list__icon']}>{chat.icon}</div>

              <div className={styles['chats__list__infos']}>
                <div className={styles['info']}>
                  <span className={styles['info__name']}>{chat?.name}</span>
                </div>

                <div className={styles['info']}>
                  <span className={styles['info__message']}>
                    {chat?.totalMembers} membros
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={openModal}
        width="small"
        onClose={() => setOpenModal(false)}
      >
        <ModalHeader>{translate('CHAT.NEW_MESSAGE')}</ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column gap-3 mb-4">
            <Select
              label={translate('EMAIL.TO')}
              options={users}
              unique
              onSelected={value => setUserSelected(value[0])}
            />

            <Button appearance="primary" isBlock onClick={handleUserSelection}>
              {translate('CHAT.START_CONVERSATION')}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}
