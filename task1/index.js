const temp = document.getElementById('temp');
const degrees = document.getElementById('degrees');

const convert = () => {
    let result = 0;
    if (temp.value === 'Fahrenheit'){
        result = (9/5)*parseFloat(degrees.value) + 32;
    }else if (temp.value === 'Kelvin'){
        result = 273.15 + parseFloat(degrees.value);
    }
    else result = degrees.value;

    document.getElementById("output").innerText = "Converted temperature: " + result.toFixed(2);
}