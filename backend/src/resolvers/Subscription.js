const Subscription = {
  time: {
    async subscribe(parent, { eventID }, { pubsub }, info) {
      return pubsub.asyncIterator(`time ${eventID}`)
    }
  },
  announcement: {
    async subscribe(parent, { eventID }, { pubsub }, info) {
      return pubsub.asyncIterator(`announcement ${eventID}`)
    }
  }
}

export default Subscription