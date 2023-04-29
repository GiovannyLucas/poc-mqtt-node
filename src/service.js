const StationData = require('./model/StationData');

class Service {
  #stationDataRepository = StationData;

  async createStationData(params) {
    const stationData = this.#stationDataRepository.build(params);
    await stationData.save();
  }

  async getAllStationData() {
    const stationData = await this.#stationDataRepository.findAll();
    return stationData;
  }
}

module.exports = Service;