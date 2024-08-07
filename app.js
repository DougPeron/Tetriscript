const gridWidth = 10
//Importação de audio
const shapeFreezeAudio = new Audio("./audios/audios_tetraminoFreeze.wav")
const completedLineAudio = new Audio("./audios/audios_completedLine.wav")
const gameOverAudio = new Audio("./audios/audios_gameOver.wav")

const colors = ["shapePaintedBlue", "shapePaintedYellow", "shapePaintedRed", "shapePaintedOrange", "shapePaintedPink","shapePaintedGreen"]
let currentColor = Math.floor(Math.random() * colors.length)
let nextColor = colors[currentColor]
//Shapes
const lShape = [
    [1,2,gridWidth + 1,gridWidth * 2 +1],
    [gridWidth,gridWidth + 1,gridWidth + 2,gridWidth * 2 + 2],
    [1, gridWidth + 1, gridWidth * 2, gridWidth * 2 + 1],
    [gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2]
]
const zShape = [
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
]
const tShape = [
    [1, gridWidth, gridWidth + 1, gridWidth + 2],
    [1, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
    [1, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
]
const oShape = [
    [0, 1, gridWidth, gridWidth +1 ],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1]
]
const iShape = [
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
]
const allShapes = [lShape, zShape, tShape, oShape, iShape]
let currentPosition = 3
let currentRotation = 0
let randomShape = Math.floor(Math.random() * allShapes.length)
let currentShape = allShapes[randomShape][currentRotation]
let gridSquares = Array.from(document.querySelectorAll(".grid div")) 


//Função para criar Shape
function draw() {
    currentShape.forEach(squareIndex => {
        gridSquares[squareIndex + currentPosition].classList.add("shapePainted", `${colors[currentColor]}`)
    })
}
draw()

//Função para remover Shape
function unDraw() {
    currentShape.forEach(squareIndex => {
        gridSquares[squareIndex + currentPosition].classList.remove("shapePainted", `${colors[currentColor]}`)
    })
}
const restartBtn = document.getElementById("restart-btn")
restartBtn.addEventListener("click", () => {
    window.location.reload()
})
const miniGridSquares = document.querySelectorAll(".mini-grid div")
let miniGridWidth = 6
let nextPosition = 2
const possibleNextShapes = [
    [1, 2, miniGridWidth + 1, miniGridWidth*2 + 1],
    [miniGridWidth + 1, miniGridWidth + 2, miniGridWidth*2, miniGridWidth*2 + 1],
    [1, miniGridWidth, miniGridWidth + 1, miniGridWidth + 2],
    [0, 1, miniGridWidth, miniGridWidth + 1],
    [1, miniGridWidth + 1, miniGridWidth*2 + 1, miniGridWidth*3 + 1]
  ]

  let nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
  function displayNextShape() {
    miniGridSquares.forEach(square => square.classList.remove("shapePainted", `${colors[nextColor]}`))
    nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
    nextColor = Math.floor(Math.random() * colors.length)
    const nextShape = possibleNextShapes[nextRandomShape]
    nextShape.forEach(squareIndex => 
      miniGridSquares[squareIndex + nextPosition + miniGridWidth].classList.add("shapePainted", `${colors[nextColor]}`)  
    )
  }
displayNextShape()
//função botão Start/Pause game.
let timerId = null
let timeMoveDown = 600
const startStopBtn = document.getElementById("start-btn")
startStopBtn.addEventListener("click", () => {
    if (timerId){
        clearInterval(timerId)
        timerId = null
    }else{
        timerId = setInterval(moveDown, timeMoveDown)
    }
})

//Função para mover para baixo
function moveDown(){
    freeze()
    unDraw()
    currentPosition += + 10
    draw()
}
//Função para parar o Shape ao chegar no limite do grid ou Shape
function freeze(){
    if (currentShape.some(squareIndex =>
        gridSquares[squareIndex + currentPosition + gridWidth].classList.contains("filled")
    )){
        currentShape.forEach(squareIndex => gridSquares[squareIndex + currentPosition].classList.add("filled"))

        currentPosition = 3
        currentRotation = 0
        randomShape = nextRandomShape
        currentShape = allShapes[randomShape][currentRotation]
        currentColor = nextColor
        draw()
        checkRowFilled()
        updateScore(10)
        shapeFreezeAudio.play()
        displayNextShape()
        gameOver()
    }
}
//Função para mover Shape para Esquerda
function moveLeft(){
    //Verifica se está na extremidade do grid
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
    if (isEdgeLimit) return
    //Verifica se está na extremidade do Shape
    const isFilled = currentShape.some(squareIndex => 
        gridSquares[squareIndex + currentPosition - 1].classList.contains("filled")
    )
    if (isFilled) return
    unDraw()
    currentPosition --
    draw()
}
//Função para mover Shape para Direita
function moveRight(){
    //Verifica se está na extremidade do grid
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 9)
    if (isEdgeLimit) return
    //Verifica se está na extremidade do Shape
    const isFilled = currentShape.some(squareIndex => 
        gridSquares[squareIndex + currentPosition + 1].classList.contains("filled")
    )
    if (isFilled) return
    unDraw()
    currentPosition ++
    draw()
}


