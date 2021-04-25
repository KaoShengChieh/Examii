import mongoose from 'mongoose'
const Schema = mongoose.Schema

const AnnouncementSchema = new Schema({
  content: {
    type: String
  },
  eventID: {
  	type: Schema.Types.ObjectId,
  	ref: 'Event'
  }
})

const Announcement = mongoose.model('Announcement', AnnouncementSchema)

export default Announcement
