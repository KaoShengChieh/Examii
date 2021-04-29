import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'

const LinkButton = ({ to, children }) => {
  const history = useHistory()

  return (
    <Button onClick={() => history.push(to)}>
      {children}
    </Button>
  )
}

export { LinkButton }
