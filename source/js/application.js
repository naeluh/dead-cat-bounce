import '../css/application.scss'
import $ from 'jquery'
import './wobbler.js'
import './decomp.js'
import './pathseg.js'
import Matter from 'matter-js'

const cats = [
  require("../img/cats/cat_1.png"),
  require("../img/cats/cat_2.png"),
  require("../img/cats/cat_3.png"),
  require("../img/cats/cat_4.png"),
  require("../img/cats/cat_5.png"),
  require("../img/cats/cat_6.png")
];
const rainbow_cats = [
  require("../img/rainbow/cat_1.png"),
  require("../img/rainbow/cat_2.png"),
  require("../img/rainbow/cat_3.png"),
  require("../img/rainbow/cat_4.png"),
  require("../img/rainbow/cat_5.png"),
  require("../img/rainbow/cat_6.png")
];
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const Body = Matter.Body;
const Svg = Matter.Svg;
const Vertices = Matter.Vertices;
const Composites = Matter.Composites;
const MouseConstraint = Matter.MouseConstraint;
const Mouse = Matter.Mouse;
let engine = Engine.create();
const _restitution = 1.0001;
const _friction = 1;
const _frictionAir = 0.0001;
const _frictionStatic = 15;
const _density = 0.01;
const mirainbow = $("#makeItRainbow");
const mirain = $("#makeItRain");
const defaultCategory = 0x0001;
const redCategory = 0x0002;
const greenCategory = 0x0004;
const blueCategory = 0x0008;
const cArr = [];
let rainbow = false;
let width = $(window).width();
let height = $(window).height();
let sx = width >= 414 ? 1 : 0.5;
let sy = width >= 414 ? 1 : 0.5;
let count1 = 0;
let count2 = 0;
const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateCats = function generateCats(arr) {
  const width = $(window).width();
  const height = $(window).height();
  const sx = width >= 414 ? 1 : 0.5;
  const sy = width >= 414 ? 1 : 0.5;
  let index = 0;
  const stack = Composites.stack(0, -height * 2.55, 10, 8, getRandomArbitrary(0, 50), getRandomArbitrary(0, 50), (x, y) => {
    index = index >= 6 ? 0 : index++;
    return Bodies.circle(x, y, 100, {
      restitution: _restitution,
      friction: _friction,
      frictionAir: _frictionAir,
      frictionStatic: _frictionStatic,
      density: _density,
      collisionFilter: {
        category: redCategory,
        mask: redCategory | greenCategory | blueCategory
      },
      render: {
        sprite: {
          texture: arr[index++],
          xScale: sx,
          yScale: sy
        }
      }
    });
  });
  return stack;
};
const init = function init() {
  $("canvas").remove();
  const colorOne = `#${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
  const colorTwo = "#fff";
  const orientation = "180deg";
  width = $(window).width();
  height = $(window).height();
  sx = width >= 414 ? 1 : 0.5
  sy = width >= 414 ? 1 : 0.5
  World.clear(engine.world);
  Engine.clear(engine);
  engine = Engine.create({
    //positionIterations: 4,
    //velocityIterations: 4,
    //constraintIterations: 4
  });
  engine.timing.timeScale = 1
  const render = Render.create({
    element: document.body,
    engine,
    setPixelRatio: "auto",
    options: {
      showAngleIndicator: false,
      showInternalEdges: false,
      showDebug: false,
      wireframes: false,
      background: "transparent",
      width,
      height
    }
  });
  document.body.style.backgroundImage = `linear-gradient(${orientation}, ${colorOne}, ${colorTwo})`;
  World.add(engine.world, [
    Bodies.rectangle(width / 2, height + 50, width, 100, {
      isStatic: true
    }),
    Bodies.rectangle(width / 2, -1000, width, 100, {
      isStatic: true
    }),
    Bodies.rectangle(-50, height / 2, 100, height, {
      isStatic: true
    }),
    Bodies.rectangle(width + 50, height / 2, 100, height, {
      isStatic: true
    })
  ]);
  cats.forEach((i, v) => {
    cArr[v] = Bodies.circle(Math.random() * width, Math.random() * height - height, 100, {
      restitution: 0.75 + Math.random(),
      friction: 1 + Math.random(),
      //frictionAir: 0.0001,
      frictionStatic: 0,
      density: 0.0000000001 + Math.random(),
      //inertia: Infinity,
      collisionFilter: {
        category: redCategory,
        mask: defaultCategory
      },
      render: {
        sprite: {
          texture: i,
          xScale: sx,
          yScale: sy
        }
      }
    });
    World.add(engine.world, cArr[v]);
  });
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });
  World.add(engine.world, mouseConstraint);
  render.mouse = mouse;
  Engine.run(engine);
  Render.run(render);
};
mirain.on("click", event => {
  rainbow = true;
  mirain.prop("disabled", true);
  count1++;
  let arr = [];
  if (count1 >= 4) {
    arr = rainbow_cats;
    count1 = 0;
  } else {
    arr = cats;
  }
  const audioNum = getRandomInt(1, 2);
  const audio = document.getElementById("audio" + audioNum);
  audio.play();
  const c = generateCats(arr);
  World.add(engine.world, c);
  if (audioNum === 1) {
    c.bodies.forEach((i, v) => {
      Body.setAngularVelocity(i, 0.02 * getRandomArbitrary(-5, 5));
      Body.setVelocity(i, {
        x: 0,
        y: 30
      });
    });
  } else {
    c.bodies.forEach((i, v) => {
      Body.setAngularVelocity(i, 0.02 * getRandomArbitrary(-5, 5));
      Body.setVelocity(i, {
        x: 0,
        y: 15
      });
    });
  }
  audio.onended = () => {
    World.remove(engine.world, c);
    mirain.prop("disabled", false);
    rainbow = false;
  };
});
$('.txt').html((i, html) => {
  const chars = $.trim(html).split("");
  return `<span>${chars.join('</span><span>')}</span>`;
});
init();
$(window).resize(() => {
  if (!rainbow) {
    init();
  }
});
