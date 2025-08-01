import React from "react";

const convertToIndianWords = (num) => {
  if (num === 0) return "zero";
  if (isNaN(num)) return "Not a number";

  const units = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  let words = "";

  // Function to convert 2-digit numbers
  const convertTwoDigits = (n) => {
    if (n === 0) return "";
    else if (n < 10) return units[n];
    else if (n < 20) return teens[n - 10];
    else {
      const ten = Math.floor(n / 10);
      const unit = n % 10;
      return tens[ten] + (unit !== 0 ? "-" + units[unit] : "");
    }
  };

  // Function to handle hundreds
  const handleHundreds = (n) => {
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;

    let result = "";
    if (hundred > 0) {
      result += units[hundred] + " hundred";
      if (remainder > 0) result += " and ";
    }

    if (remainder > 0) {
      result += convertTwoDigits(remainder);
    }

    return result;
  };

  // Handle the Indian numbering system properly
  if (num >= 1000000000) {
    // Arab (100 crore)
    const arab = Math.floor(num / 1000000000);
    words += handleHundreds(arab) + " arab";
    num %= 1000000000;
    if (num > 0) words += " ";
  }

  if (num >= 10000000) {
    // Crore (10 million)
    const crore = Math.floor(num / 10000000);
    words += handleHundreds(crore) + " crore";
    num %= 10000000;
    if (num > 0) words += " ";
  }

  if (num >= 100000) {
    // Lakh (100 thousand)
    const lakh = Math.floor(num / 100000);
    words += handleHundreds(lakh) + " lakh";
    num %= 100000;
    if (num > 0) words += " ";
  }

  if (num >= 1000) {
    // Thousand
    const thousand = Math.floor(num / 1000);
    words += handleHundreds(thousand) + " thousand";
    num %= 1000;
    if (num > 0) words += " ";
  }

  if (num > 0) {
    words += handleHundreds(num);
  }

  return words.trim();
};

const NumberToText = (number) => {
  const text = convertToIndianWords(number);
  return text;
};

export default NumberToText;
