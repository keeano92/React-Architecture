import axios from 'axios'

const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = token
    } else {
        delete axios.defaults.headers.common["Authorization"]
    }
}

export const convertToBoolean = string => {
    let value

    if (string == "true") {
        value = true
        return value
    } else {
        value = false
        return value
    }
}

export const addZeros = num => {
    // Convert input string to a number and store as a variable.
    var value = Number(num);
    // Split the input string into two arrays containing integers/decimals
    var res = num.split(".");
    // If there is no decimal point or only one decimal place found.
    if (res.length == 1 || res[1].length < 3) {
        // Set the number to two decimal places
        value = value.toFixed(2);
    }
    // Return updated or original number.
    return value;
}

export function removeDuplicates(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in seen)) {
            ret_arr.push(arr[i]);
            seen[arr[i]] = true;
        }
    }
    return ret_arr;

}

export default setAuthToken