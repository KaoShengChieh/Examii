import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, Form, Input } from 'reactstrap'
import {
  bold_img,
  send_img,
  strikethrough_img,
  trashcan_img
} from '../../materials'
import classes from './Announcements.module.css'
import EditText from './EditText'

const Announcements = ({ data, handlers }) => {
  const {
    CreateAnnouncement,
    UpdateAnnouncement,
    DeleteAnnouncement
  } = handlers
  const {
    isTA,
    announcements
  } = data
  const [newContent, setNewContent] = useState('')
  const buttonClick = useRef(null)
  const scroll = useRef(null)

  const handleFocus = () => buttonClick.current.focus()
  useEffect(() => handleFocus(), [newContent])

  useEffect(() => {
    scroll.current.scrollTop = scroll.current.scrollHeight
  });

  const handleCreateAnnouncement = () => {
    const variables = { content: newContent }
    CreateAnnouncement(variables)
    setNewContent('')
  }

  const handleDeleteAnnouncement = (e) => {
    const variables = { announcementID: e.target.id }
    DeleteAnnouncement(variables)
  }

  const addBold = () => {
    //TODO: if we have time, move the cursor backward
    setNewContent(newContent + '****')
  }

  const addStrikethrough = () => {
    //TODO: if we have time, move the cursor backward
    setNewContent(newContent + '~~~~')
  }

  const Data = () => {
    return announcements.map(announcement =>
      <Card key={announcement.id}>
        <CardBody>
          <Button
            outline
            id={announcement.id}
            size='sm'
            className='float-right'
            onClick={handleDeleteAnnouncement}
            disabled={!isTA}
          >
            <img
              id={announcement.id}
              src={trashcan_img}
              alt='trash'
            />
          </Button>
          <EditText
            announcement={announcement}
            UpdateAnnouncement={UpdateAnnouncement}
            isTA={isTA}
          />
        </CardBody>
      </Card>
    )
  }

  return (
    <div className={classes.announcements}>
      <div className={classes.container} ref={scroll}>
        <Data />
      </div>
      <Form className={classes.form} onSubmit={e => e.preventDefault()}>
        <Input
          type='textarea'
          className={classes.input}
          placeholder='New announcement...'
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          innerRef={buttonClick}
          disabled={!isTA}
        />
        <Button
          className={classes.circleButton}
          onClick={addBold}
          disabled={!isTA}
        >
          <img src={bold_img} alt='bold' />
        </Button>
        <Button
          className={classes.circleButton}
          onClick={addStrikethrough}
          disabled={!isTA}
        >
          <img src={strikethrough_img} alt='strikethrough' />
        </Button>
        <Button
          className={classes.circleButton}
          onClick={handleCreateAnnouncement}
          disabled={newContent === '' || !isTA}
        >
          <img src={send_img} alt='send' />
        </Button>
      </Form>
    </div>
  )
}

export { Announcements }
