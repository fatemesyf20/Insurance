//vaiables
const form = document.querySelector("#request-quote");

const html = new HTMLUI();

const content = document.getElementById("content");

//evenet listeners
eventListeners();

function eventListeners() {
  //make option tag for select
  document.addEventListener("DOMContentLoaded", function () {
    html.displayYear();
  });
  //submit form
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    //read value from the form
    const make = document.getElementById("make").value;
    const year = document.getElementById("year").value;
    const level = document.querySelector('input[name="level"]:checked').value;
    //check the value og fields are correct
    if (make === "" || year === "" || level === "") {
      html.displayError("لطفا همه ی موارد را پر کنید!");
    } else {
      let resultDiv = document.querySelector("#result div");
      if (resultDiv !== null) {
        resultDiv.remove();
      } else {
      }
      const insurance = new Insurance(make, year, level);

      const price = insurance.calculatePrice(insurance);
      html.showResult(price, insurance);
    }
  });
}

//objects
//every thing realted to the insutance
function Insurance(make, year, level) {
  this.make = make;
  this.year = year;
  this.level = level;
}
// calculating the price
Insurance.prototype.calculatePrice = function (info) {
  let price;
  let base = 2000000;
  /*
make:1 ==> Pride 1.15
make:2 ==> Optima 1.30
make:3 ==> Porches 1.80
*/
  const make = info.make;
  switch (make) {
    case "1":
      price = base * 1.15;
      break;
    case "2":
      price = base * 1.3;
      break;
    case "3":
      price = base * 1.8;
      break;
  }

  let level = info.level;
  if (level == "basic") {
    price = price;
  } else {
    price = price * 1.75;
  }
  //get the year
  const year = info.year;
  const diffrence = this.getYearDiffernce(year);
  //3% cheaper for each year
  price = price - ((diffrence * 3) / 100) * price;
  return price;
};

Insurance.prototype.getYearDiffernce = function (year) {
  var persianNumbers = [
      /۰/g,
      /۱/g,
      /۲/g,
      /۳/g,
      /۴/g,
      /۵/g,
      /۶/g,
      /۷/g,
      /۸/g,
      /۹/g,
    ],
    arabicNumbers = [
      /٠/g,
      /١/g,
      /٢/g,
      /٣/g,
      /٤/g,
      /٥/g,
      /٦/g,
      /٧/g,
      /٨/g,
      /٩/g,
    ],
    fixNumbers = function (str) {
      if (typeof str === "string") {
        for (var i = 0; i < 10; i++) {
          str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
      }
      return str;
    };
  const dateFa = new Date().toLocaleDateString("fa-IR");
  let yearFa = dateFa.slice(0, 4);
  let max = fixNumbers(yearFa);
  year = max - year;
  return year;
};

//eveery thing related to the html
function HTMLUI() {}

HTMLUI.prototype.displayYear = function () {
  var persianNumbers = [
      /۰/g,
      /۱/g,
      /۲/g,
      /۳/g,
      /۴/g,
      /۵/g,
      /۶/g,
      /۷/g,
      /۸/g,
      /۹/g,
    ],
    arabicNumbers = [
      /٠/g,
      /١/g,
      /٢/g,
      /٣/g,
      /٤/g,
      /٥/g,
      /٦/g,
      /٧/g,
      /٨/g,
      /٩/g,
    ],
    fixNumbers = function (str) {
      if (typeof str === "string") {
        for (var i = 0; i < 10; i++) {
          str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
      }
      return str;
    };
  const dateFa = new Date().toLocaleDateString("fa-IR");
  let yearFa = dateFa.slice(0, 4);
  let max = fixNumbers(yearFa);
  let min = max - 20;

  const selectYear = document.getElementById("year");
  for (let index = max; index > min; index--) {
    const option = document.createElement("option");

    option.value = index;
    option.innerText = index;
    selectYear.appendChild(option);
  }
};
//display error on the form
HTMLUI.prototype.displayError = function (err) {
  const div = document.createElement("div");
  div.classList = "error";
  div.innerText = err;
  form.insertBefore(div, document.querySelector(".form-group"));
  //rmeove error after 3second
  setTimeout(() => {
    document.querySelector(".error").remove();
  }, 2000);
};
//display factor to the form
HTMLUI.prototype.showResult = function (price, info) {
  // acces to the div
  const result = document.querySelector("#result");
  //create div for the showing price
  const div = document.createElement("div");
  //convert make value to the car
  let make = info.make;
  switch (make) {
    case "1":
      make = "پراید";
      break;
    case "2":
      make = "اپتیما";
      break;
    case "3":
      make = "پورشه";
      break;
  }
  //convert level to the persian
  let level = info.level;
  if (level == "basic") {
    level = "ساده";
  } else {
    level = "تکمیلی";
  }
  div.innerHTML = `
  <p class='header' > خلاصه فاکتور </p>
  <p> مدل ماشین : ${make}</p>
  <p> سال ساخت : ${info.year}</p>
  <p> نوع بیمه : ${level}</p>
     <p class = 'total' >  قیمت نهایی : ${price} تومان</p>
     `;
  //show spinner
  const spinner = document.querySelector("#loading img");
  spinner.style.display = "block";
  setTimeout(() => {
    spinner.style.display = "none";
    //append div to the result
    result.appendChild(div);
  }, 2000);
};
