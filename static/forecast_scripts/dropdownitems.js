$(() => {
    const selectedDateInput = document.getElementById('selectedDateInput');
    var currentDate = new Date();

    var today = new Date();
    today.setDate(currentDate.getDate());
    var tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);
    var thirdDay = new Date();
    thirdDay.setDate(currentDate.getDate() + 2);
    var fourthDay = new Date();
    fourthDay.setDate(currentDate.getDate() + 3);
    var fifthDay = new Date();
    fifthDay.setDate(currentDate.getDate() + 4);

    $("#todayDropdownItem").on("click", () => {
        updateDropdownButtonText("Today");
        selectedDateInput.value = today;
    });

    $("#tomorrowDropdownItem").on("click", () => {
        updateDropdownButtonText("Tomorrow");
        selectedDateInput.value = tomorrow;

    });


    $("#thirdDayDropdownItem").text(formatDate(thirdDay));
    $("#fourthDayDropdownItem").text(formatDate(fourthDay));
    $("#fifthDayDropdownItem").text(formatDate(fifthDay));

    $("#thirdDayDropdownItem").on("click", () => {
        updateDropdownButtonText(formatDate(thirdDay));
        selectedDateInput.value = thirdDay;

    });

    $("#fourthDayDropdownItem").on("click", () => {
        updateDropdownButtonText(formatDate(fourthDay));
        selectedDateInput.value = fourthDay;

    });

    $("#fifthDayDropdownItem").on("click", () => {
        updateDropdownButtonText(formatDate(fifthDay));
        selectedDateInput.value = fifthDay;

    });

    function formatDate(date) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        var formattedDate = date.toLocaleDateString("en-US", options);
        var day = date.getDate();
        var suffix = day % 10 === 1 && day !== 11 ? "st" :
            day % 10 === 2 && day !== 12 ? "nd" :
                day % 10 === 3 && day !== 13 ? "rd" : "th";
        return formattedDate.replace(day, day + suffix);
    }

    function updateDropdownButtonText(text) {
        $("#dateDropdownBtn").text(text);
    }



    // const weatherForm = document.getElementById('weatherForm');
    // const dateDropdown = document.getElementById('dateDropdownBtn');
    // // const selectedDateInput = document.getElementById('selectedDateInput');

    // weatherForm.addEventListener('submit', function (event) {
    //     const selectedDate = dateDropdown.textContent.trim();
    //     selectedDateInput.value = selectedDate;
    // });
});