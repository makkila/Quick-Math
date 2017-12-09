$(document).ready(function(){
	var operationsBox = $("#checkedBoxes");
	var operations = [];
	var equations = [];
	var mistakes = [];
	var mistakeEquations =  [];
	var mistakeAnswers = [];
	var userAnswers = [];
	var answers = [];
	
	//Player clicks start button
	$("#startButton").click(function(){
		function visibleToggle(visibleObject) {
			el = document.querySelector(visibleObject);
			el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
		}
		//Get values of checked boxes
		operationsBox.find("input[name='checkbox']:checked").each(function(){
			operations.push(this.value);
		})
		
		//Start game and get time frame and signs if at least one box is checked, and issue error message otherwise
		if (operations.length !== 0) {
			timeMenu = document.getElementById("time");
			var time = timeMenu.options[timeMenu.selectedIndex].value;
			var sign = $("input[name='sign']:checked", "#signForm").val();
			document.querySelector(".cleared").remove();	
			
			var i = 3;
			function countdown(){
				setTimeout(function(){
					if (i === 0){
						document.querySelector(".message").innerHTML = "GO!";
					} else if (i === -1) {
						document.querySelector(".message").remove();	
					} else {
						document.querySelector(".message").innerHTML = i;
					}
					i--;
					if (i > -2){
						countdown();
					}
				}, 1000)
			}
			
			countdown();
			
			setTimeout(function(){
				$(".answer").css("display", "block");
			}, 5500);
		} else {
			overlay();
			return;
		}
		
		//Inner workings of actual game

		//Function for "game over" screen
		var end = function(){
			$(".answer").css("display", "none");
			document.querySelector(".operationDisplay").innerHTML = "Game Over!";
			$("a.retry").css("display", "inline");
			
			if (userAnswers.length === 0) {
				document.querySelector(".final-score").innerHTML = "You didn't answer any questions!";
				
			} else {

				for (i=0;i<userAnswers.length;i++) {
					answer = userAnswers[i];
					correctAnswer = answers[i];
					
					if (answer != correctAnswer) {
						mistakeAnswers.push(answers[i]);
						mistakeEquations.push(equations[i]);
						mistakes.push(answer);
					}
				}
			
				correct = userAnswers.length-mistakes.length;
				percent = Math.round(correct / userAnswers.length * 100);
				if (time == 30) {
					time = "30s";
				} else if (time == 60) {
					time = "1m";
				} else if (time == 90) {
					time = "1m 30s";
				} else if (time == 120) {
					time = "2m";
				}
				document.querySelector(".final-score").innerHTML = "In " + time + ", you got: " + correct + "/" + userAnswers.length + " (" + percent + "%)";
			
				if (mistakes.length > 0) {
					document.querySelector(".mistakes-header").innerHTML = "Mistakes";
					$(".mistakes-header").css("border-bottom", "solid");
					$(".mistakes-header").css("display", "block");
					for (i=0;i<mistakes.length;i++){
						//if (percent !== 0){
						equation = mistakeEquations[i];
						answer = mistakeAnswers[i];
						mistake = mistakes[i];
						$(".mistake-list").append("<p>Correct Answer: " + equation + " = " + answer + " &nbsp;&nbsp;Your Answer: " + mistake + "</p><br>");
						MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
						//} else {
							//equation = equations[i];
							//answer = answers[i];
							//mistake = mistakes[i];
							//$(".mistake-list").append("<p>Correct Answer: " + equation + " = " + answer + " &nbsp;&nbsp;Your Answer: " + mistake + "</p><br>");
							//MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
						//}
					}
				}
			}
		}
		//Time frame to answer questions	
		var timeFrame = time * 1000;			
		setTimeout(end, timeFrame);
		
		//Operation to display
		
		window.game = function(){
			$("input.textInput").empty();
			
			//Choosing an operation from the ones available
			var operation = function(){	
				var randInt = Math.floor(Math.random() * operations.length);
				return operations[randInt];
			}
			
			var operation = operation();
				
			if (operation === "sqrt" || operation === "^") {
				//Squareroot
				if (operation === "sqrt") {
					var findSqrt = function(){
						int1 = Math.floor(Math.random() * 120 + 1);
						int2 = Math.floor(Math.random() * 4 + 2);
						
						return Math.pow(int1, 1/int2);
					}
					
					root = findSqrt();
				
					while (root !== Math.floor(root)){
						root = findSqrt();
					}
					
					answers.push(root);
					var rootEquation = "\\(\\sqrt[" + int2 + "]{" + int1 + "}\\)";
					equations.push(rootEquation);
					
					document.querySelector(".operationDisplay").innerHTML = rootEquation;
					MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
				
				//Exponents
				} else {
					var int1 = Math.floor(Math.random() * 10 + 1);
					var int2 = Math.floor(Math.random() * 3 + 1);
					var pow = Math.pow(int1, int2);
					
					if (sign == 2) {
						signChance = Math.random();
						
						if (signChance < 0.3) {
							var int1 = int1 - int1 * 2;
							var pow = Math.pow(int1, int2);
							var int1 = "(" + int1 + ")";
							}
						}
					
					answers.push(pow);
					var powEquation = "\\(" + int1 + "^" + int2 + "\\)";
					equations.push(powEquation);
					
					document.querySelector(".operationDisplay").innerHTML = powEquation;
					MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
				}
			} else {
				var int1 = Math.floor(Math.random() * 60 + 1);
				var int2 = Math.floor(Math.random() * 60 + 1);
				
				var signFunction = function(){
					if (sign == 2){
						for (var i=0;i<2;i++){
							signChance = Math.random();
					
							if (signChance < 0.5) {
								if (i == 0) {
									int1 = int1 - int1 * 2;
								} else {
									int2 = int2 - int2 * 2;
								}
							}
						}
					}
				}
				
				signFunction();
				//Handling creation of negative integers
				function alterSigns(){
						if (int1 < 0 || int2 < 0){
							if (int1 < 0) {
								int1 = "(" + int1 + ")";
							
								if (int2 < 0) {
									int2 = "(" + int2 + ")";
								}
							} else {
								int2 = "(" + int2 + ")";
							}
						}
					}
				//Addition
				if (operation == "+"){
					var add = int1 + int2
					answers.push(add);
					
					alterSigns();
					
					var addEquation = int1 + " + " + int2;
					equations.push(addEquation);
					
					document.querySelector(".operationDisplay").innerHTML = addEquation;
				//Subtraction
				} else if (operation == "-"){
					var subtract = int1 - int2;
					answers.push(subtract);
					
					alterSigns();
					
					var subEquation = int1 + " &#8722; " + int2;
					equations.push(subEquation);
					
					document.querySelector(".operationDisplay").innerHTML = subEquation;
				//Multiplication
				} else if (operation == "*"){
					var int1 = Math.floor(Math.random() * 20 + 1);
					var int2 = Math.floor(Math.random() * 20 + 1);
					
					signFunction();
					
					var multiple = int1 * int2
					answers.push(multiple);
					
					alterSigns();
					
					var multipleEquation = int1 + " &#215; " + int2;
					equations.push(multipleEquation);
					
					document.querySelector(".operationDisplay").innerHTML = multipleEquation;
				//Division
				} else {
					while (div !== Math.floor(div) || div === 1){
						var int1 = Math.floor(Math.random() * 60 + 1);
						var int2 = Math.floor(Math.random() * 60 + 1);
						signFunction();
						var div = int1 / int2;
					}
					
					answers.push(div);
					alterSigns();
					
					var divEquation = int1 + " &#247; " + int2;
					equations.push(divEquation);
					
					document.querySelector(".operationDisplay").innerHTML = divEquation;
				}
			}		
		}
		
		setTimeout(game, 5450);
		
		$(".answer").keyup(function(e){
			if (e.which === 13) {
				userAnswers.push($(".textInput").val());
				$(".textInput").val(" ");
				game();
			}
		})
		
		$(".continue").click(function(){
			if ($(".textInput") !== "") {
				userAnswers.push($(".textInput").val());
			}
			$(".textInput").val(" ");
			game();
		})
	}) 
})