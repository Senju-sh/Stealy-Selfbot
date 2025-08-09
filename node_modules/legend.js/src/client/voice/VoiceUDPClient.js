const udp = require('dgram');
const Constants = require('../../util/Constants');
const EventEmitter = require('events').EventEmitter;

/**
 * Represents a UDP client for a Voice Connection.
 * @extends {EventEmitter}
 * @private
 */
class VoiceConnectionUDPClient extends EventEmitter {
  constructor(voiceConnection) {
    super();

    /**
     * The voice connection that this UDP client serves
     * @type {VoiceConnection}
     */
    this.voiceConnection = voiceConnection;

    /**
     * The UDP socket
     * @type {?Socket}
     */
    this.socket = null;

    /**
     * The address of the Discord voice server
     * @type {?string}
     */
    this.discordAddress = null;

    /**
     * The local IP address
     * @type {?string}
     */
    this.localAddress = null;

    /**
     * The local port
     * @type {?string}
     */
    this.localPort = null;

    this.voiceConnection.on('closing', this.shutdown.bind(this));
  }

  shutdown() {
    if (this.socket) {
      this.socket.removeAllListeners('message');
      try {
        this.socket.close();
      } finally {
        this.socket = null;
      }
    }
  }

  /**
   * The port of the Discord voice server
   * @type {number}
   * @readonly
   */
  get discordPort() {
    return this.voiceConnection.authentication.port;
  }

  /**
   * Send a packet to the UDP client.
   * @param {Object} packet The packet to send
   * @returns {Promise<Object>}
   */
  send(packet) {
    return new Promise((resolve, reject) => {
      if (!this.socket) throw new Error('Tried to send a UDP packet, but there is no socket available.');
      if (!this.discordAddress || !this.discordPort) throw new Error('Malformed UDP address or port.');
      this.socket.send(packet, 0, packet.length, this.discordPort, this.discordAddress, error => {
        if (error) {
          console.log(error)
          this.emit('debug', `[UDP] >> ERROR: ${error}`);
          reject(error);
        } else {
          resolve(packet);
        }
      });
    });
  }

  async createUDPSocket(address) {
    this.discordAddress = address;
    const socket = this.socket = udp.createSocket('udp4');
    socket.on('error', e => {
      console.log(e)
      this.emit('debug', `[UDP] Error: ${e}`);
      this.emit('error', e);
    });
    socket.on('close', () => {
      this.emit('debug', '[UDP] socket closed');
    });

    socket.once('message', message => {
      const packet = parseLocalPacket(message);
      if (packet.error) {
        this.emit('error', packet.error);
        return;
      }

      this.localAddress = packet.address;
      this.localPort = packet.port;

      this.voiceConnection.sockets.ws.sendPacket({
        op: Constants.VoiceOPCodes.SELECT_PROTOCOL,
        d: {
          protocol: 'udp',
          codecs: [
            {
              name: 'opus',
              type: 'audio',
              priority: 1000,
              payload_type: 120,
            },
            {
              name: "H264",
              type: 'video',
              priority: 1000,
              payload_type: 101,
              rtx_payload_type: 102,
              encode: true,
              decode: true,
            },
          ],
          data: {
            address: packet.address,
            port: packet.port,
            mode: 'xsalsa20_poly1305',
          },
        },
      });
    });
    const udpMessage = Buffer.allocUnsafe(74);
    udpMessage.writeUInt16BE(0x1, 0);
    udpMessage.writeUInt16BE(70, 2);
    udpMessage.writeUInt32BE(this.voiceConnection.authentication.ssrc, 4);
    await this.send(udpMessage);
  }
}

function parseLocalPacket(message) {
  try {
    const packet = Buffer.from(message);
    let address = '';
    for (let i = 4; i < packet.indexOf(0, i); i++) address += String.fromCharCode(packet[i]);
    const port = parseInt(packet.readUIntLE(packet.length - 2, 2).toString(10), 10);
    return { address, port };
  } catch (error) {
    return { error };
  }
}

module.exports = VoiceConnectionUDPClient;
