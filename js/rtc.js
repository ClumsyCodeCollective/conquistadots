var channels = [];
var messages = document.getElementById('messages');

var gocSession = RTC({
    // no media capture required
    constraints: null,

    // specify a chat channel
    channels: {
        chat: true
    },

    // use the public google stun servers :)
    ice: [
        { url: 'stun:stun1.l.google.com:19302' },
        { url: 'stun:stun2.l.google.com:19302' },
        { url: 'stun:stun3.l.google.com:19302' },
        { url: 'stun:stun4.l.google.com:19302' }
    ],

    // specify a fixed room for the demo to use
    room: 'goc_2016_1234'
});


gocSession.on('channel:opened:chat', function(id, dc) {
    dc.onmessage = function(evt) {
        messages.innerHTML = evt.data;
    };

    channels.push(dc);
});

gocSession.on('channel:closed:chat', function(id, dc) {
    var idx = channels.indexOf(dc);
    if (idx >= 0) {
        channels.splice(idx, 1);
    }
});

// Send message to every registered channel
messages.onkeyup = function(evt) {
    channels.forEach(function(channel) {
        channel.send(evt.target.value);
    });
};