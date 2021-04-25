const Time = {
  async event(parent, args, { db }, info) {
    return await db.findEventByID(parent.event)
  }
}

export default Time
