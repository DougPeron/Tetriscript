const gridWidth = 10

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
let gridSquares = document.querySelectorAll(".grid div")

//Função para criar Shape
function draw() {
    currentShape.forEach(squareIndex => {
        gridSquares[squareIndex + currentPosition].classList.add("shapePainted")
    })
}
draw()

//Função para remover Shape
function unDraw() {
    currentShape.forEach(squareIndex => {
        gridSquares[squareIndex + currentPosition].classList.remove("shapePainted")
    })
}
//Função nativa para tempo de execução
setInterval(moveDawn, 300)

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
        currentShape = allShapes[randomShape][currentRotation]
        draw()
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
function rotate(){
    unDraw()
    if (currentRotation === currentShape.length - 1){
        currentRotation = 0
    }else currentRotation++
    currentShape = allShapes[randomShape][currentRotation]

    draw()
}
document.addEventListener('keydown', controlKeyboard)

//Função para executar o movimento dos Shapes
function controlKeyboard(event){
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
