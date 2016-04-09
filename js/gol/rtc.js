var channels = [];
var messages = document.getElementById('messages');
var realmName;
var gameSession;
var dynamicNames=true;

function getName() {
    var firstNames = ['Eric', 'John', 'Kenny', 'Michael'];
    var lastNames = ['Johnson', 'Loggins', 'Jackson', 'Carpenter'];
    return  firstNames[Math.floor(Math.random()*firstNames.length)]
        + lastNames[Math.floor(Math.random()*lastNames.length)];
}

$(document).ready(function() {
    $('#username').attr('value', getName());
    $('#connect').on('click', function () {
        $('.toggler').toggle();
        $('#playerCount').html('Waiting for players');
        realmName = $('#realmName').val();
        gameSession = RTC({
            constraints: null,
            channels: {
                chat: true
            },
            signaller: 'http://40.68.217.18:3000/',
            ice: [
                {url: 'stun:40.68.217.18:3478'},
                {
                    url: 'turn:40.68.217.18',
                    credential: 'clumsy',
                    username: 'conquistadots'
                },
            ],
            room: 'goc_clumsy_' + realmName
        });

        gameSession.on('channel:opened:chat', function (id, dc) {
            dc.onmessage = function (evt) {
                console.log('message received:' + evt.data);
                messages.innerHTML = evt.data;
            };

            console.log('add');
            channels.push(dc);
            $('#playerCount').html((channels.length + 1) + ' players');
        });

        gameSession.on('channel:closed:chat', function (id, dc) {
            console.log('chanel closed');
            console.log(dc);
            var idx = channels.indexOf(dc);
            if (idx >= 0) {
                channels.splice(idx, 1);
            }
            $('#playerCount').html((channels.length + 1) + ' players');
        });
    });
});

// Send message to every registered channel
// messages.onkeyup = function(evt) {
//     channels.forEach(function(channel) {
//         console.log('send to peer ' + evt.target.value);
//         channel.send(evt.target.value);
//     });
// };
