var channels = [];
var realmName = 'GameOfCode';
var gameSession;
var dynamicNames=true;

var maxConnections = 2;

var ownUsername;
var ownStatus = 'pending';
var ownSettings;

var rtcUsers = [];
var statusRefreshInterval;
var configWorld;
var game;

var playerColors = [
    ['#ff0000', '#ff9999'],
    ['#00ff00', '#99ff99',],
    ['#0000ff', '#9999ff',]
];

var playerPositions = [
    [56, 26],
    [176, 26],
    [116, 86],
];

var firstNames = ['Eric', 'John', 'Kenny', 'Michael', 'Dan', 'George', 'Thomas',
    'Sophia', 'Emma', 'Lily', 'Hannah', 'Tina'];
var lastNames = ['Johnson', 'Loggins', 'Jackson', 'Carpenter', 'Smith', 'Jones', 'Williams', 'Taylor',
    'Wright', 'Turner', 'Cooper'];

function getRandomName() {
    var firstIndex = Math.floor(Math.random()*firstNames.length);
    var lastIndex = Math.floor(Math.random()*lastNames.length);
    return firstNames[firstIndex] + lastNames[lastIndex];
}

function updatePlayerStatus() {
    $('#playerCount').html((channels.length + 1) + ' players');

    $('#me .name').html(ownUsername);
    $('#me .status').html(ownStatus);

    for (var i=0;i<maxConnections; i++) {
        $('#opponent-' + i + ' .name').html('');
        $('#opponent-' + i + ' .status').html('');
    }
    rtcUsers.forEach(function(rtcUser) {
        var idx = rtcUsers.indexOf(rtcUser);
        $('#opponent-' + idx + ' .name').html(rtcUser.username);
        $('#opponent-' + idx + ' .status').html(rtcUser.status);
    });
    $('#playerStatus').html(playerStatus);
}

function sendToChannel(channel, payload) {
    if (channel.readyState == 'open') {
        channel.send(JSON.stringify(payload));
    }
    else {
        var channelIndex = channels.indexOf(channel);
        rtcUsers[channelIndex].status = 'disconnected';
    }
}

function sendToAllChannel(payload) {
    channels.forEach(function(channel) {
        sendToChannel(channel, payload);
    });
}

function getGameSettings() {
    if (ownStatus != 'ready') {
        return {};
    }
    if (ownSettings === undefined) {
        var reproduction = $('#reproduction').prop('checked') ? 1 : 0;
        var survival = $('#survival').prop('checked') ? 1 : 0;
        var defense = $('#defense').prop('checked') ? 1 : 0;
        var attack = $('#attack').prop('checked') ? 1 : 0;

        ownSettings = {
            'name' : ownUsername,
            'initialState' : configWorld.grid,
            'reproductionMod' : reproduction,
            'survivalMod' : survival,
            'defenseMod' : defense,
            'attackMod' : attack,
        };
    }
    return ownSettings;
}

$(document).ready(function() {
    configWorld = new World("initCanvas", 8, 8, 25);
    configWorld.enablePlacementForPlayer(-1);

    game = new GameOfLife("gameCanvas");


    statusRefreshInterval = setInterval(function() {
        sendToAllChannel({'action':'get_status'});
        var isEveryoneReady = true;
        if (rtcUsers.length < 2) {
            isEveryoneReady = false;
        }
        if (ownStatus != 'ready') {
            isEveryoneReady = false;
        }
        rtcUsers.forEach(function(rtcUser) {
            console.log(rtcUser.status);
            if (rtcUser.status != 'ready') {

                isEveryoneReady = false;
            }
        });
        updatePlayerStatus();
        if (isEveryoneReady) {
            clearInterval(statusRefreshInterval);
            var users = [];
            rtcUsers.forEach(function(rtcUser) {
                users.push({'username': rtcUser.username, 'index': rtcUsers.indexOf(rtcUser)});
            });

            users.push({'username': ownUsername, 'index': -1});
            users.sort(function(a,b) {return (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0)});

            for (var i in users) {
                if (users[i].index >= 0) {
                    var player = new Player(
                        users[i].username,
                        playerColors[i][0],
                        playerColors[i][1],
                        rtcUsers[users[i].index].settings.initialState,
                        playerPositions[i][0],
                        playerPositions[i][1],
                        rtcUsers[users[i].index].settings.reproductionMod,
                        rtcUsers[users[i].index].settings.survivalMod,
                        rtcUsers[users[i].index].settings.defenseMod,
                        rtcUsers[users[i].index].settings.attackMod
                    );
                }
                else {
                    var player = new Player(
                        ownUsername,
                        playerColors[i][0],
                        playerColors[i][1],
                        configWorld.grid,
                        playerPositions[i][0],
                        playerPositions[i][1],
                        getGameSettings().reproductionMod,
                        getGameSettings().survivalMod,
                        getGameSettings().defenseMod,
                        getGameSettings().attackMod
                    );
                }
                players.push(player);
            }
            $("#gameStart").hide();
            $("#game").show();
            game.init();
            setInterval(function(){game.iterate()},10)
        }

    }, 1000);
    $('#ready').on('click', function() {
        ownStatus = 'ready';
        $(this).attr('disabled', 'disabled');
    });

    $('#reload').on('click', function() {location.reload();});

    if (dynamicNames) {
        $('#username').val(getRandomName());
    }

    ownStatus = 'connected';
    ownUsername = $('#username').val();

    $('#connect').on('click', function () {
        $('.toggler').toggle();
        $('#playerCount').html('Waiting for players');
        realmName = $('#realmName').val();
        ownUsername = $('#username').val();

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
            if (channels.length + 1 > maxConnections) {
                sendToChannel(dc, {'error':'realm is full'});
                return;
            }

            channels.push(dc);
            var id = channels.indexOf(dc);
            sendToChannel(dc, {'action':'get_username'});
            rtcUsers[id] = {'username':'', 'status': 'connected'};
            dc.onmessage = function (evt) {
                message = JSON.parse(evt.data);
                if (message.action == 'get_username') {
                    sendToChannel(dc, {'action':'username_reply', 'username':ownUsername});
                }
                else if (message.action == 'username_reply') {
                    if (rtcUsers[id] != undefined) {
                        rtcUsers[id].username = message.username;
                    }
                }
                else if (message.action == 'get_status') {
                    sendToChannel(dc, {'action':'status_reply', 'status': ownStatus, 'settings': getGameSettings()})
                }
                else if (message.action == 'status_reply') {
                    if (rtcUsers[id] != undefined) {
                        rtcUsers[id].status = message.status;
                        rtcUsers[id].settings = message.settings;
                    }
                }
                else {
                    $('#me .error').html('Error: ' + message.error);
                    $('#me .status').html('disconnected');

                    $('#ready').hide();
                    $('#reload').show();

                    clearInterval(statusRefreshInterval);
                }
            };

            updatePlayerStatus();
        });

        gameSession.on('channel:closed:chat', function (id, dc) {
            var idx = channels.indexOf(dc);
            if (idx >= 0) {
                channels.splice(idx, 1);
                rtcUsers.splice(idx, 1);
            }
            updatePlayerStatus();
        });
    });
});
