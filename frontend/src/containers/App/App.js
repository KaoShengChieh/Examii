import React, { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  useParams
} from 'react-router-dom'

import {
  Container,
  ButtonGroup,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap'

import {
  EVENT_QUERY,
  CREATE_EVENT_MUTATION,
  START_EVENT_MUTATION,
  EXTEND_TIME_MUTATION,
  CREATE_ANNOUNCEMENT_MUTATION,
  UPDATE_ANNOUNCEMENT_MUTATION,
  DELETE_ANNOUNCEMENT_MUTATION,
  TIME_SUBSCRIPTION,
  ANNOUNCEMENT_SUBSCRIPTION
} from '../../graphql'

import {
  Announcements,
  Clock,
  Create,
  Join,
  LinkButton
} from '../../components' 

import {
  columns_img,
  clock_img
} from '../../materials'

import SplitterLayout from 'react-splitter-layout'
import 'react-splitter-layout/lib/index.css'
import classes from './App.module.css'

const App = () => {
  const [eventID, setEventID] = useState('')
  const [eventCode, setEventCode] = useState('')
  const [password, setPassword] = useState(undefined)
  const [title, setTitle] = useState('')
  const [clock, setClock] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [isTA, setIsTA] = useState(false)

  const {
    loading: eventQueryLoading,
    error: eventQueryError,
    data: eventQueryData,
    subscribeToMore
  } = useQuery(EVENT_QUERY, {
    variables: {
      eventCode
    }
  })
  
  const [createEvent, {
    loading: createEventMutationLoading,
    error: createEventMutationError,
  }] = useMutation(CREATE_EVENT_MUTATION, {
    refetchQueries: [{
      query: EVENT_QUERY,
      variables: { 
        eventCode
      }
    }]
  })
  
  const [startEvent] = useMutation(START_EVENT_MUTATION)
  const [extendTime] = useMutation(EXTEND_TIME_MUTATION)
  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT_MUTATION)
  const [updateAnnouncement] = useMutation(UPDATE_ANNOUNCEMENT_MUTATION)
  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT_MUTATION)

  useEffect(() => {
    subscribeToMore({
      document: TIME_SUBSCRIPTION,
      variables: { eventID },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newTime = subscriptionData.data.time.data

        return {
          ...prev,
          event: {
            ...prev.event,
            time: newTime
          }
        }
      }
    })
  }, [subscribeToMore, eventID])

  useEffect(() => {
    subscribeToMore({
      document: ANNOUNCEMENT_SUBSCRIPTION,
      variables: { eventID },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const mutatedAnnouncement = subscriptionData.data.announcement.data
        
        // eslint-disable-next-line
        switch (subscriptionData.data.announcement.mutationType) {
        case 'CREATED':
          return {
            ...prev,
            event: {
              ...prev.event,
              announcements: [...prev.event.announcements, mutatedAnnouncement]
            }
          }
        case 'UPDATED':
          return {
            ...prev,
            event: {
              ...prev.event,
              announcements: prev.event.announcements.map(announcement =>
                announcement.id === mutatedAnnouncement.id ? mutatedAnnouncement : announcement)
            }
          }
        case 'DELETED':
          return {
            ...prev,
            event: {
              ...prev.event,
              announcements: prev.event.announcements
                .filter(announcement => announcement.id !== mutatedAnnouncement.id)
            }
          }
        }
      }
    })
  }, [subscribeToMore, eventID])
  
  const CreateEvent = useCallback(variables => {
    createEvent({ variables })

    while (createEventMutationLoading) {}
    if (createEventMutationError) {
      window.alert(`Error ${createEventMutationError.message}`)
      return
    }
    
    setEventCode(variables.eventCode)
    setPassword(variables.password)
    setIsTA(true)
  }, [
    createEvent, 
    createEventMutationError,
    createEventMutationLoading
  ])
  
  const JoinEvent = useCallback((loginAsTA, variables) => {
    setEventCode(variables.eventCode)
    setPassword(variables.password)
    setIsTA(loginAsTA)
  }, [])

  useEffect(()=> { 
    if (!eventCode || eventQueryLoading) return
    if (eventQueryError) {
      window.alert(`Error! ${eventQueryError.message}`)
      return
    }
    if (!eventQueryData) return
    
    setEventID(eventQueryData.event.id)
    setTitle(eventQueryData.event.title)
    setClock(eventQueryData.event.time)
    setAnnouncements(eventQueryData.event.announcements)
  },
  // eslint-disable-next-line
  [
    eventQueryLoading, 
    eventQueryError,
    eventQueryData
  ])

  const StartEvent = () => {
    const affirmative = window.confirm('Make sure to start the test?')
    if (!affirmative) return

    startEvent({
      variables:{
        eventID,
        password
      }
    })
  }
  
  const ExtendTime = (time) => {
    extendTime({
      variables: {
        eventID,
        password,
        amount: time 
      }
    })
  }
  
  const CreateAnnouncement = variables => {
    createAnnouncement({
      variables: {
        eventID,
        password,
        ...variables
      }
    })
  }
  
  const UpdateAnnouncement = variables => {
    updateAnnouncement({
      variables: {
        eventID,
        password,
        ...variables
      }
    })
  }
  
  const DeleteAnnouncement = variables => {
    deleteAnnouncement({
      variables: {
        eventID,
        password,
        ...variables
      }
    })
  }

  const HomePage = () => {
    return(
    eventID ? (<Redirect to={`/${eventID}`}/>)
    : (<>
      <Navbar color='dark'>
        <h3 className={classes.navbarTitle}>Examii</h3>   
      </Navbar>
      <Container className={classes.home}>
        <h1 className={classes.title}>Examii</h1> 
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === '1' ? 'active' : ''}
              onClick={() => setActiveTab('1')}
            >
              Join
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '2' ? 'active' : ''}
              onClick={()=> setActiveTab('2')}
            >
              Create
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId='1'>
            <Join JoinEvent={JoinEvent}/>
          </TabPane>
          <TabPane tabId='2'>
            <Create CreateEvent={CreateEvent}/>
          </TabPane>
        </TabContent>
      </Container>
    </>)
  )}

  const EventPage = () => {
    const { id } = useParams()
    if (id !== eventID) {
      return (<Redirect to='/'/>)
    }
    
    return (
      <>
        <Navbar color='dark'>
          <h3 className={classes.navbarTitle} >Examii</h3>
          <ButtonGroup className='navigation-bar' size='sm'>
            <LinkButton to={`/${id}`}>
              <img src={clock_img} alt='clock'/>
            </LinkButton>
            <LinkButton to={`/${id}/split`}>
              <img src={columns_img} alt='columns'/>
            </LinkButton>
          </ButtonGroup>    
        </Navbar>
        <div className={classes.content}>
          <Switch>
            <Route exact path='/:id'> 
              <Clock
                data={{ clock, title, isTA }}
                handler={{ StartEvent, ExtendTime }}
              />
            </Route>
            <Route path='/:id/split'>
              <SplitterLayout
                primaryMinSize={25}
                secondaryMinSize={30}
                percentage={true}
                secondaryInitialSize={50}
              >
                <Clock
                data={{ clock, title, isTA }}
                handler={{ StartEvent, ExtendTime }}
                />
                <Announcements
                  data={{ announcements, isTA }}
                  handlers={{
                    CreateAnnouncement,
                    UpdateAnnouncement,
                    DeleteAnnouncement
                  }}
                />
              </SplitterLayout>
            </Route>
          </Switch>
        </div>
      </>
    )
  }
  
  return (
    <Router>
      <Route exact path='/'>
        <HomePage/>
      </Route>
      <Route path='/:id'>
        <EventPage/>
      </Route>
      <Route exact path='/:id/clock'>
        <Redirect to='/:id'/>
      </Route>
    </Router>
  )
}

export default App
