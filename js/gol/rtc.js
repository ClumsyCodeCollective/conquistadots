var channels = [];
var messages = document.getElementById('messages');
var roomName;
var gameSession;

$(document).ready(function() {
    $('#connect').on('click', function () {
        roomName = $('#room_name').val();
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
            room: 'goc_clumsy_' + roomName
        });

        gameSession.on('channel:opened:chat', function (id, dc) {
            dc.onmessage = function (evt) {
                console.log('message received:' + evt.data);
                messages.innerHTML = evt.data;
            };

            console.log('add');
            channels.push(dc);
        });

        gameSession.on('channel:closed:chat', function (id, dc) {
            console.log('chanel closed');
            console.log(dc);
            var idx = channels.indexOf(dc);
            if (idx >= 0) {
                channels.splice(idx, 1);
            }
        });
    });
});

// Send message to every registered channel
messages.onkeyup = function(evt) {
    channels.forEach(function(channel) {
        console.log('send to peer ' + evt.target.value);
        channel.send(evt.target.value);
    });
};
