/* Show function hoisting */

console.log(square(4)); // call the function before defining it. Will show 16 in the console


// Define the function
function square(num) {
    return num * num
}


/* Show calling a function before assignment */

/* This will result in a TypeError: add is not a function.
The function variable must be declared before calling it. There is no function
hoisting in this case */

console.log(add(4, 4));

var add = function(x, y) {
    return x + y
};
