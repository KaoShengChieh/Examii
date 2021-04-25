const Event = {
  async time(parent, args, { db }, info) {
    return await db.findTime(parent.id)
  },
  async announcements(parent, args, { db }, info) {
    return await db.listAnnouncements(parent.id)
  }
}

export default Event
