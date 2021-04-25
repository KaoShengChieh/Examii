import { gql } from 'apollo-boost'

const TIME_SUBSCRIPTION = gql`
  subscription time(
  	$eventID: ID!
  ) {
    time(
      eventID: $eventID
    ) {
      mutationType
      data {
        startTime
        duration
        overtime
      }
    }
  }
`

const ANNOUNCEMENT_SUBSCRIPTION = gql`
  subscription announcement(
  	$eventID: ID!
  ) {
    announcement(
      eventID: $eventID
    ) {
      mutationType
      data {
      	id
      	content
      }
    }
  }
`

export { TIME_SUBSCRIPTION, ANNOUNCEMENT_SUBSCRIPTION }
