
//function to generate random number
export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

//function to generate random code
export const generateRandomCode = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomCode = "";

  for (let i = 0; i < length; i++) {
    randomCode += characters[Math.floor(Math.random() * characters.length)];
  }

  return randomCode;
};