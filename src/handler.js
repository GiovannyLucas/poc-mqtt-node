const Service = require("./service");

class Handler {
  static newMessageHandler(topic, payload) {
    const [,end] = topic.split('/');
    const suffix = payload.toString().endsWith('}') ? '': "}"

    switch (end) {
      case 'dados':
        Handler.#handleStationData(topic, JSON.parse(payload.toString() + suffix));
        return;
      default:
        console.log('[NOT ALLOWED]', topic, payload.toString());
    }

  }

  static async #handleStationData(topic, data) {
    console.log(topic, data, new Date());
    const service = new Service();
    
    try {
      const areAllNumbers = Object.keys(data).every(key => typeof data[key] === 'number');
      if (!areAllNumbers) {
        console.log('Dados com formato errado!!!');
      }
      await service.createStationData({
        temperature: data.temperatura,
        humidity: data.umidade,
        windSpeed: data.vento,
        minWindSpeed: data.minimo,
        rainMillimeter: data.chuva,
        sequence: data.sequencia,
      });
    } catch (error) {
      console.log('Data could not be inserted due to error:', error);
    }
  }
}

module.exports = Handler;