//Função para rotacionar Shape
function previusRotation(){
    if (currentRotation === currentShape.length - 1){
        currentRotation = 0
    }else currentRotation++
    currentShape = allShapes[randomShape][currentRotation]
}
function rotate(){
    unDraw()
    previusRotation()
    const isLeftLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
    const isRightLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 9)
    if(isLeftLimit && isRightLimit){
        if (currentRotation === 0){
            currentRotation = currentShape.length - 1
        }else {
            currentRotation --
        }
        currentShape = allShapes[randomShape][currentRotation]
    }
    const isFilled = currentShape.some(squareIndex =>
        gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )
    if(isFilled){
        previusRotation()
    }
    draw()
}
//Função para eliminar linha completa
let grid = document.querySelector(".grid")
function checkRowFilled() {
    for (var row = 0; row < gridSquares.length; row += gridWidth) {
      let currentRow = []
  
      for (var square = row; square < row + gridWidth; square++) {
        currentRow.push(square)
      }
  
      const isRowPainted = currentRow.every(square => 
        gridSquares[square].classList.contains("shapePainted")  
      )
  
      if (isRowPainted) {
        const squaresRemoved = gridSquares.splice(row, gridWidth)
        squaresRemoved.forEach(square => 
          // square.classList.remove("shapePainted", "filled")
          square.removeAttribute("class")
        )
        gridSquares = squaresRemoved.concat(gridSquares)
        gridSquares.forEach(square => grid.appendChild(square))
  
        updateScore(100)
        completedLineAudio.play()
      }
    }
  }
//Função para criar pontuação
const scoreGrid = document.querySelector(".score")
const lvlGrid = document.querySelector(".lvl")
let lvl = 1
let score = 0
function updateScore(updateValue){ 
    score += updateValue
    scoreGrid.textContent = score
    clearInterval(timerId)
  if (score <= 450) {
    timeMoveDown = 500
  }
  else if (450 < score && score <= 1000) {
    lvl = 2
    timeMoveDown = 400
  } else if (1000 < score && score <= 1500) {
    lvl = 3
    timeMoveDown = 300
  } else if (1500 < score && score <= 2500) {
    lvl = 4
    timeMoveDown = 200
  } else if (2500 < score && score <= 4000) {
    lvl = 5
    timeMoveDown = 150
  } else {
    lvl = "MAX"
    timeMoveDown = 110
  }
  lvlGrid.textContent = lvl
  timerId = setInterval(moveDown, timeMoveDown)
}

function gameOver(){
    if(currentShape.some(squareIndex => 
        gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )){
        updateScore(-10)
        clearInterval(timerId)
        timerId = null
        startStopBtn.disabled = true
        gameOverAudio.play()
        scoreGrid.innerHTML+= "<br/>" + "GAME OVER"
        
    }
}
document.addEventListener('keydown', controlKeyboard)

//Função para executar o movimento dos Shapes
function controlKeyboard(event){
    if(timerId){
        if (event.key === "ArrowLeft"){
            moveLeft()
        } else if(event.key === "ArrowRight"){
            moveRight()
        } else if(event.key === "ArrowDown"){
            moveDown()
        }else if(event.key === "ArrowUp"){
            rotate()
        }
    }
    
}
