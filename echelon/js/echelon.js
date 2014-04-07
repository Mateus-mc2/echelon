// The MIT License (MIT)

// Copyright (c) 2014 Marlon Reghert Alves dos Santos

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var EPS = Math.pow(10,-8); // EPS constant for float numbers
var DIGITS = 5;
// init matrix
var matrix = [];

for (var i = 0; i < n; i++) { // init matrix
        matrix[i] = [];
        for(var j = 0; j < m; j++){
                matrix[i][j] = 0;
        }
};  

var steps = new Steps(); // init step storage; // store all steps

function swapRow(matrix, a, b){ // swap row 'a' with 'b'
    if(a != b) {         
            steps.saveStep(matrix, "Swap row nº"+(a+1) + " with row nº" + (b+1)); // save this step
            var aux = matrix[a];
            matrix[a] = matrix[b];
            matrix[b] = aux;

    /*        if(teste==0){
                alert('etntrou');
                steps.saveStep(matrix, 'Swaped row ('+a +') with row ('+ b+' )' );    
                alert(steps.list.length);
                a++;
            }*/
    }

}



function subRows(matrix, a, b, k){ // sub row 'b' of row 'a' by a factor K from matrix
        if(k){
            steps.saveStep(matrix, "Subtract row nº"+(b+1) + " by "+ k + " times row nº" + (a+1) ); // save this step
            len = matrix[a].length;
            for (var i = 0; i < len; i++) {
                matrix[b][i] = Math.abs( matrix[b][i] - k*matrix[a][i] ) <= EPS ? 0 : matrix[b][i] - k*matrix[a][i];
                matrix[b][i] = fixNumber(matrix[b][i], DIGITS);
            }
        }


}

function multiplyRow(matrix, a, k, ceil){ // multiply row 'a' from matrix by a factor K, if ceil... the result will be ceiled
       if(! (k==1) ) { 
           steps.saveStep(matrix,"Multiply row nº"+(a+1) + " per " + k ) ;  // save this step
           for (var i = 0; i < matrix[a].length; i++)  {
                    matrix[a][i]*=k;
                    if(ceil && i==a ) matrix[a][i] = Math.ceil( matrix[a][i] ); 
                    matrix[a][i] = fixNumber(matrix[a][i], DIGITS);
            }
        }
}

function echelonMatrix(matrix){ // get a echelon form of a matrix and return if a matrix is singular
        var singular = false; 

        for(var i = 0; i < matrix.length; i++){
                // check the bounds for a pivot
                if(i > matrix[i].length) {singular=true; break;}
                
                // find a valid pivot
                if(!matrix[i][i]){
                        for(var j = i+1; j < matrix.length; j++){
                                if(matrix[j][i]){
                                        swapRow(matrix, i, j);
                                        break;
                                }
                        }
                }
                //if found a pivot
                if(!matrix[i][i]) {singular=true; break;}
                var pivot = matrix[i][i];
                // sub all rows
                for(var j=i+1; j< matrix.length; j++){
                    factor = matrix[j][i]/pivot; 
                    subRows(matrix, i, j, factor);   
                }


        }

        swapRowsNulls(matrix);

        return singular;              
}

function alertMatrix(matrix){
        var s = "";
        for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) s += matrix[i][j] + " ";
                s+="\n";
        }
        alert(s); // use this function to alert a matrix (use to debug)
}

function findPivotReduce(matrix, a){ // find the pivot for the reduce method of a matrix on row 'a'
        var pivot = 0;
        var pos = 0;
        for(var j = 0; j  < matrix[a].length; j++) if(matrix[a][j] != 0 ) {
            pivot = matrix[a][j]; 
            pos = j;
        }
        return {
                pivot: pivot,
                pos: pos
        };

}

function swapRowsNulls(matrix){ // swap all rows that are null to bottom of matrix
            // swap all not rows that doesn't have a pivot
        for(var i =0 ; i < matrix.length; i++){
         
            if(i < matrix[i].length && !matrix[i][i]) {
                var j = i;
                var found = false;
                while(!found ) {
                    if(j > matrix[i].length || found) break;
                    for(var k = i; k < matrix.length && !found; k++){ // for each line
                        if(matrix[k][j]) {
                            
                            swapRow(matrix, i, k);
                            found = true;
                        }
                    }
                    j++;
                }

            }
        }
}

function reduceMatrix(matrix){
        /*
                We expect that the matrix is always on echelon form
        */
        
       // swapRowsNulls(matrix);


        for(var i = matrix.length-1; i >= 0; i--){ // for all rows
                var pivot = 0;
                var pivotPos = 0;
                for(var j = 0; j < matrix[i].length; j++){
                        if(matrix[i][j] != 0) {
                                pivotPos = j;
                                pivot = matrix[i][j];
                                break;
                        }
                }
                if(!pivot) continue;
                for(var j = i-1; j >=0; j--){
                        var factor = matrix[j][pivotPos]/pivot;
                        subRows(matrix, i, j, factor);
                }
                 multiplyRow(matrix, i, 1/pivot, true);
        }       
}

function getMatrix(){ //search on span whose id is "holdMatrix"
        
        var matrixInput = document.getElementById('holdMatrix');
        var rows = matrixInput.getElementsByTagName('div');
        
        // get the matrix from inputs \/
        for(var i = 0; i < n; i++){
                var cols = rows[i].getElementsByTagName('input');
                for(var j =0 ; j < m; j++) {
                        if(cols[j].value !== "" ) matrix[i][j] = parseFloat(cols[j].value);
                        //else matrix[i][j]=Math.floor(Math.random()*99999) ; // use to debug
                        else matrix[i][j] = 0;
                            
                }

        }
}


