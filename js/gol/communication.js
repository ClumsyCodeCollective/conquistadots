var channels = [];
var realmName = 'GameOfCode';
var gameSession;
var dynamicNames=true;

var ownName;
var ownStatus = 'pending';

var rtcUsers = [];
var statusRefreshInterval;

var firstNames = ['Eric', 'John', 'Kenny', 'Michael', 'Dan', 'George', 'Thomas'];
var lastNames = ['Johnson', 'Loggins', 'Jackson', 'Carpenter', 'Smith', 'Whatever'];

function getRandomName() {
    var firstIndex = Math.floor(Math.random()*firstNames.length);
    var lastIndex = Math.floor(Math.random()*lastNames.length);
    return firstNames[firstIndex] + lastNames[lastIndex];
}

function updatePlayerStatus() {
    $('#playerCount').html((channels.length + 1) + ' players');

    var playerStatus = ownName + '(' + ownStatus + ')' + '<br/>';
    rtcUsers.forEach(function(rtcUser) {
        playerStatus = playerStatus + rtcUser.username + '(' + rtcUser.status + ')' + '</br>' ;
    });
    $('#playerStatus').html(playerStatus);
}

function sendToChannel(channel, payload) {
    if (channel.readyState == 'open') {
        channel.send(JSON.stringify(payload));
    }
    else {
        var channelIndex = channels.indexOf(channel);
        console.log('Channel suddenly closed: ' + channelIndex);
        rtcUsers[channelIndex].status = 'disconnected';
    }
}

function sendToAllChannel(payload) {
    channels.forEach(function(channel) {
        sendToChannel(channel, payload);
    });
}

$(document).ready(function() {
    statusRefreshInterval = setInterval(function() {
        sendToAllChannel({'action':'get_status'});
        var isEveryoneReady = true;
        if (rtcUsers.length < 3) {
            isEveryoneReady = false;
        }
        rtcUsers.forEach(function(rtcUser) {
            if (rtcUser.status != 'ready') {
                console.log(rtcUser.status);
                isEveryoneReady = false;
            }
        });
        if (isEveryoneReady) {
            alert('reeeady');
        }
        updatePlayerStatus();
    }, 1000);
    $('#ready').on('click', function() {
        ownStatus = 'ready';
    });

    if (dynamicNames) {
        $('#username').attr('value', getRandomName());
    }

    ownName = $('#username').attr('value');
    ownStatus = 'connected';
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
            room: 'goc_clumsy_' + realmName,
        });

        gameSession.on('channel:opened:chat', function (id, dc) {
            channels.push(dc);
            var id = channels.indexOf(dc);
            send(id, {'action':'get_username'});
            rtcUsers[id] = {'username':'', 'status': 'connected'};
            dc.onmessage = function (evt) {
                message = JSON.parse(evt.data);
                if (message.action == 'get_username') {
                    sendToChannel(dc, {'action':'username_reply', 'username':ownName});
                }
                else if (message.action == 'username_reply') {
                    rtcUsers[id].username = message.username;
                }
                else if (message.action == 'get_status') {
                    sendToChannel(dc, {'action':'status_reply', 'status': ownStatus})
                }
                else if (message.action == 'status_reply') {
                    rtcUsers[id].status = message.status;
                }
            };

            updatePlayerStatus();
        });

        gameSession.on('channel:closed:chat', function (id, dc) {
            console.log('channel closed');
            var idx = channels.indexOf(dc);
            if (idx >= 0) {
                channels.splice(idx, 1);
                rtcUsers.splice(idx, 1);
            }
            updatePlayerStatus();
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
