Web = {
    showChart: function(statistics) {
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        var data = _.map(statistics, function(elem){
            return {
                label: TAPi18n.__(elem._id),
                value: elem.count,
                color: getRandomColor()
            };
        });
        $('.piechart').each(function(index){
            var ctx = $(this).get(0).getContext('2d');
            ctx.canvas.width = $('.chartcontainer').width()-40;
            ctx.canvas.height = ctx.canvas.width;
            var myPieChart = new Chart(ctx).Pie(data);
        })
    },
    positionLogo: function() {
        $('.map-logo').css('left', $("#mark").position().left);
    },
    showTab: function(tab) {
        $('div.tabbody').hide();
        var active = $($('#' + tab).attr('href'));
        active.show();

        $('.tabbody').hide();
        $('.tab').css('border-bottom', '0px solid orange');
        $('.tab a').css('border-bottom', '0px solid orange');
        $('#tabhome').css('border-bottom', '2px solid orange');
        $('#' + tab).show();

        $('#tab' + tab).addClass('active');
        $('.tab').css('border-bottom', '0px solid orange');
        $('.tab a').css('border-bottom', '0px solid orange');
        $('#tab' + tab).css('border-bottom', '2px solid orange');
    },
    showHome: function() {
        $('.tabbody').hide();
        $('.tab').css('border-bottom', '0px solid orange');
        $('.tab a').css('border-bottom', '0px solid orange');
        $('#tabhome').css('border-bottom', '2px solid orange');
        $('#home').show();
    },
    backToList: function() {
        $('#dettaglio').hide();
        $('#lista').show();
    }
}
