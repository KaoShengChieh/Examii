const Query = {
  async eventExists(parent, args, { db }, info) {
    return await db.eventExists(args.data)
  },
  async event(parent, { eventCode }, { db }, info) {
    return await db.findEvent(eventCode)
  }
}

export default Query
