const Mutation = {
  async createEvent(parent, args, { db }, info) {
    try {
      await db.saveEvent(args.data)
      return `Event '${args.data.eventCode}' created`
    } catch (err) {
      return err.message
    }
  },
  async startEvent(parent, args, { db, pubsub }, info) {
    const startTime = Date.now()
    const newTime = await db.setStartTime({
      ...args.data,
      startTime
    })
    const payload = {
      time: {
        mutationType: 'UPDATED',
        data: newTime
      }
    }

    pubsub.publish(`time ${args.data.eventID}`, payload)

    return newTime
  },
  async extendTime(parent, args, { db, pubsub }, info) {
    const newTime = await db.updateOvertime(args.data)

    const payload = {
      time: {
        mutationType: 'UPDATED',
        data: newTime
      }
    }

    pubsub.publish(`time ${args.data.eventID}`, payload)

    return newTime
  },
  async createAnnouncement(parent, args, { db, pubsub }, info) {
    const newAnnouncement = await db.saveAnnouncement(args.data)

    const payload = {
      announcement: {
        mutationType: 'CREATED',
        data: newAnnouncement
      }
    }

    pubsub.publish(`announcement ${args.data.eventID}`, payload)

    return newAnnouncement
  },
  async updateAnnouncement(parent, args, { db, pubsub }, info) {
    const newAnnouncement = await db.updateAnnouncement(args.data)

    const payload = {
      announcement: {
        mutationType: 'UPDATED',
        data: newAnnouncement
      }
    }

    pubsub.publish(`announcement ${args.data.eventID}`, payload)

    return newAnnouncement
  },
  async deleteAnnouncement(parent, args, { db, pubsub }, info) {
    const newAnnouncement = await db.deleteAnnouncement(args.data)

    const payload = {
      announcement: {
        mutationType: 'DELETED',
        data: newAnnouncement
      }
    }

    pubsub.publish(`announcement ${args.data.eventID}`, payload)

    return newAnnouncement
  }
}

export default Mutation