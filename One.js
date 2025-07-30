//En js los comentarios van con slach y par imprimir consol.log//
console.log ('hola DA')

var name="diego roa" //variable en js con nombre "name"//
console.log(name) //se imprime variable name
name="alexander roa"  // se cambia la bariable o se sobre escribe la primera "name"
console.log(name)  //se imprime la variable con el nuevo contenido

const one ="no se puede cambiar el contenido" // variable que no deja asignar otro  valor encima dela misma variable.
console.log(one)
let two ="tri" //otro tipo de variable que puede cambiar dependiendo de la asignacion de las funciones principales
console.log(two)

//datos no nativos: no primitivos como  funciones arrays listas

const list=[ 21,"diego",]//constante con array o listas con datos en su interior.
console.log(list)

const oobject ={
    name:'DIEGO',
    age: 23,
    list:["a","b","c"]   
}  //creacion de const oobje con name, age , y list 
console.log(oobject)


function Reservada(){  //funcion reservada en js 
    console.log('improme todo lo que hay en la funcion')  //contenido de la funcion imprime string
    console.log('hola'+ name)
}
Reservada(oobject. name)