(function() {
  var player = new Player(document.querySelector("#draw_area"));
  document.querySelector("#run").onclick = function() {
    var commands = document.querySelector("#commands")
                           .value
                           .split(/\n/)
                           .map(function(str) {
                             return str.replace(/^\s+|\s+$/g, "");
                           })
                           .filter(function(str) {
                             return str.length > 0 &&
                                    !str.match(/^\s*#/);
                          });

    if (!commands.length) return alert("no commands were entered");

    player.play(commands);
  };
}());
