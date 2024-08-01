const gridWidth = 10
//Importação de audio
const shapeFreezeAudio = new Audio("./audios/audios_tetraminoFreeze.wav")
const completedLineAudio = new Audio("./audios/audios_completedLine.wav")
const gameOverAudio = new Audio("./audios/audios_gameOver.wav")

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
const colorShape = ["shapePaintedRed","shapePaintedPurple","shapePaintedYellow","shapePaintedblue","shapePaintedGreen" ]
let currentPosition = 3
let currentRotation = 0
let randomShape = Math.floor(Math.random() * allShapes.length)
let randomColorShape = Math.floor(Math.random() * colorShape.length)
let currentShape = allShapes[randomShape][currentRotation]
let gridSquares = Array.from(document.querySelectorAll(".grid div")) 


//Função para criar Shape
function draw() {
    currentShape.forEach(squareIndex => {
        gridSquares[squareIndex + currentPosition].classList.add(colorShape[randomColorShape])
    })
}
draw()

//Função para remover Shape
function unDraw() {
    currentShape.forEach(squareIndex => {
        gridSquares[squareIndex + currentPosition].classList.remove(colorShape[randomColorShape])
    })
}
const restartBtn = document.getElementById("restart-btn")
restartBtn.addEventListener("click", () => {
    window.location.reload()
})

//função botão Start/Pause game.
let timerId = null
const startStopBtn = document.getElementById("start-btn")
startStopBtn.addEventListener("click", () => {
    if (timerId){
        clearInterval(timerId)
        timerId = null
    }else{
        timerId = setInterval(moveDawn, 300)
    }
})

//Função para mover para baixo
function moveDawn(){
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
        randomShape = Math.floor(Math.random() * allShapes.length)
        randomColorShape = Math.floor(Math.random() * colorShape.length)
        currentShape = allShapes[randomShape][currentRotation]
        draw()
        checkRowFilled()
        updateScore(10)
        shapeFreezeAudio.play()
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
function checkRowFilled(){
    for (var row = 0; row < gridSquares.length; row += gridWidth){
        let currentRow = []

        for(var square = row; square < row + gridWidth; square++){
            currentRow.push(square)
        }
        const isRowPainted = currentRow.every(square =>
            gridSquares[square].classList.contains(colorShape[randomColorShape])
        )
        if(isRowPainted){
            const squaresRemoved = gridSquares.splice(row, gridWidth)
            squaresRemoved.forEach(square =>
                square.classList.remove("filled", colorShape[randomColorShape])
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
let score = 0
function updateScore(updateValue){
    score += updateValue
    scoreGrid.textContent = score
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
            moveDawn()
        }else if(event.key === "ArrowUp"){
            rotate()
        }
    }
    
}
