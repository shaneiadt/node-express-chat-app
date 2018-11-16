$(() => {
    let socket = io.connect('http://localhost:3000');

    let message = $('#message');
    let username = $('#username');
    let send_message = $('#send_message');
    let send_username = $('#send_username');
    let chatroom = $('#chatroom');
    let feedback = $('#feedback');
    let history = $('#chatroom_history');

    send_message.click(() => {
        socket.emit('new_message', {
            message: message.val()
        });
    });

    socket.on('new_message', (data) => {
        chatroom.append(`<p class='message'>${data.username}: ${data.message}</p>`);
    });

    send_username.click(() => {
        socket.emit('change_username', {
            username: username.val()
        });
    });

    message.on("keypress", () => {
        socket.emit('typing');
    });

    message.on('blur', () => {
        socket.emit('done');
    });

    $('#view_history').on('click', () => {
        history.toggle();
        chatroom.toggle();
        socket.emit('history');
    });

    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
    });

    socket.on('done', (data) => {
        feedback.empty();
    });

    socket.on('history', (data) => {
            let allHistory = data.map((item, i) => {
                    return `<p class='message'>${item.username}: ${item.message}</p>`;
            });
            history.html(allHistory);
    });

});