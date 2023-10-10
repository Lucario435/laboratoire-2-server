import MathModel from '../models/math.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new MathModel()));
    }
    async demonstrateExamples() {
        //Makes a html page to show the possibilities of calculate function with a bit of css :)
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Maths API Endpoint</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                }
                .endpoint {
                    margin: 20px;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                .query {
                    margin: 10px;
                    padding: 10px;
                    border: 1px solid #e0e0e0;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                pre {
                    margin: 0;
                    white-space: pre-wrap;
                }
            </style>
        </head>
        <body>
            <h1>GET : Maths Endpoint</h1>
            <div class="endpoint">
                <h2>List of possible query strings:</h2>
                <div class="query">
                    <pre>? op = + & x = number & y = number</pre>
                    <pre>"return {""op"":""+"",""x"":number, ""y"":number, ""value"": x + y}"</pre>
                </div>
                <div class="query">
                    <pre>? op = • & x = number & y = number</pre>
                    <pre>"return {""op"":"" "",""x"":number,""y"":number,""value"": x • y}"</pre>
                </div>
                <div class="query">
                    <pre>? op = * & x = number & y = number</pre>
                    <pre>"return {""op"" :""*"",""x"":number,""y"":number,""value"": x * y}"</pre>
                </div>
                <div class="query">
                    <pre>? op = I & x = number & y = number</pre>
                    <pre>"return {""op"":""/"",""x"":number,""y"":number, ""value"": x I y}"</pre>
                </div>
                <div class="query">
                    <pre>? op = % & x = number & y = number</pre>
                    <pre>"return {""op"":""%"",""x"":number, ""y"":number, ""value"": x % y}"</pre>
                </div>
                <div class="query">
                    <pre>? op = !& n = integer</pre>
                    <pre>"return {""op"":""%"",""n"":integer,""value"": n!}"</pre>
                </div>
                <div class="query">
                    <pre>? op = p & n = integer</pre>
                    <pre>"return {""op"":""p"",""n"":integer,""value"": true if n is a prime number}"</pre>
                </div>
                <div class="query">
                    <pre>? op = np & n = integer</pre>
                    <pre>"return {""op"":""n"",""n"":integer,""value"": nth prime number}"</pre>
                </div>
            </div>
        </body>
        </html>
      `;
        return this.HttpContext.response.HTML(htmlContent);

    }
    async calculate(req, res, params) {
        //Detects if there are 2 params only
        if (params["op"] != "np" && params["op"] != "p" && params["op"] != "!" && Object.keys(params).length == 2) {
            params["value"] = false;
            return this.HttpContext.response.JSON(params);
        }
        
        const {op, x, y, n, X, Y} = params;

        //In order to make the numbers manipulable, we need to make the string a number
        let numX;
        let numY;
        let numN;
        if(x || X)
        {  
            if(X != null)
            {
                numX = parseFloat(X);
            }
            if(x != null)
            {
                numX = parseFloat(x);
            }

            if (isNaN(numX)) {
                params["error"] = "x parameter is not a number";
                return this.HttpContext.response.JSON(params);
            }
        }
        if(y || Y)
        {
            if(Y != null)
            {
                numY = parseFloat(Y);
            }
            if(x != null)
            {
                numY = parseFloat(y);
            }

            if (!y || isNaN(numY)) {
                params["error"] = "y parameter is not a number";
                return this.HttpContext.response.JSON(params);
            }
        }
        if(n)
        {
            numN = parseFloat(n);

            if (!n || isNaN(numN)) {
                params["error"] = "n parameter is not a number";
                return this.HttpContext.response.JSON(params);
            }
        }

        //Switch case for all scenarios of parameters =>(+, -, *, /, %, !, and more)
        let result;
        switch (Object.values(params)[0]) {
            case '+':
            case " ":
            case undefined:
                if(Object.keys(params).length != 3)
                {
                    params["error"] = "The number of parameters for that operation must be 3.";
                    break;
                }
                params["op"] = "+";
                result = numX + numY;
                break;
            case '-':
                if(Object.keys(params).length != 3)
                {
                    params["error"] = "The number of parameters for that operation must be 3.";
                    break;
                }
                result = numX - numY;
                break;
            case '*':
                if(Object.keys(params).length != 3)
                {
                    params["error"] = "The number of parameters for that operation must be 3.";
                    break;
                }
                result = numX * numY;
                break;
            case '/':
                if(Object.keys(params).length != 3)
                {
                    params["error"] = "The number of parameters for that operation must be 3.";
                    break;
                }
                if(numX == 0 && numY == 0)
                {
                    result = "NaN";
                    break;
                }
                if(numX == 0 || numY == 0)
                {
                    result = "Infinity";
                    break;
                }
                else
                {                    
                    result = numX / numY;
                    break;
                }
            case '%':
                if(Object.keys(params).length != 3)
                {
                    params["error"] = "The number of parameters for that operation must be 3.";
                    break;
                }
                if(numY == 0)
                {
                    result = "NaN";
                    break;
                }
                result = numX % numY;
                break;
            case '!':
                if(Object.keys(params).length != 2)
                {
                    params["error"] = "The number of parameters for that operation must be 2.";
                    break;
                }
                else 
                {
                    //does it have a bigger value than 0
                    if(numX <= 0)
                    {
                        params["error"] = "Value must be greater than 0.";
                        break;
                    }
                    //if its value is one it is one
                    if (numX == 1) 
                    {

                        result = 1;
                        break;
                    }
                    //Is it float 
                    if (!Number.isInteger(numX)) 
                    {
                        params["error"] = "This operator can't accept floats";
                        break;
                    }
                    else 
                    {
                        result = 1;
                        for (let i = 2; i <= numX; i++) {
                            result *= i;
                        }
                        break;
                    }
                }
            case 'p':
                let value;
                if(numX != null)
                {
                    value = numX;
                }
                if(numN != null)
                {
                    value = numN;
                }
                //does it have a bigger value than 0
                if(Object.keys(params).length != 2)
                {
                    params["error"] = "The number of parameters for that operation must be 2.";
                    break;
                }
                if(value <= 0)
                {
                    params["error"] = "Value must be greater than 0.";
                    break;
                }
                //Is it float 
                if(!Number.isInteger(value)) 
                {
                    params["error"] = "This operator can't accept floats.";
                    break;
                }
                if(value == 1)
                {
                    result = false;
                    break;
                }
                let isPrime = true;

                for (let i = 2; i < value; i++) {
                  if (value % i == 0) {
                    isPrime = false;
                    break;         
                  }
                }
                
                result = isPrime;
                break;
            case "np" :
                let value2;

                if(numX != null)
                {
                    value2 = numX;
                }
                if(numN != null)
                {
                    value2 = numN;
                }
                function test(value)
                {
                    if(value == 1)
                    {
                        return false;
                    }
                    let isPrime = true;
    
                    for (let i = 2; i < value; i++) {
                      if (value % i == 0) {
                        return false;     
                      }
                    }
                    
                    return isPrime;
                }
                if(Object.keys(params).length != 2)
                {
                    params["error"] = "The number of parameters for that operation must be 2.";
                    break;
                }
                let primeNumer = 0;
                for (let i = 0; i < value2; i++) {
                    primeNumer++;
                    while (!test(primeNumer)) {
                        primeNumer++;
                    }
                }
                result = primeNumer;
            break;
            default:
                return this.HttpContext.response.status(400,"Opération non valide.");
        }


        //return result
        params["value"] = result
        return this.HttpContext.response.JSON(params);
    }
}