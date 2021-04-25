import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db.js'
import Query from './resolvers/Query.js'
import Mutation from './resolvers/Mutation.js'
import Subscription from './resolvers/Subscription.js'
import Event from './resolvers/Event.js'
import Time from './resolvers/Time.js'
import Announcement from './resolvers/Announcement.js'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Event,
    Time,
    Announcement
  },
  context: {
    db,
    pubsub
  }
})

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT || 4000}.`)
})
