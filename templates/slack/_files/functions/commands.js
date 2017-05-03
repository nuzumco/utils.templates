/**
  Service Function: /commands
    Slack Commands Handler

    Due to Slack's 3000ms timeout, this function returns an HTTP 200 OK
      (via callback(null, data)) response as quickly as possible to tell Slack
      you've received the event. It then sends an async webhooked request to
      StdLib to continue the operations of the bot.

    You can test from the command line using:
      lib .commands --command COMMAND --text TEXT --channel CHANNEL [--user USER]
*/

const lib = require('lib');

/**
* @returns {object}
*/
module.exports = (name = '', text = '', channel = '', user = '', context, callback) => {

  let command = context.params;
  command.command = command.command || name;

  if (!command.command) {
    return callback(null, {error: 'No command specified'});
  }

  if (command.command[0] !== '/') {
    return callback(null, {error: 'Commands must start with /'});
  }

  command.name = command.command.substr(1);
  command.channel = channel = command.channel_id || channel;
  command.user = user = command.user_id || user;

  // Setting background: true allows for async handling by StdLib
  lib({backgroundk: true})[`${context.service.identifier}.handler`](
    {
      token: command.token,
      team_id: command.team_id,
      channel: channel,
      command: command
    },
    (err, result) => {

      // Provide quick empty 200 OK
      return callback(null, {
        response_type: 'in_channel',
        text: ''
      });

    }
  );

};
