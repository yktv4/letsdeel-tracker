require('dotenv').config();
const { argv } = require('yargs');
const axios = require('axios');

const contractId = process.env.CONTRACT_ID;
const hoursPerDay = process.env.HOURS_PER_DAY;
const description = process.env.DESCRIPTION;
const authToken = process.env.AUTH_TOKEN;
const startDate = argv.startDate;
const endDate = argv.endDate;

const getDaysArray = (startDate, endDate) => {
  const result = []
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    result.push(currentDate);
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return result;
};
const dateToString = date => date.toISOString().slice(0, 10);

const url = `https://api2.letsdeel.com/contracts/${contractId}/reports`;

const headers = {
  "authority": 'api2.letsdeel.com',
  "pragma": 'no-cache',
  "cache-control": 'no-cache',
  "accept": 'application/json, text/plain, */*',
  "x-auth-token": authToken,
  "x-api-version": '2',
  "x-app-host": 'app.letsdeel.com',
  "user-agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
  "x-request-id": '1400470359110-13',
  "content-type": 'application/json;charset=UTF-8',
  "origin": 'https://app.letsdeel.com',
  "sec-fetch-site": 'same-site',
  "sec-fetch-mode": 'cors',
  "sec-fetch-dest": 'empty',
  "referer": `https://app.letsdeel.com/contract/${contractId}`,
  "accept-language": 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7',
};

const trackDay = async (day) => {
  try {
    return await axios.post(
      url,
      {
        when: day,
        amount: hoursPerDay,
        description: description,
        type: 'work',
      },
      { headers }
    );
  } catch (error) {
    console.error(`error occurred: ${error.message}`);
  }
}

const trackAllDays = async () => {
  try {
    const days = getDaysArray(new Date(startDate), new Date(endDate));
    await Promise.all(days.map(dateToString).map(trackDay));
    console.info(`Successfully tracked ${days.length} days`);
  } catch (error) {
    console.error(`error occurred: ${error.message}`);
  }
};

trackAllDays();
