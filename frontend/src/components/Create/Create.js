import React, { useState, useCallback, useEffect } from 'react'
import {
  Alert, Button, Form, FormFeedback,
  FormGroup, Input, Label
} from 'reactstrap'
import { useLazyQuery } from '@apollo/react-hooks'
import { EVENT_EXISTS_QUERY } from '../../graphql'
import classes from './Create.module.css'

const Create = ({ CreateEvent }) => {
  const [eventCode, setEventCode] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [available, setAvailable] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState('')
  
  const [queryEventExists, {
    loading: eventExistsQueryLoading,
    error: eventExistsQueryError,
    data: eventExistsQueryData
  }] = useLazyQuery(EVENT_EXISTS_QUERY)
  
  const checkIfEventIsAvailable = useCallback(
    (e) => {
      e.preventDefault()
      
      const isValid = str => {
        return str.match('^[A-Za-z0-9]+$')
      }
      const warning = 'eventCode can only contains letters and digits.'
      
      if (!isValid(eventCode)) {
        window.alert(warning)
        return
      }
      
      queryEventExists({ variables: { eventCode } })
    }, [
      eventCode,
      queryEventExists
    ]
  )
  
  useEffect(()=> { 
    if (!eventCode || eventExistsQueryLoading) return
    if (eventExistsQueryError) {
      setErrorMessage(`Error ${eventExistsQueryError.message}`)
      return
    }
    
    setAvailable(!eventExistsQueryData.eventExists)
  },
  // eslint-disable-next-line
  [
    eventExistsQueryLoading,
    eventExistsQueryError,
    eventExistsQueryData
  ])
  
  const handleCreateEvent = useCallback(
    (e) => {
      e.preventDefault()
      
      const isInt = str => {
        return !isNaN(str) && 
          // eslint-disable-next-line
          parseInt(Number(str)) == str && 
          !isNaN(parseInt(str, 10)) &&
          parseInt(str) > 0
      }
      const warning = 'Duration can only be positive integer'
      
      if (!isInt(duration)) {
        window.alert(warning)
        return
      }
      
      const affirmative = window.confirm(`Create a new event '${eventCode}'?`)
      if (!affirmative) return
      
      const variables = {
        eventCode,
        password,
        title,
        duration: parseInt(duration)
      }
      CreateEvent(variables)
    }, [
      CreateEvent,
      eventCode,
      password,
      title,
      duration
    ]
  )
  
  return (
    !available
    ?
    (<React.Fragment>
      <Form className={classes.form} onSubmit={checkIfEventIsAvailable}>
        <FormGroup>
          <Label for='create_event__eventcode'>EventCode</Label>
          <Input 
            type='text' 
            name='eventCode' 
            id='create_event__eventcode'
            placeholder='EventCode...'
            value={eventCode}
            invalid={available === undefined ? undefined : !available}
            onChange={e => {
              setEventCode(e.target.value)
              setAvailable(undefined)
            }}
          />
          {available === false && (
            <FormFeedback>
              {`The eventCode '${eventCode}' is already taken`}
            </FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Label for='create_event__password'>Password</Label>
          <Input 
            type='password' 
            name='password' 
            id='create_event__password'
            value={password}
            placeholder='Password...' 
            onChange={e => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button
          className={classes.button}
          disabled={eventCode === '' || password === ''}
        >
          Next
        </Button>
        {errorMessage && (
          <Alert color='danger' onClick={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}
      </Form>
    </React.Fragment>)
    :
    (<React.Fragment>
      <Form className={classes.form} onSubmit={handleCreateEvent}>
        <FormGroup>
          <Label for='create_event__title'>Title</Label>
          <Input 
            id='create_event__title'
            type='text'
            name='title'
            value={title}
            placeholder='Title...'
            onChange={e => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for='create_event__duration'>Duration(mins)</Label>
          <Input 
            type='text'
            name='duration'
            id='create_event__duration'
            value={duration}
            placeholder='How long is your exam?'
            onChange={e => setDuration(e.target.value)}
          />
        </FormGroup>
        <Button
          className={classes.button}
          disabled={title === '' || duration === ''}
        >
          Create
        </Button>
      </Form>
    </React.Fragment>)
  )
}

export { Create }
