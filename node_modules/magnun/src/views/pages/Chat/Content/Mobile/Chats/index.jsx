import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useChat } from '../../../../../../hooks/useChat'
import { createHash } from '../../../../../../utils/utils'

import Button from '../../../../../../components/BaseUI/Button'
import {
  Modal,
  ModalBody,
  ModalHeader,
} from '../../../../../../components/BaseUI/Modal'
import Select from '../../../../../../components/BaseUI/Select'
import Avatar from '../../../../../../components/CustomUI/Avatar'
import Search from '../../../../../../components/CustomUI/Search'

import { MdAdd } from 'react-icons/md'

import styles from './Chats.module.scss'

export default function Chats() {
  const [openModal, setOpenModal] = useState(false)
  const [userSelected, setUserSelected] = useState()
  const [searchValue, setSearchValue] = useState('')

  const navigate = useNavigate()

  const {
    chats,
    users,
    formatDate,
    screenSize,
    handleChatSelection,
    currentChat,
    addNewChat,
  } = useChat()

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
    <>
      {' '}
      {Object.keys(currentChat || []).length > 0 ? (
        <></>
      ) : (
        <div className={styles['mobile-container']}>
          <div className={styles['mobile-container__header']}>
            <Search
              className={styles['search']}
              onSearch={value => handleSearch(value)}
            />
          </div>

          <div className={styles['mobile-container__content']}>
            {filteredChats.map((chat, index) => (
              <div
                key={index}
                className={`${styles['chats']}`}
                onClick={() => handleChatSelection(chat.uuid)}
              >
                <Avatar
                  name={chat?.user?.name}
                  src={chat?.user?.image}
                  status={chat?.user?.active ? 'online' : 'offline'}
                  size="large"
                />

                <div className={styles['chats__infos']}>
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
                    <span
                      className={styles['info__message']}
                      style={{ width: `${screenSize - 120}px` }}
                    >
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

          <div className={styles['mobile-container__create']}>
            <MdAdd onClick={() => setOpenModal(true)} />
          </div>

          <Modal
            isOpen={openModal}
            width="small"
            onClose={() => setOpenModal(false)}
          >
            <ModalHeader>Nova mensagem</ModalHeader>
            <ModalBody>
              <div className="d-flex flex-column gap-3 mb-4">
                <Select
                  label="Para"
                  options={users}
                  unique
                  onSelected={value => setUserSelected(value[0])}
                />

                <Button
                  appearance="primary"
                  isBlock
                  onClick={handleUserSelection}
                >
                  Iniciar conversa
                </Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
      )}
    </>
  )
}
