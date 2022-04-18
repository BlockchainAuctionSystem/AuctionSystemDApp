const formatDate= (seconds) => {
    const date = new Date(1970, 0, 1);
    date.setSeconds(seconds);
    const firstOptions = {weekday: 'short', minute: '2-digit', hour: '2-digit'};
    const longOptions= {weekday: 'short', minute: '2-digit', hour: '2-digit', day: 'numeric', month: 'long'};
    const monthOptions  = {month: 'short'};
    const dayOptions = {day: 'numeric'};
    return {
      dayHour: date.toLocaleDateString('en-US', firstOptions),
      month: date.toLocaleDateString('en-US', monthOptions),
      day: date.toLocaleDateString('en-US', dayOptions),
      long: date.toLocaleDateString('en-US', longOptions),
    };
  };
  
export {
  formatDate,
};
