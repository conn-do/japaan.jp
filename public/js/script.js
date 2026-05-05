$(function() {
    var DateTime = luxon.DateTime;

    $('.from2014').html(getDiffYears('2014'));

    function getDiffYears(fromYear) {
        return Math.round(
            Math.abs(
                DateTime.fromISO(fromYear + '-04-01').diffNow('years').years
            )
        );
    }
});
