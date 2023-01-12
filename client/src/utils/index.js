// calculate the days left
export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);
  
  return remainingDays.toFixed(0);
};
  
// calculate the bar percentage depending on how much money was donated
export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);
  
  return percentage;
};
  
// check if image is alright 
export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;
  
  if (img.complete) callback(true);
  
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};