import { gql } from 'apollo-boost'

const CREATE_EVENT_MUTATION = gql`
  mutation createEvent(
    $eventCode: String!
    $password: String!
    $title: String!
    $duration: Int!
  ) {
    createEvent(
      data: {
        eventCode: $eventCode
        password: $password
        title: $title
        duration: $duration
      }
    )
  }
`

const START_EVENT_MUTATION = gql`
  mutation startEvent(
    $eventID: ID!
    $password: String!
  ) {
    startEvent(
      data: {
        eventID: $eventID
        password: $password
      }
    ) {
      startTime
      duration
      overtime
    }
  }
`

const EXTEND_TIME_MUTATION = gql`
  mutation extendTime(
    $eventID: ID!
    $password: String!
    $amount: Int!
  ) {
    extendTime(
      data: {
        eventID: $eventID
        password: $password
        amount: $amount
      }
    ) {
      startTime
      duration
      overtime
    }
  }
`

const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation createAnnouncement(
    $eventID: ID!
    $password: String!
    $content: String!
  ) {
    createAnnouncement(
      data: {
        eventID: $eventID
        password: $password
        content: $content
      }
    ) {
      id
      content
    }
  }
`

const UPDATE_ANNOUNCEMENT_MUTATION = gql`
  mutation updateAnnouncement(
    $eventID: ID!
    $password: String!
    $announcementID: ID!
    $updatedContent: String!
  ) {
    updateAnnouncement(
      data: {
        eventID: $eventID
        password: $password
        announcementID: $announcementID
        updatedContent: $updatedContent
      }
    ) {
      id
      content
    }
  }
`

const DELETE_ANNOUNCEMENT_MUTATION = gql`
  mutation deleteAnnouncement(
    $eventID: ID!
    $password: String!
    $announcementID: ID!
  ) {
    deleteAnnouncement(
      data: {
        eventID: $eventID
        password: $password
        announcementID: $announcementID
      }
    ) {
      id
      content
    }
  }
`

export {
  CREATE_EVENT_MUTATION,
  START_EVENT_MUTATION,
  EXTEND_TIME_MUTATION,
  CREATE_ANNOUNCEMENT_MUTATION,
  UPDATE_ANNOUNCEMENT_MUTATION,
  DELETE_ANNOUNCEMENT_MUTATION
}
