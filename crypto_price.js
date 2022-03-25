// const fetch = require("node-fetch");
// const jsdom = require("jsdom");

async function fetchHTML(url) {
    try {
      //accessing the url
      const response = await fetch(url);
  
      //getting the text of the url
      const text = await response.text();
  
      //convert the text to an object. This is our final product
      const page = new DOMParser().parseFromString(text, "text/html");
  
      return page;
    } catch (error) {
      return false;
    }
  }
  
  function getPrice(page) {
    const obj = page.querySelector(".priceValue");
    let price = obj.innerText;
    const priceAsNumber = Number(price.replace(/[^0-9.-]+/g, ""));
    return priceAsNumber;
  }
  
  function checkThreshold(price, threshold) {
    if (price > threshold) {
      console.log(`The price is over $${threshold}`);
    } else {
      console.log(`The price is not over $${threshold}`);
    }
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
    bitcoin: 30000,
    ethereum: 6000,
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
  
      checkThreshold(price, cryptoDictionary[cryptoName]);
    });
  }