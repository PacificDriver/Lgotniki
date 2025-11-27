import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import './style.scss'

import routes from '../../../routes'
import EmailRead from '../../../views/pages/Email/EmailRead'
import Email from '../../../views/pages/Email'
import EmailList from '../../../views/pages/Email/EmailList'
import Chat from '../../../views/pages/Chat'
import Content from '../../../views/pages/Chat/Content'
import FileManager from '../../../views/pages/FileManager'
import ListFiles from '../../../views/pages/FileManager/ListFiles'

const AppContent = ({ className }) => {
  return (
    <div className={`app-content-container ${className}`}>
      <Suspense fallback={[]}>
        <Routes>
          {routes.map((route, index) => {
            return (
              route.element && (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}

          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="/dashboard/emails" element={<Email />}>
            <Route path="" element={<EmailList />} />
            <Route path=":id" element={<EmailRead />} />
          </Route>
          <Route path="/dashboard/chat" element={<Chat />}>
            <Route path=":id" element={<Content />} />
          </Route>
          <Route path="/dashboard/file-manager" element={<FileManager />}>
            <Route path="" element={<ListFiles />} />
            <Route
              path="/dashboard/file-manager/folders/:id"
              element={<ListFiles />}
            />
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

export default React.memo(AppContent)
