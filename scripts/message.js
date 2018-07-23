// var bc = new BroadcastChannel('test_channel2323232323232');
//
// // bc.onmessage = function(ev) {
// //   //event.source.postMessage("Responding to 222" + event.data);
// //   console.log(ev);
// // }
// bc.postMessage('This is a test message.');
// self.addEventListener("message", function(event) {
//   event.source.postMessage("Responding to " + event.data);
// });

self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg +
        '. (buttons will no longer work)');
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg, self);
  };
}, false);
