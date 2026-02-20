document.addEventListener("DOMContentLoaded", () => {
    cargarProductos()
})

async function cargarProductos() {
    try {
        const respuesta = await fetch("http://localhost:3000/api/productos")
        const productos = await respuesta.json()

        const contenedor = document.getElementById("productos-container")
        contenedor.innerHTML = ""

        productos.forEach(producto => {
            const div = document.createElement("div")
            div.classList.add("producto")

            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h2>${producto.nombre}</h2>
                <p>${producto.categoria}</p>
                <p>Talla: ${producto.talla}</p>
                <p><strong>$${producto.precio.toLocaleString()}</strong></p>
                <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>
                Agregar al carrito
                </button>
                            `


            contenedor.appendChild(div)
        })

    } catch (error) {
        console.error("Error cargando productos:", error)
    }
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || []

function agregarAlCarrito(producto) {
    carrito.push(producto)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarContador()
    renderCarrito()
}

function actualizarContador() {
    document.getElementById("contador-carrito").innerText = carrito.length
}

function renderCarrito() {
    const lista = document.getElementById("lista-carrito")
    const totalElemento = document.getElementById("total-carrito")

    if (!lista) return

    lista.innerHTML = ""
    let total = 0

    carrito.forEach((prod, index) => {
        total += prod.precio

        const div = document.createElement("div")
        div.innerHTML = `
            <p>${prod.nombre} - $${prod.precio.toLocaleString()}</p>
            <button onclick="eliminarProductoCarrito(${index})">❌</button>
        `
        lista.appendChild(div)
    })

    totalElemento.innerText = "$" + total.toLocaleString()
}

function eliminarProductoCarrito(index) {
    carrito.splice(index, 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarContador()
    renderCarrito()
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarContador()
    renderCarrito()
})

function toggleCarrito() {
    document.getElementById("panel-carrito").classList.toggle("activo")
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío")
        return
    }

    let mensaje = "Hola, quiero comprar los siguientes productos:%0A%0A"
    let total = 0

    carrito.forEach(prod => {
        mensaje += `- ${prod.nombre} ($${prod.precio.toLocaleString()})%0A`
        total += prod.precio
    })

    mensaje += `%0A*Total:* $${total.toLocaleString()}%0A`
    mensaje += "%0AEntrega en Barranquilla - Pago contra entrega."

    const numero = "573014913791" // CAMBIA POR TU NÚMERO
    const url = `https://wa.me/${numero}?text=${mensaje}`

    window.open(url, "_blank")
}
