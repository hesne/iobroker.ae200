"use strict";

const utils = require('@iobroker/adapter-core'); // Import the ioBroker adapter core
const AE200 = require('ae200'); // Import the AE200 library

class AE200Adapter extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: 'ae200',
        });

        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    async onReady() {
        this.log.info('Starting AE200 Adapter...');

        // Initialize the AE200 connection
        this.ae200 = new AE200({
            host: this.config.host,
            username: this.config.username,
            password: this.config.password
        });

        // Example to fetch data
        try {
            const data = await this.ae200.fetchData();
            this.log.info('Fetched data: ' + JSON.stringify(data));

            // Save fetched data in ioBroker states
            this.setState('data', { val: data, ack: true });
        } catch (error) {
            this.log.error('Error fetching data: ' + error);
        }
    }

    onStateChange(id, state) {
        if (state) {
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        }
    }

    onUnload(callback) {
        try {
            callback();
        } catch (e) {
            callback();
        }
    }
}

if (module.parent) {
    module.exports = (options) => new AE200Adapter(options);
} else {
    new AE200Adapter();
}
