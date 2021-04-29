import mongoose from 'mongoose'

const Schema = mongoose.Schema

const EventSchema = new Schema({
  eventCode: {
    type: String
  },
  password: {
    type: String
  },
  title: {
    type: String
  }
})

const Event = mongoose.model('Event', EventSchema)

export default Event
