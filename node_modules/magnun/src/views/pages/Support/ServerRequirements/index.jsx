import React from 'react'

export default function ServerRequirements() {
  return (
    <section>
      <h3>Server Requirements</h3>
      <p>
        It's essential to have these versions of Node.js and npm installed to
        ensure full compatibility with project dependencies and scripts,
        providing a stable development environment and avoiding errors related
        to library and package versions.
      </p>
      <ul>
        <li>
          <strong>Node.js</strong> version {`>=`} 16.18.1
        </li>
        <li>
          <strong>npm</strong> version {`>=`} 8.19.2
        </li>
      </ul>
    </section>
  )
}
