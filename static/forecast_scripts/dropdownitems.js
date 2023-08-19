$(() => {
  const selectedDateInput = document.getElementById('selectedDateInput');
  const currentDate = new Date();

  const today = new Date();
  today.setDate(currentDate.getDate());
  const tomorrow = new Date();
  tomorrow.setDate(currentDate.getDate() + 1);
  const thirdDay = new Date();
  thirdDay.setDate(currentDate.getDate() + 2);
  const fourthDay = new Date();
  fourthDay.setDate(currentDate.getDate() + 3);
  const fifthDay = new Date();
  fifthDay.setDate(currentDate.getDate() + 4);

  $('#todayDropdownItem').on('click', () => {
    updateDropdownButtonText('Today');
    selectedDateInput.value = today;
  });

  $('#tomorrowDropdownItem').on('click', () => {
    updateDropdownButtonText('Tomorrow');
    selectedDateInput.value = tomorrow;
  });


  $('#thirdDayDropdownItem').text(formatDate(thirdDay));
  $('#fourthDayDropdownItem').text(formatDate(fourthDay));
  $('#fifthDayDropdownItem').text(formatDate(fifthDay));

  $('#thirdDayDropdownItem').on('click', () => {
    updateDropdownButtonText(formatDate(thirdDay));
    selectedDateInput.value = thirdDay;
  });

  $('#fourthDayDropdownItem').on('click', () => {
    updateDropdownButtonText(formatDate(fourthDay));
    selectedDateInput.value = fourthDay;
  });

  $('#fifthDayDropdownItem').on('click', () => {
    updateDropdownButtonText(formatDate(fifthDay));
    selectedDateInput.value = fifthDay;
  });

  function formatDate(date) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const formattedDate = date.toLocaleDateString('en-US', options);
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
            day % 10 === 2 && day !== 12 ? 'nd' :
                day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    return formattedDate.replace(day, day + suffix);
  }

  function updateDropdownButtonText(text) {
    $('#dateDropdownBtn').text(text);
  }
});
