import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TimeSchema = new Schema({
  startTime: {
    type: Date
  },
  duration: {
    type: Number
  },
  overtime: {
    type: Number,
    default: 0
  },
  eventID: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }
})

const Time = mongoose.model('Time', TimeSchema)

export default Time
