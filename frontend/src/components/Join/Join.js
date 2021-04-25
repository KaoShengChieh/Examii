import React, { useState, useCallback, useEffect } from 'react'
import {
  Button, Collapse, CustomInput, Form, 
  FormFeedback, FormGroup, Input, Label
} from 'reactstrap'
import { useLazyQuery } from '@apollo/react-hooks'
import { EVENT_EXISTS_QUERY } from '../../graphql'
import classes from './Join.module.css'

const Join = ({ JoinEvent }) => {
  const [eventCode, setEventCode] = useState('')
  const [isTA, setIsTA] = useState(false)
  const [password, setPassword] = useState(null)
  const [available, setAvailable] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState('')
  
  const [queryEventExists, {
    loading: eventExistsQueryLoading,
    error: eventExistsQueryError,
    data: eventExistsQueryData
  }] = useLazyQuery(EVENT_EXISTS_QUERY)
  
  const handleJoinEvent = useCallback(
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
      
      if (!isTA)
        queryEventExists({ variables: { eventCode } })
      else
        queryEventExists({ variables: { eventCode, password } })
    }, [
      eventCode,
      password,
      isTA,
      queryEventExists
    ]
  )

  useEffect(() => {
    if (!eventCode || eventExistsQueryLoading) return
    if (eventExistsQueryError) {
      setErrorMessage(`Error ${eventExistsQueryError.message}`)
      return
    }
    
    if (!eventExistsQueryData.eventExists) {
      setErrorMessage(
        'No such event' +
        (isTA ? ' or wrong password' : '')
      )
      setAvailable(false)
      return
    }
    
    const variables = {
      eventCode,
      password
    }
    JoinEvent(isTA, variables)
  },
  // eslint-disable-next-line
  [
    eventExistsQueryLoading,
    eventExistsQueryError,
    eventExistsQueryData,
    JoinEvent
  ])

  return (
    <React.Fragment>
      <Form className={classes.form} onSubmit={handleJoinEvent}>
        <FormGroup>
          <Label for='join_event__eventcode'>EventCode</Label>
          <Input 
            type='text' 
            name='eventCode' 
            id='join_event__eventcode' 
            placeholder='EventCode...' 
            value={eventCode}
            onChange={e => setEventCode(e.target.value)}
            invalid={available === undefined ? undefined : !available}
          />
          {errorMessage && (
            <FormFeedback>
               {errorMessage}
            </FormFeedback>
          )}
        </FormGroup>
        
        <Collapse isOpen={isTA}>
          <FormGroup>
            <Label for='join_event__password'>Password</Label>
            <Input 
              type='password' 
              name='Password' 
              id='join_event__password' 
              placeholder='Password...' 
              onChange={e => setPassword(e.target.value)}
              invalid={available === undefined ? undefined : !available}
            />
            {errorMessage && (
            <FormFeedback>
               {errorMessage}
            </FormFeedback>
          )}
          </FormGroup>
        </Collapse>
        <CustomInput 
          type='switch'
          id='join_event__isTA'
          name='isTA' 
          label='I am a TA.'
          onChange={() => {setIsTA(!isTA)}}
        />
        <Button
          className={classes.button}
          disabled={eventCode === '' || (isTA && !password)}
        >
          Join
        </Button>
      </Form>
    </React.Fragment>
  )
}

export { Join }
