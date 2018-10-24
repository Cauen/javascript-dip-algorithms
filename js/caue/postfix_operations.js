// Original Source: https://jsfiddle.net/DerekL/SKG9Y/

var arrOfFunctions = ['pi e ^ ceil ln a / a + floor e - floor a ^ ln a + ceil round tan a ^ pi * ceil pi / sin pi ^ sin e + e ^ a * b /', 'a round sin sin a + e / a - round a ^ a - tan ceil sin b + ', 'b ln a + ', 'a b * sqrt', 'e b + round round e + sin sin round e / sqrt pi / sin sin a + ', 'a sin b * ', 'pi e ^ ceil ln a / a + floor e - floor a ^ ln a + ceil round tan a ^ pi * ceil pi / sin pi ^ sin e + e ^ a * b /', 'b floor e + ceil a - ', 'a b * sqrt', 'b tan ln tan sqrt e ^ sin tan tan b + a /'];
var generated = 0;
var lastFormula;

function callPostFixFormula() {
    var image1Data = imagesData[primaryImage];
    var image2Data = imagesData[secundaryImage];
    if (!image1Data || !image2Data) { uploadFirstNotification(); return false; }

    swal({
        title: 'Type a postfix formula',
        text: 'Use a and b to refer to images',
        html:
        '<input value="'+(lastFormula ? lastFormula : arrOfFunctions[Math.floor(Math.random() * arrOfFunctions.length)] )+'" id="postfixFormula" class="swal2-input"><span id="tipswal">Use "a" for primary image pixel, and "b" for secundary image pixel value. For example: a = 45 and b = 180</span><br><span id="mode"></span><br><span id="opt"></span><br><br><div class="tipPostF"><p>Operations:</p><span>2 Elements: + - * / ^</span><br><span>1 Element: sin cos tan floor ceil round ln sqrt</span><br><span>Constants: e pi a b</span></div>',
        footer: '<a onClick="generateFunction()">Generate random</a>',
        focusConfirm: false,
        preConfirm: () => {
            return [
                operationsAritAndLogic('postFixFormula',document.getElementById('postfixFormula').value),
                console.log(document.getElementById('postfixFormula').value),
                arrOfFunctions.push(document.getElementById('postfixFormula').value),
                lastFormula = document.getElementById('postfixFormula').value
            ]
        },
        onOpen: () => {
            $('.swal2-popup').on('keydown', function(e) {
                if (e.keyCode == 13) {
                    $(".swal2-confirm").trigger('click');
                }
            });
        },
    });

    $('#postfixFormula').trigger('input');
}


var isSingle = false;
var single = 0;
$("body").on("input", '#postfixFormula', function(){
    console.log('Typing formula: ' + this.value);
    isSingle = !$("input").val().match(/\s/);
    
    try{
        $("#opt").text(" = " + evalStr(this.value, !single, 45, 180));
        $('.swal2-confirm').prop("disabled",false);
        $("#mode").text('Valid formula');
        if((this.value).indexOf( "a" ) == -1 && (this.value).indexOf( "b" ) == -1) {
            console.log((this.value).indexOf( "a" ) );
            $('.swal2-confirm').prop("disabled",true);
            $("#mode").text('Correct formula, but needing to put A or B');
        }
    }catch(err){
        $("#opt").text(err);
        $('.swal2-confirm').prop("disabled",true);
        $("#mode").text('Not valid formula');
    }
}).keydown(function(e){
    if(e.keyCode == 13) this.value += " ";
});


var operators = {
    "+": [function(a, b){ return b+a }, 2],
    "-": [function(a, b){ return b-a }, 2],
    "*": [function(a, b){ return b*a }, 2],
    "/": [function(a, b){ return b/a }, 2],
    "^": [function(a, b){ return Math.pow(b,a) }, 2],
    "sin": [function(a){ return Math.sin(a) }, 1],
    "cos": [function(a){ return Math.cos(a) }, 1],
    "tan": [function(a){ return Math.tan(a) }, 1],
    "floor": [function(a){ return a|0 }, 1],
    "ceil": [function(a){ return Math.ceil(a) }, 1],
    "round": [function(a){ return Math.round(a) }, 1],
    "ln": [function(a){ return Math.log(a) }, 1],
    "sqrt": [function(a){ return Math.sqrt(a) }, 1],
    "e": [function(){ return Math.E }, 0],
    "pi": [function(){ return Math.PI }, 0]
}

