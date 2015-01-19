(function() {

  function set_props(obj, props) {
    var result = {},
        prop;

    for (prop in obj) {
      result[prop] = obj[prop];
    }

    for (prop in props) {
      result[prop] = props[prop];
    }

    return result;
  }

  function get_direction(dir, shift) {
    var dirs = ["n", "e", "s", "w"];
    var idx = dirs.indexOf(dir);

    return dirs[(idx + shift) % dirs.length];
  }

  window.Player = function(canvas) {
    this.canvas = new fabric.StaticCanvas(canvas);

    this.transformMatrix = [1, 0, 0, -1, 30, 300];
    this.step = 50;
  };

  (function() {
    this.play = function(commands) {
      this._resetCanvas();

      commands.reduce(this._processCommand.bind(this), {
        x: 0,
        y: 0,
        direction: "n",
        pen: "up"
      });
    };

    this._processCommand = function(state, command) {
      var new_state;
      var update = set_props.bind(null, state);

      switch (command) {
        case "PenDown":
          new_state = update({ pen: "down" });
          break;
        case "PenUp":
          new_state = update({ pen: "up" });
          break;
        case "Turn(-90)":
        case "TurnRight":
          new_state = update({
            direction: get_direction(state.direction, 1)
          });
          break;
        case "Turn(90)":
        case "TurnLeft":
          new_state = update({
            direction: get_direction(state.direction, -1)
          });
          break;
        case "Run(1)":
        case "StepForward":
          var next = this._nextCoords(state);

          if (state.pen === "down") {
            this._drawLine(state, next);
          }
          new_state = update(next);
          break;
        default:
          alert("unknown command: " + command);
          throw Error("Unknown command " + command + ". Unable to proceed");
      }

      return new_state;
    };

    this._nextCoords = function(state) {
      var addx, addy;

      switch (state.direction) {
        case"n": addx = 0; addy = this.step; break;
        case"s": addx = 0; addy = - this.step; break;
        case"e": addx = this.step; addy = 0; break;
        case"w": addx = - this.step; addy = 0; break;
      }

      return {
        x: state.x + addx,
        y: state.y + addy
      };
    };

    this._drawLine = function(from, to) {
      this.canvas.add(new fabric.Line(
        [from.x, from.y, to.x, to.y], {
          transformMatrix: this.transformMatrix,
          originX: "center",
          originY: "center",
          strokeWidth: 3,
          fill: 'red',
          stroke: 'red'
        }));
    };

    this._resetCanvas = function() {
      var objs = this.canvas.getObjects();

      while (objs && objs.length) {
        this.canvas.remove(objs[0]);
      }
    };

  }.apply(Player.prototype));

}());
