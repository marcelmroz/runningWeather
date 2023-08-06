$(() => {
    $("#todayDropdownItem").on("click", () => {
        updateDropdownButtonText("Today");
    });

    $("#tomorrowDropdownItem").on("click", () => {
        updateDropdownButtonText("Tomorrow");
    });

    var currentDate = new Date();
    var thirdDay = new Date();
    thirdDay.setDate(currentDate.getDate() + 2);
    var fourthDay = new Date();
    fourthDay.setDate(currentDate.getDate() + 3);
    var fifthDay = new Date();
    fifthDay.setDate(currentDate.getDate() + 4);

    $("#thirdDayDropdownItem").text(formatDate(thirdDay));
    $("#fourthDayDropdownItem").text(formatDate(fourthDay));
    $("#fifthDayDropdownItem").text(formatDate(fifthDay));

    $("#thirdDayDropdownItem").on("click", () => {
        updateDropdownButtonText(formatDate(thirdDay));
    });

    $("#fourthDayDropdownItem").on("click", () => {
        updateDropdownButtonText(formatDate(fourthDay));
    });

    $("#fifthDayDropdownItem").on("click", () => {
        updateDropdownButtonText(formatDate(fifthDay));
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
});