function evalStr(str, mul, a, b){

    var stack = [];
    str = str.trim();
    if(str.length == 0) return 0;
    if(mul) str = str.toLowerCase().split(" ");
    for(var i = 0; i < str.length; i++){
        if(str[i] in operators){
            var numArg = operators[str[i]][1];
            if(stack.length < numArg) throw "Missing operant";
            stack.push(operators[str[i]][0].apply(null, (function(){
                var arr = [];
                for(var j = 0; j < numArg; j++){
                    arr.push(stack.pop());
                }
                return arr;
            })()));
        }else{
            if(str[i] == 'a') {
              stack.push(+a);
            } else {
                if (str[i] == 'b') {
                stack.push(+b);
              } else {
                //if(!/^[0-9.]+$/.test(str[i])) {
                //    throw "Unknown operator \""+str[i]+"\"";
                //}
                if (!($.isNumeric(str[i]))) {
                    throw "Unknown operator \""+str[i]+"\"";
                }
                stack.push(+str[i]);
              }
            }
        }
    }
    if(stack.length != 1) throw "Uncaught extra operant";
    return stack[0];
}

var twoElements = ['+', '-', '*', '/', '^'];
var oneElements = ['sin', 'cos', 'tan', 'floor', 'ceil', 'round', 'ln', 'sqrt'];
var constants = ['a','b','e','pi'];

function generateFunction() {
    var rand = arrOfFunctions[Math.floor(Math.random() * arrOfFunctions.length)];
    $('#postfixFormula').val(rand);
    $('#postfixFormula').trigger('input');
    


    if (generated == 0) {
        
        generated++;
        while (arrOfFunctions.length < 100) 
        {
            var leftOverVariables = 0;
            var formula = "";
            var usedA = false; var usedB = false;
            while (!usedA || !usedB) {
                var willDo = Math.floor((Math.random() * 2) + 1);
                // WILLDO = 1 >>> 2 constants + operation 2
                // WILLDO = 2 >>> Constant + operation 1

                if (willDo == 1) { //Two Elements Use
                    if(leftOverVariables == 0) {
                        var numberOrConstant = Math.floor((Math.random() * 2) + 1);
                        if(numberOrConstant == 1) { //Will use number
                            var firstNumber = Math.floor((Math.random() * 20) + 1);
                            var alreadyGetNumber = true;
                        } else { // get Constant
                            var pos = Math.floor((Math.random() * 4) + 0);
                            var firstNumber = constants[pos];
                            if (pos == 0) usedA = true;
                            if (pos == 1) usedB = true;
                        }

                        numberOrConstant = Math.floor((Math.random() * 2) + 1);
                        if(numberOrConstant == 1 && !alreadyGetNumber) { //Will use number
                            var secondNumber = Math.floor((Math.random() * 20) + 1);
                        } else { // get Constant
                            var pos = Math.floor((Math.random() * 4) + 0);
                            var secondNumber = constants[pos];
                            if (pos == 0) usedA = true;
                            if (pos == 1) usedB = true;
                        }

                        var operationIndex = Math.floor((Math.random() * 5) + 0);
                        var operation = twoElements[operationIndex];
                        leftOverVariables++;

                        formula += firstNumber + " " + secondNumber + " " + operation + " ";
                    } else {
                        numberOrConstant = Math.floor((Math.random() * 2) + 1);
                        if(numberOrConstant == 1 && !alreadyGetNumber) { //Will use number
                            var secondNumber = Math.floor((Math.random() * 20) + 1);
                        } else { // get Constant
                            var pos = Math.floor((Math.random() * 4) + 0);
                            var secondNumber = constants[pos];
                            if (pos == 0) usedA = true;
                            if (pos == 1) usedB = true;
                        }

                        var operationIndex = Math.floor((Math.random() * 5) + 0);
                        var operation = twoElements[operationIndex];
                        leftOverVariables = 1;

                        formula += secondNumber + " " + operation + " ";
                    }
                    
                } else { // 1 element operation
                    if (leftOverVariables == 0) {
                        numberOrConstant = Math.floor((Math.random() * 2) + 1);
                        if(numberOrConstant == 1 && !alreadyGetNumber) { //Will use number
                            var secondNumber = Math.floor((Math.random() * 20) + 1);
                        } else { // get Constant
                            var pos = Math.floor((Math.random() * 4) + 0);
                            var secondNumber = constants[pos];
                            if (pos == 0) usedA = true;
                            if (pos == 1) usedB = true;
                        }

                        var operationIndex = Math.floor((Math.random() * 8) + 0);
                        var operation = oneElements[operationIndex];
                        leftOverVariables = 1;

                        formula += secondNumber + " " + operation + " ";
                    } else {
                        var operationIndex = Math.floor((Math.random() * 8) + 0);
                        var operation = oneElements[operationIndex];
                        leftOverVariables = 1;

                        formula += operation + " ";
                    }
                    
                }
            }

            var evalValue = evalStr(formula, 1, 45, 180);
            if(evalValue > 1 && evalValue < 255) {
                arrOfFunctions.push(formula);
            } else {
                console.log('Bad formula');
            }
        }
        console.log(arrOfFunctions);
    }
}
