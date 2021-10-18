$(document).ready( function() {
    var sequence = [1,2,3,4,5,6,7,8,9,10];
    var currQuestion = 0;
    var answerSelected = false;
    var score=0;

    /*starting the quiz*/
    var startQuiz = function(){
        var userName = $("#name").val();
        /*validation for username*/
        if(userName == ""){
            alert("Please enter a name to start the quiz");
        }
        else{
            /*storing username in session*/
            sessionStorage.name = userName;
            /*randomly displaying the question*/
            shuffle();
            getQuestion(sequence[currQuestion]);
            $("#firstPage").css("display", "none");
            $("#mainArea").css("display", "block");
        }
    }

    var shuffle = function(){
        for(var i=sequence.length - 1; i>0; i--){
            var j = Math.floor(Math.random() * (i+1));
            var temp = sequence[i];
            sequence[i] = sequence[j];
            sequence[j] = temp;
        }
    }


    var getQuestion = function(index){
        /*getting and displaying question from json file*/
        $.getJSON("mcq.json", function(data){

            var question = data.questions.find(function(item,i){
                if(item.id == index){
                    return item;
                } 
            });
            $("#question").text(question.question);
            $("#option1").text(question.option1);
            $("#option2").text(question.option2);
            $("#option3").text(question.option3);
            $("#option4").text(question.option4);

        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.write(errorThrown);
        });
    }

    /*checking for correct or incorrect answer*/
    var checkAnswer = function(id){
        $.getJSON("mcq.json", function(data){

            var question = data.questions.find(function(item,i){
                if(item.id == sequence[currQuestion]){
                    return item;
                } 
            });
            var selAnswer = $(id).text();
            if(question.answer == selAnswer){
                $(id).addClass("correctAnswer");
                score++;

            }
            else{
                $(id).addClass("wrongAnswer");
                var corAnswer = "";
                for(var key in question){
                    if(key != "answer"){
                        if(question[key] == question.answer){
                            corAnswer = key;
                            break;
                        }
                    }
                }
                $("#" + corAnswer).addClass("correctAnswer");

            }
            $("#btnNext").removeAttr("disabled");
            $("#btnFinish").removeAttr("disabled");
            answerSelected = true;

        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.write(errorThrown);
        });

    }

    /*displaying next question randomly*/
    var nextQuestion = function(){
        currQuestion++;
        if(currQuestion == 9){
            $("#btnFinish").css("display", "block");
            $("#btnFinish").attr("disabled", true);
            $("#btnNext").css("display", "none");
        }
        getQuestion(sequence[currQuestion]);
        $("#btnNext").attr("disabled", true);
        answerSelected = false;
        for(var i=1; i<5; i++){
            $("#option" + i).removeClass("correctAnswer");
            $("#option" + i).removeClass("wrongAnswer");
        }

        var qtn = currQuestion+1;
        var currWidth = qtn*10;
        /*updating the progressbar*/
        $("#progressBar").css("width", currWidth + "%");
        $("#progressBar").attr("aria-valuenow", currWidth);
        $("#progressBar").text(qtn + " of 10");
    }

    /*finishing quiz by displaying username and score*/
    var finishQuiz = function(){
        $("#lastPage").css("display", "block");
        $("#mainArea").css("display", "none");
        $("#userName").text(sessionStorage.name);
        $("#finalScore").text(score);
        score=0;
        currQuestion=0;
        answerSelected = false;
    }


    $("#btnStart").click(startQuiz);
    $("#option1").click(function(){
        if (!answerSelected){
            checkAnswer("#option1"); 
        }
    });
    $("#option2").click(function(){
        if (!answerSelected){
            checkAnswer("#option2"); 
        }
    });
    $("#option3").click(function(){
        if (!answerSelected){
            checkAnswer("#option3"); 
        }
    });
    $("#option4").click(function(){
        if (!answerSelected){
            checkAnswer("#option4"); 
        }
    });
    $("#btnNext").click(function(){
        nextQuestion();
    });
    $("#btnFinish").click(function(){
        finishQuiz();
    });
    $("#btnClose").click(function(){
        location.reload();
    });
});
