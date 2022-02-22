const METRIC=10
const OFFSET_MATRIX = [
  // Square
  [
    {x:10,y:0,r:180},  // Top
    {x:10,y:10,r:270}, // Right
    {x:0,y:10,r:0},    // Bottom
    {x:0,y:0,r:90},    // Left
  ],
  // Right Corner
  [
    {x:0,y:3,r:45},
    {x:10,y:10,r:270},
    {x:10,y:0,r:180},
    null,
  ],
  // Face-On Corner
  [
    {x:0,y:0,r:180},
    {x:10,y:10,r:0},
    {x:0,y:10,r:0},
    {x:-10,y:10,r:0},
  ],
  // Left Corner
  [
    {x:0,y:7,r:225},
    {x:10,y:0,r:225},
    {x:0,y:10,r:0},
    {x:-10,y:0,r:0},
  ],
]

document.addEventListener('DOMContentLoaded', () => {
  const schematic = document.getElementById('schematic')
  schematic.addEventListener('input', (evt) => {
    try {
      const newData = evt.target.value
      drawSchematic(JSON.parse(newData))
    } catch (e) {
      console.warn(e)
    }
  })
  drawSchematic(JSON.parse(schematic.value))
})

function createSvg(elm) {
  return document.createElementNS('http://www.w3.org/2000/svg', elm)
}

function drawSchematic(schematic) {
  if (!(Array.isArray(schematic) && schematic.length == 5)) {
    console.error("schematic must be array of length 5")
    return
  }
  const diagram = document.getElementById('diagram')
  while (diagram.firstChild) {
    diagram.firstChild.remove()
  }
  diagram.appendChild(createComponent(schematic, {x:70,y:50,r:0}))
}

function createComponent(component, offset) {
  console.log('drawing component: ' + component + ' with offset ' + JSON.stringify(offset))
  if (!Array.isArray(component)) {
    return
  }
  const g = createSvg('g')
  switch (component[0]) {
    case 0: 
      foo = createSquare()
      break
    case 1:
      foo = createRightCorner()
      break
    case 2:
      foo = createFaceOnCorner()
      break
    case 3:
      foo = createLeftCorner()
      break
    default:
    console.error('unknown object type ' + schematic[0])
  }
  console.log('appending ' + foo + ' to ' + g)
  g.appendChild(foo)
  g.setAttribute('transform', `translate(${offset.x},${offset.y}) rotate(${offset.r})`)
  for (let i=0; i < 4; i++) {
    if (component[i+1]) {
      let offset = OFFSET_MATRIX[component[0]][i]
      if (offset) {
        g.appendChild(createComponent(component[i+1], offset))
      }
    }
  }
  return g
}

function createSquare() {
  const foo = createSvg('rect')
  foo.setAttribute('x', 0)
  foo.setAttribute('y', 0)
  foo.setAttribute('width', METRIC)
  foo.setAttribute('height', METRIC)
  return foo
}

function createRightCorner() {
  const foo = createSvg('polygon')
  foo.setAttribute('points', '0,0 0,3 7,10 10,10 10,0')
  return foo
}

function createLeftCorner() {
  const foo = createSvg('polygon')
  foo.setAttribute('points', '0,0 0,10 3,10 10,3 10,0')
  return foo
}

function createFaceOnCorner() {
  const foo = createSvg('polygon')
  foo.setAttribute('points', '0,0 -2,2 5,9 12,2 10,0')
  return foo
}

