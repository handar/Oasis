/**
 * getRandomInt.js      - A program to generate a random number between min and max
 * @author                Ratna Lama
 * @author        
 * @author  
 * @date                  4/11/2019
 * 
 * @description           Generates an int random number between min and max range
 * 
 * @param {*} min minimum number 
 * @param {*} max maximum number
 */

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Export
module.exports = getRandomInt;