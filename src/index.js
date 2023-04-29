require('./config/database');
const express = require('express');
const cors = require('cors');
const { connect } = require('mqtt');
const Handler = require('./handler');
const Service = require('./service');
const sequelize = require('./config/database');
const { RAIN_CONSTANT, WIND_SPEED_CONSTANT } = require('./constants');

const app = express();

const TOPIC = 'estacao_meteorologica/#';
const BROKER = 'mqtt://broker.emqx.io:1883';
const APP_PORT = 4001;

async function bootstrap() {
  app.use(cors());
  app.use(express.json());
  await sequelize.connect();

  const client = connect(BROKER);

  client.on('connect', async () => {
    console.log('MQTT connected! 🚀');

    client.subscribe(TOPIC);
    client.on('message', Handler.newMessageHandler);
  });

  app.get('/get-all', async (_, response) => {
    const service = new Service();
    const data = await service.getAllStationData();
    const HEADERS = 'Sequência;Temperatura (°C);Umidade (%);Velocidade do vento (Km/h);Tempo de menor volta (ms);Chuva (mm);Horário\r\n';
    let csvData = HEADERS;

    data.forEach(({
      sequence,
      temperature,
      humidity,
      windSpeed,
      minWindSpeed,
      rainMillimeter,
      createdAt,
    }) => {
      csvData += [
        sequence,
        temperature,
        humidity,
        ((windSpeed / 900) * WIND_SPEED_CONSTANT).toFixed(2),
        minWindSpeed,
        rainMillimeter * RAIN_CONSTANT,
        Intl.DateTimeFormat(
          'pt-BR',
          {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }
        ).format(new Date(createdAt))
      ].join(';') + '\r\n';
    })

    response
      .set({
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="data.csv"`,
      })
      .status(200)
      .send(csvData);
  });
  app.listen(APP_PORT, () => {
    console.log('Server is UP! 🚀');
  });
}

bootstrap();