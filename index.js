#!/usr/bin/env node

const hyperswarm = require('hyperswarm')
const crypto = require('crypto')
const figures = require('figures')

const swarm = hyperswarm()

const k = crypto.createHash('sha256')
  .update('connect-test')
  .digest()

console.log(figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star)
console.log('  ' + figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star)
console.log('Hyperswarm Connect-Test')
console.log('  ' + figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star)
console.log(figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star, ' ', figures.star)
console.log('')

console.log(figures.play, 'Testing connectivity...')
swarm.connectivity((err, res) => {
  if (err) console.error(figures.warning, 'Error while testing for connectivity', err)
  if (res.holepunched) console.log(figures.tick, 'Your network is hole-punchable!')
  if (res.bootstrapped) console.log(figures.tick, 'Your connection is bootstrapped!')
  if (res.bound) console.log(figures.tick, 'Your swarm is bound!')
  console.log(figures.play, 'Joining hyperswarm under the sha256(\'connect-test\') topic')

  swarm.on('error', function (err) {
    console.error(figures.cross, 'There was an error', err)
  })

  swarm.on('peer', function (peer) {
    console.log(figures.pointerSmall, 'New peer!', peer.host, peer.port, peer.topic)
  })

  swarm.on('connection', function (socket, info) {
    console.log(figures.pointerSmall, 'New connection!', info)
  })
  swarm.on('disconnection', function (socket, info) {
    console.log(figures.cross, 'Connection has been dropped', info.peer.host, info.peer.port, info.peer.topic)
  })
  swarm.on('peer-rejected', function (peer) {
    console.log(figures.cross, 'Peer rejected!', peer)
  })

  swarm.on('updated', function (peer) {
    console.log(figures.tick, 'Successfully updated')
  })

  swarm.join(k, {
    announce: true,
    lookup: true
  })
  console.log(figures.info, 'Waiting for connections...')
})
/**
net.discovery.holepunchable((err, yes) => {
  if (err) console.error(figures.warning, 'Error while testing for holepunch capability', err)
  else console.log(figures.cross, 'Your network is not hole-punchable. This will degrade connectivity.')

  console.log('')
  console.log(figures.play, 'Joining hyperswarm under the sha256(\'connect-test\') topic')
  console.log(figures.info, 'Waiting for connections...')
  net.join(k, {announce: true, lookup: true})
  console.log('')
})

**/
process.once('SIGINT', function () {
  console.log('Shutting down ...')
  swarm.destroy()
  swarm.on('close', function () {
    process.exit()
  })
})