function check(matrix){ //check if has some term (i,j) that is NaN or undefined
        for (var i = 0; i < matrix.length; i++) {
                for(var j = 0; j < matrix[i].length; j++){ 
                        if(isNaN(matrix[i][j])  || matrix[i][j] == undefined ) return true;
                };
        };
    return false;   
}

function fixNumber(number, digits){
    var rounded = number.toFixed(digits);
    rounded = parseFloat(rounded);
    return (rounded%1) ? rounded : parseFloat(rounded.toFixed(0));
  
}


function fixMatrix(matrix, digits){ // round all matrix[i][j] by the number of 'digits'
    var rounded = 0;
    for(var i = 0; i < matrix.length; i++) 
        for(var j = 0; j < matrix[i].length; j++) 
            if(matrix[i][j]%1) {
                rounded = matrix[i][j].toFixed(digits);
                rounded = parseFloat(rounded);
                matrix[i][j] = (rounded%1) ? rounded : parseFloat(rounded.toFixed(0));
  
            }
}


function htmlMatrix(matrix){

    var htmlString = document.createElement('tbody');
    
    for(var i = 0; i < matrix.length; i++){
        var row = document.createElement('tr');
        for(var j = 0; j < matrix[i].length; j++){
            var cell = document.createElement('td');
            cell.innerHTML = matrix[i][j];
            row.appendChild(cell);
        }
        htmlString.appendChild(row);
    }

    return htmlString;
}



function Steps(){
    this.list = [];
    this.actual = 0;
    this.size = 0;

    this.saveStep = function(matrix, description){
        //alertMatrix(matrix);
        console.log('Description dada:' + description);
        this.list[this.list.length] = {
            matrix: matrix,
            description: description,
            matrixHtml: htmlMatrix(matrix)
        };
        this.size++;
    }

    this.getNext = function(){
        if(this.actual >= this.list.length) return 0;
        return this.list[this.actual++];
    }



    this.getAllHtml = function(){

    }

    this.generateStepHtml = function(step){
        // get the matrix
        var matrix = this.list[step];
        var matrixHtml = matrix.matrixHtml;
        var descriptionText = matrix.description;
        console.log('dstext:' + descriptionText);


        // create all elements nescessary 
        var container = document.createElement('div');
        container.setAttribute('class', 'container');
        container.setAttribute('id', 'containerStep');

        var row = document.createElement('div');
        row.setAttribute('class', 'row');

        // genarete a col with results
        var col = document.createElement('div');
        col.setAttribute('class', 'col-xs-12 col-md-9 col-md-offset-1');

        var divResponsive = document.createElement('div');
        divResponsive.setAttribute('class', 'table-responsive');

        var table = document.createElement('table');
        table.setAttribute('class', 'table table-bordered');
        table.setAttribute('id', 'matrixStepsHolder');


        //generate the step descriptuion
        var rowDescr = document.createElement('div');
        rowDescr.setAttribute('class', 'row');
        rowDescr.setAttribute('id', 'rowDescr');
        var colDescr = document.createElement('div');
        colDescr.setAttribute('class', 'col-xs-8 col-md-10 col-offset-6');
        colDescr.setAttribute('id', 'colDescription');
        var title = document.createElement('h1');
        title.setAttribute('id', 'stepNumber');
        var description = document.createElement('strong');
        description.setAttribute('id', 'descriptionStep');

        //set description
        title.innerHTML = 'Step: ' + (step+1);
        description.innerHTML = descriptionText;



        //append child's from container
        table.appendChild(matrixHtml);
        divResponsive.appendChild(table);
        
        // apend child's from description
        colDescr.appendChild(title);
        colDescr.appendChild(description);
        rowDescr.appendChild(colDescr);
        container.appendChild(rowDescr);


        // append child's from table
        col.appendChild(divResponsive);
        row.appendChild(col);
        container.appendChild(row);




        return container;
    }


}




$(document).ready(function() {



    // hide results and step pages
    $("#myContainerResults").hide(); 
    $("#mySteps").hide();



    // set all button's events
    $("#echelonButton").click(function(){          
            getMatrix(); // get the matrix via html tags

            echelonMatrix(matrix); 
            
            console.log("reduced: " + reduced);

            if(reduced) reduceMatrix(matrix); 
            

            fixMatrix(matrix,DIGITS); // round results

            steps.saveStep(matrix, "We've done this matrix :) ");

            tableMatrix = htmlMatrix(matrix);
            document.getElementById('matrixResultsHolder').appendChild(tableMatrix);

            $("#myContainer").fadeOut("fast", function(){
                $("#myContainerResults").fadeIn("fast");
            }); 
    });    

    $("#back").click(function(){
        $("#myContainerResults").fadeOut("fast", function(){
            $("#myContainer").fadeIn("fast", function(){
                restartTable('matrixResultsHolder'); // erase all old results
                steps.list = [];
            });
        });
    });


    $("#backIndex").click( function(){
        $("#myContainer").fadeOut("fast", function(){
            window.location.href = "index.html";
        });
    });



    $("#stepByStep").click(function(){

        $("#myContainerResults").fadeOut("slow", function(){
            
            $("#mySteps").fadeIn("slow", function(){

                console.log(steps.size);

                for(var i = 0; i < steps.size; i++){
                    var el = steps.generateStepHtml(i);
                    document.getElementById('mySteps').appendChild(el);
                }


            });
        });
    });



/*    $("#backMatrix").click(function(){
        $("#mySteps").fadeOut("fast", function(){
            $("#myContainerResults").fadeIn("fast");
        });
    });
    */
    
 });  