"use strict";

const utils = require('@iobroker/adapter-core'); // Importing the ioBroker adapter core
const fetch = require('node-fetch'); // Importing fetch for HTTP requests

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

        // Example to fetch data
        try {
            const data = await this.fetchData();
            this.log.info('Fetched data: ' + JSON.stringify(data));

            // Save fetched data in ioBroker states
            this.setState('data', { val: data, ack: true });
        } catch (error) {
            this.log.error('Error fetching data: ' + error);
        }
    }

    async fetchData() {
        // Hier kannst du die Logik zum Abrufen der Daten von deinem AE200-Gerät hinzufügen
        const response = await fetch('http://your-ae200-host/api/status');
        const data = await response.json();
        return data; // Beispiel-Daten
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
