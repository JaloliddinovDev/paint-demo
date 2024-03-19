// GLOBAL VARIABLE
const canvas = document.querySelector('canvas')
const toolBtns = document.querySelectorAll('.tool')
const fillColor = document.querySelector('#fill-color')
const sizeSlider = document.querySelector('#size-slider')
const colorBtns = document.querySelectorAll('.colors .option')
const colorPicker = document.querySelector('#color-picker')
const clearCanvasBtn = document.querySelector('.clear-canvas')
const saveImgBtn = document.querySelector('.save-img')

// VARIABLE WITH DEFOULT VALUE
let ctx = canvas.getContext('2d'),
    isDrowing = false,
    brushwidth = 5,
    selectedTool = 'brush',
    selectedColor = '#000',
    prevMouseX,
    prevMouseY,
    snapshot


// START DRAWING
const startDrawing = e => {
    isDrowing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    ctx.lineWidth = brushwidth
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
    console.log(snapshot)
}

// SET CANVAS BACKGROUND
const setConvasBackground = ()=>{
    ctx.fillStyle = '#fff'
    ctx.fillRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = selectedTool
}

// SET CONVAS WIDTH AND HEIGHT
window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setConvasBackground()
})


// DROW RECTANGLE
const drowRectangle = e => {
    fillColor.checked
        ? ctx.fillRect(
            e.offsetX,
            e.offsetY,
            prevMouseX - e.offsetX,
            prevMouseY - e.offsetY
        )
        : ctx.strokeRect(
            e.offsetX,
            e.offsetY,
            prevMouseX - e.offsetX,
            prevMouseY - e.offsetY
        )
}

// DROW CIRCLE
const drwoCircle = e => {
    ctx.beginPath()
    const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetY, 2)) + Math.sqrt(Math.pow(prevMouseY - e.offsetY, 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

// DROW TRIANGLE
const drowTriangle = e => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath()
    ctx.stroke()
    fillColor.checked ? ctx.fill() : ctx.stroke()

}

// DROWING
const drawing = e => {
    if (!isDrowing) return
    ctx.putImageData(snapshot, 0, 0)

    switch (selectedTool) {
        case 'brush':
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break
        case 'rectangle':
            drowRectangle(e)
            break
        case 'circle':
            drwoCircle(e)
            break
        case 'triangle':
            drowTriangle(e)
            break
        case "eraser":
            ctx.strokeStyle = '#fff'
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break
    }
}

// CHANGE BRUSH WITH
sizeSlider.addEventListener('change', () => (brushwidth = sizeSlider.value))


// STOP DROWING
const stopDrow = () => {
    isDrowing = false
}

// SET COLOR TO SHAPES
colorBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelector('.options .selected').classList.remove('selected')
        btn.classList.add('selected')
        const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
        selectedColor = bgColor
        console.log(btn);
    })
})

// SET COLOR FROM COLOR PICKER
colorPicker.addEventListener('change', ()=>{
    colorPicker.parentElement.style.background = colorPicker.value
    colorPicker.parentElement.click()
})

// TOOLS BTN AND SET TO VARIABLE SELECTED TOOL
toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active')
        btn.classList.add('active')
        selectedTool = btn.id
    })
})


// CLEAR CANVAS BUTTON
clearCanvasBtn.addEventListener('click', ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height )
    setConvasBackground()
})

// SAVE LIKE IMAGE OUR PAINT
saveImgBtn.addEventListener('click', ()=>{
    const link = document.createElement('a')
    link.download=`Paint-demo${Dategi.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDrow)
