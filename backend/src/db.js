import bcrypt from 'bcryptjs'
import dotenv from 'dotenv-defaults'
import mongoose from 'mongoose'
import Announcement from './models/announcement.js'
import Event from './models/event.js'
import Time from './models/time.js'

dotenv.config()

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!')
  process.exit(1)
}

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const saltRounds = 10

mongoose.connect(process.env.MONGO_URL, dbOptions)

mongoose.connection.on('error', (error) => {
  console.error(error)
})

mongoose.connection.once('open', () => {
  console.log('MongoDB connected.')
})

mongoose.set('useFindAndModify', false)

const authenticate = async (eventID, password) => {
  const exists = await Event.exists({ _id: eventID })
  if (!exists)
    throw new Error('Invalid credential')

  const {
    password: passwordInDB
  } = await Event.findById(eventID)
  bcrypt.compare(password, passwordInDB, (err, res) => {
    if (err || res === false)
      throw new Error('Invalid credential')
  })
}

const eventExists = async ({ eventCode, password }) => {
  const exists = await Event.exists({ eventCode })

  if (!exists || !password)
    return exists
  else {
    const {
      password: passwordInDB
    } = await Event.findOne({ eventCode })
    return bcrypt.compareSync(password, passwordInDB);
  }
}

const findEvent = async eventCode => {
  const event = await Event.findOne({ eventCode })
  if (!event) return null
  const { id: eventID, title } = event
  const time = await findTime(eventID)
  const announcements = await listAnnouncements(eventID)

  return {
    id: eventID,
    eventCode,
    title,
    time,
    announcements
  }
}

const findEventByID = async eventID => {
  const { eventCode, title } = await Event.findbyID(eventID)
  const time = await findTime(eventID)
  const announcements = await listAnnouncements(eventID)

  return {
    id: eventID,
    eventCode,
    title,
    time,
    announcements
  }
}

const saveEvent = async ({ eventCode, password, title, duration }) => {
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(password, salt)
  const event = await new Event({
    eventCode,
    password: hashedPassword,
    title
  })
  await event.save((err) => {
    if (err) throw new Error(err)
    console.log(`Event '${eventCode}' as '${event.id}' created`)
  })

  const time = await new Time({
    duration,
    eventID: event.id
  })
  await time.save((err) => {
    if (err) throw new Error(err)
    console.log(`Duration of Event '${event.id}' set to be ${duration}`)
  })
}

const findTime = async eventID => {
  const {
    startTime,
    duration,
    overtime
  } = await Time.findOne({ eventID })

  return {
    startTime,
    duration,
    overtime,
    event: eventID
  }
}

const setStartTime = async ({ eventID, password, startTime }) => {
  await authenticate(eventID, password)
  const {
    duration,
    overtime
  } = await Time.findOneAndUpdate(
    { eventID },
    { startTime },
    { new: true },
    (err) => {
      if (err) throw new Error(err)
      console.log(`Start time of Event '${eventID}' set to be ${startTime}`)
    }
  )

  return {
    startTime,
    duration,
    overtime,
    event: eventID
  }
}

const updateOvertime = async ({ eventID, password, amount }) => {
  await authenticate(eventID, password)

  const {
    startTime,
    duration,
    overtime
  } = await Time.findOneAndUpdate(
    { eventID },
    { $inc: { overtime: amount } },
    { new: true }
  )

  console.log(`Overtime of Event '${eventID}' added by ${amount}`)

  return {
    startTime,
    duration,
    overtime,
    event: eventID
  }
}

const listAnnouncements = async eventID => {
  const announcements = await Announcement.find({ eventID })

  return announcements.map(({
    id,
    content,
    eventCode
  }) => ({
    id,
    content,
    event: eventID
  }))
}

const saveAnnouncement = async ({ eventID, password, content }) => {
  await authenticate(eventID, password)

  const announcement = await new Announcement({
    content,
    eventID
  })
  await announcement.save((err) => {
    if (err) throw new Error(err)
    console.log(`Announcement '${content.slice(0, 10)}...' saved`)
  })

  return {
    id: announcement.id,
    content,
    event: eventID
  }
}

const updateAnnouncement = async ({ eventID, password, announcementID, updatedContent }) => {
  await authenticate(eventID, password)

  await Announcement.updateOne(
    { id: announcementID },
    { content: updatedContent },
    (err) => {
      if (err) throw new Error(err)
      console.log(`Announcement '${updatedContent.slice(0, 10)}...' updated`)
    }
  )

  return {
    id: announcementID,
    content: updatedContent,
    event: eventID
  }
}

const deleteAnnouncement = async ({ eventID, password, announcementID }) => {
  await authenticate(eventID, password)

  const { content } = await Announcement.findByIdAndDelete(announcementID)

  return {
    id: announcementID,
    content,
    event: eventID
  }
}

const db = {
  eventExists,
  findEvent,
  findEventByID,
  saveEvent,
  findTime,
  setStartTime,
  updateOvertime,
  listAnnouncements,
  saveAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
}

export default db