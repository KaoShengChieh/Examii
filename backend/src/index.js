import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db.js'
import Announcement from './resolvers/Announcement.js'
import Event from './resolvers/Event.js'
import Mutation from './resolvers/Mutation.js'
import Query from './resolvers/Query.js'
import Subscription from './resolvers/Subscription.js'
import Time from './resolvers/Time.js'

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