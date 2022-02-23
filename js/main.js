const METRIC = 10
// TODO - move the roation point for more accuate off angles?
const OFFSET_MATRIX = [
  // Square
  [
    { x: 0, y: METRIC, r: 0 },  // Opposite
    { x: METRIC, y: METRIC, r: 270 }, // Right
    { x: 0, y: 0, r: 90 },    // Left
  ],
  // Right Corner
  [
    { x: 0, y: 3, r: 45 }, // Face-on
    { x: METRIC, y: METRIC, r: 270 }, // Flat
  ],
  // Face-On Corner
  [
    { x: 2, y: 2, r: '-45,10,0' }, // Left
    { x: -2, y: 2, r: 45 }, // Right
  ],
  // Left Corner
  [
    { x: 3, y: METRIC, r: 315 }, // Face-on
    { x: 0, y: 0, r: 90 }, // Flat
  ],
]

document.addEventListener('DOMContentLoaded', () => {
  const schematic = document.getElementById('schematic')
  schematic.addEventListener('input', (evt) => {
    try {
      const newData = JSON.parse(evt.target.value)
      drawSchematic(newData)
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
  const baseOffsets = [
    { x: METRIC, y: 0, r: 180 },
    { x: METRIC, y: METRIC, r: 270 },
    { x: 0, y: METRIC, r: 0 },
    { x: 0, y: 0, r: 90 }
  ]
  if (!Array.isArray(schematic)) {
    console.error("schematic must be array")
    return
  }
  const diagram = document.getElementById('diagram')
  while (diagram.firstChild) {
    diagram.firstChild.remove()
  }
  const g = createSvg('g')
  g.setAttribute('transform', 'translate(70,50)')
  const base = createComponent([0], { x: 0, y: 0, r: 0 })
  g.appendChild(base)
  for (let i = 0; i < 4; i++) {
    if (Array.isArray(schematic[i])) {
      g.appendChild(createComponent(schematic[i], baseOffsets[i]))
    }
  }
  diagram.appendChild(g)
}

function createComponent(component, offset) {
  const components = ['square', 'right corner', 'face-on corner', 'left corner']
  if ((!Array.isArray(component) && component.length > 1)) {
    return
  }
  console.log('drawing ' + components[component[0]] + ' with offset ' + JSON.stringify(offset))
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
  g.appendChild(foo)
  g.appendChild(createMarker())
  g.setAttribute('transform', `translate(${offset.x},${offset.y}) rotate(${offset.r})`)
  for (let i = 0; i < 4; i++) {
    if (component[i + 1]) {
      let offset = OFFSET_MATRIX[component[0]][i]
      if (offset) {
        g.appendChild(createComponent(component[i + 1], offset))
      }
    }
  }
  return g
}

function createMarker() {
  const marker = createSvg('circle')
  marker.setAttribute('r', 1)
  return marker
}

function createSquare() {
  const foo = createSvg('rect')
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

