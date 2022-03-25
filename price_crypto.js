const fetch = require("node-fetch");

const jsdom = require("jsdom");

const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "15426683",
  apiSecret: "zmgp0UuRiM78BjKG",
});

async function fetchHTML(url) {
  try {
    //accessing the url
    const response = await fetch(url);

    //getting the text of the url
    const text = await response.text();

    //convert the text to an object. This is our final product
    // const page = new DOMParser().parseFromString(text, "text/html");
    const page = new jsdom.JSDOM(text);

    return page;
  } catch (error) {
    return false;
  }
}

function getPrice(page) {
  const obj = page.window.document.querySelector(".priceValue");
  let price = obj.textContent;
  const priceAsNumber = Number(price.replace(/[^0-9.-]+/g, ""));
  return priceAsNumber;
}

function checkThreshold(price, threshold) {
  if (price > threshold) {
    // console.log(`The price is over $${threshold.toLocaleString()} \n`);
    return true;
  } else {
    // console.log(`The price is not over $${threshold.toLocaleString()} \n`);
    return false;
  }
}

//send sms with send77api from rapidapi

async function sendMessage(cryptoName, price) {
  const from = "Vonage APIs";
  const to = "584246200372";
  const text = `The current price of ${cryptoName} is $${price}`;

  vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
}

//create an array  of crypto names
// const cryptoNameArray = [
//   "bitcoin",
//   "ethereum",
//   "ripple",
//   "litecoin",
//   "cardano",
// ];

//lets use an object
const cryptoDictionary = {
  bitcoin: 35000,
  ethereum: 2000,
  litecoin: 2000,
  ripple: 1,
  cardano: 1.5,
};

//loop through the templateUrl Array
for (const cryptoName in cryptoDictionary) {
  //create a template url where we can switch in our crypto names
  let templateUrl = `https://coinmarketcap.com/currencies/${cryptoName}`;

  fetchHTML(templateUrl).then((page) => {
    const price = getPrice(page);

    console.log(`The current price of ${cryptoName} is $${price}`);

    if (checkThreshold(price, cryptoDictionary[cryptoName])) {
      sendMessage(cryptoName, price);
    }
  });
}