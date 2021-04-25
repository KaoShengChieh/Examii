import { gql } from 'apollo-boost'

const EVENT_EXISTS_QUERY = gql`
  query eventExists(
    $eventCode: String!
    $password: String
  ) {
    eventExists(
      data: {
        eventCode: $eventCode
        password: $password
      }
    )
  }
`

const EVENT_QUERY =  gql`
  query event(
    $eventCode: String!
  ) {
    event(
      eventCode: $eventCode
    ) {
      id
      eventCode
      title
      time {
        startTime
        duration
        overtime
      }
      announcements {
        id
        content
      }
    }
  }
`

export { EVENT_EXISTS_QUERY, EVENT_QUERY }
