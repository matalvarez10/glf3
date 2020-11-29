class UserInput3 {
    constructor(initialState3, finalStates3, states3, alphabet3, transitions3) {
        this.initialState3 = initialState3;
        this.finalStates3 = finalStates3;
        this.states3 = states3;
        this.alphabet3 = alphabet3;
        this.transitions3 = transitions3;
    }
}
function fetchUserInput3() {

    let initialState3 = $("#initialStateInput3").val().trim();
    let finalStates3 = $("#finalStatesInput3").val().trim();
    let states3 = [];
    let alphabet3 = [];
    let transitions3 = [];

    if (initialState3.includes('{') || finalStates3.includes('{')) {
        alert('State names cannot contain the \"{\" character!');
        return null;
    }

    $(".production-row3").each(function () {

        let currentState3 = $(this).find(".current-state-input3").val().trim();
        let inputSymbol3 = $(this).find(".input-symbol3").val().trim();

        if (inputSymbol3 === '')
            inputSymbol3 = '\u03BB'; //lambda character

        let nextState3 = $(this).find(".next-states3").val().trim();

        // TODO Better state validation?
        if (currentState3.includes('{') || nextState3.includes('{')) {
            alert('State names cannot contain the \"{\" character!');
            return;
        }

        transitions3.push(new Transition(currentState3, nextState3, inputSymbol3));

        // Populate alphabet without lambda
        if (inputSymbol3 !== '\u03BB' && !alphabet3.includes(inputSymbol3))
            alphabet3.push(inputSymbol3);

        if (!states3.includes(currentState3))
            states3.push(currentState3);

        if (!states3.includes(nextState3))
            states3.push(nextState3);

    });

    if (finalStates3.includes(","))
        finalStates3 = finalStates3.split(",");

    return new UserInput3(initialState3, finalStates3, states3, alphabet3, transitions3);
}
$(document).ready(function () {

    $("#new-transition3").click(function () {

        let transitionsDiv3 = $("#nfa-transitions3");
        let clone = $("#nfa-transitions3 .production-row3").last().clone(true);

        clone.appendTo(transitionsDiv3);

        $(".remove-button").show();

    });

    let removeButton = $(".remove-button");

    // Hide all remove buttons initially
    removeButton.hide();
    // Register onClick() event for remove buttons
    removeButton.click(function () {

        let parent = $(this).parent();
        let grandparent = parent.parent();

        parent.fadeOut(function () {
            $(this).remove();
        });

        if (grandparent.children().length <= 2) {
            $(".remove-button").hide();
        }

    });
    $(".production-row3 input").on('keypress', function (e) {
        if (e.which === 13) {
            $("#new-transition3").click();
        }
    });

    $(".production-row3 input").on('keyup', function (e) {
        if (e.which !== 13) {
            $("#verify-update-debug3").click();
        }
    });

    $("#initialStateInput3").on('keyup', function (e) {
        $("#verify-update-debug3").click();
    });

    $("#finalStatesInput3").on('keyup', function (e) {
        $("#verify-update-debug3").click();
    });

    $("#exampleBtn3").click(function () {

        $("#initialStateInput3").val('q0');
        $("#finalStatesInput3").val('q1,q2');

        let transitionsDiv3 = $("#nfa-transitions3");
        let clone = $("#nfa-transitions3 .production-row3").first().clone(true);

        transitionsDiv3.children().each(function () {
            $(this).remove();
        });

        

        clone.find(".current-state-input3").val('q0');
        clone.find(".input-symbol3").val('a');
        clone.find(".next-states3").val('q1');
        transitionsDiv3.append(clone);

        clone = clone.clone(true);
        clone.find(".current-state-input3").val('q1');
        clone.find(".input-symbol3").val('a');
        clone.find(".next-states3").val('q1');
        transitionsDiv3.append(clone);

        clone = clone.clone(true);
        clone.find(".current-state-input3").val('q1');
        clone.find(".input-symbol3").val('b');
        clone.find(".next-states3").val('q1');
        transitionsDiv3.append(clone);

        clone = clone.clone(true);
        clone.find(".current-state-input3").val('q0');
        clone.find(".input-symbol3").val('b');
        clone.find(".next-states3").val('q2');
        transitionsDiv3.append(clone);

        clone = clone.clone(true);
        clone.find(".current-state-input3").val('q2');
        clone.find(".input-symbol3").val('a');
        clone.find(".next-states3").val('q0');
        transitionsDiv3.append(clone);

        clone = clone.clone(true);
        clone.find(".current-state-input3").val('q2');
        clone.find(".input-symbol3").val('b');
        clone.find(".next-states3").val('q2');
        transitionsDiv3.append(clone);




        $(".remove-button").show();
        $("#verify-update-debug3").click();

    });

    $("#resetBtn3").click(function () {
        $("#initialStateInput3").val('');
        $("#finalStatesInput3").val('');
        $(".remove-button").slice(1).click();
        $(".remove-button").hide();
        $("#nfa-transitions3 input").val('');
        $("#current-nfa3").empty();
        $("#current-dfa3").empty();
        $("#current-dfa-minimized3").empty();
        $("#step-div3").empty();
    });

    $("#verify-update-debug3").click(function () {

        let user_input3 = fetchUserInput3();

        let dotStr3 = "digraph fsm {\n";
        dotStr3 += "rankdir=LR;\n";
        dotStr3 += "size=\"8,5\";\n";
        dotStr3 += "node [shape = doublecircle]; " + user_input3.finalStates3 + ";\n";
        dotStr3 += "node [shape = point]; INITIAL_STATE\n";
        dotStr3 += "node [shape = circle];\n";
        dotStr3 += "INITIAL_STATE -> " + user_input3.initialState3 + ";\n";

        for (let transition of user_input3.transitions3)
            dotStr3 += "" + transition.state + " -> " + transition.nextStates + " [label=" + transition.symbol + "];\n";

        dotStr3 += "}";

        //document.getElementById('current-nfa-status').innerText = 'Rendering...';

        // TODO This render method throws an exception if the input is invalid
        // we should catch the exception and print an "invalid input" error to the user
        console.log(dotStr3);
        d3.select("#current-nfa3").graphviz().zoom(false).renderDot(dotStr3);
        // Now that the preview is done, generate the DFA



    });

    $("#btnER").click(function () {
        let usrinput = fetchUserInput3();
        let i, j, k, name, con, start, bool;
        for(i = 0; i < usrinput.states3.length; i++){
            name = usrinput.states3[i];
            con = "";
            if(usrinput.initialState3 != name && !usrinput.finalStates3.includes(name)){
                for(j = 0; j < usrinput.transitions3.length; j++){
                    if(usrinput.transitions3[j].nextStates == name && usrinput.transitions3[j].state != name){
                        con += usrinput.transitions3[j].symbol;
                        start = usrinput.transitions3[j].state;
                        for(k = 0; k < usrinput.transitions3.length; k++){
                            if(usrinput.transitions3[k].nextStates == name && usrinput.transitions3[k].state == name){
                                con += usrinput.transitions3[j].symbol;
                                con += "*";
                                usrinput.transitions3.splice(k, 1);
                                k--;
                                if(j>k)
                                    j--;
                            }
                        }
                        for(k = 0; k < usrinput.transitions3.length; k++){
                            if(usrinput.transitions3[k].nextStates != name && usrinput.transitions3[k].state == name){
                                usrinput.transitions3.push(new Transition(start, usrinput.transitions3[k].nextStates, "(" + con + usrinput.transitions3[j].symbol + ")"));
                                usrinput.transitions3.splice(k, 1);
                                k--;
                                if(j>k)
                                    j--;
                            }
                        }
                        usrinput.transitions3.splice(j, 1);
                        j--;
                    }
                }
                usrinput.states3.splice(i, 1);
                i--;
            }
        }
        for(i = 0; i < usrinput.states3.length; i++){
            con = "";
            name = usrinput.states3[i];
            if(usrinput.initialState3 != name && usrinput.states3.length > 2){
                for(j = 0; j < usrinput.transitions3.length; j++){
                    if(usrinput.transitions3[j].nextStates == name && usrinput.transitions3[j].state != name && usrinput.transitions3[j].state != usrinput.initialState3){
                        con += usrinput.transitions3[j].symbol;
                        start = usrinput.transitions3[j].state;
                        for(k = 0; k < usrinput.transitions3.length; k++){
                            if(usrinput.transitions3[k].nextStates == name && usrinput.transitions3[k].state == name){
                                con += usrinput.transitions3[j].symbol;
                                con += "*";
                                usrinput.transitions3.splice(k, 1);
                                k--;
                                if(j>k)
                                    j--;
                            }
                        }
                        bool = false;
                        for(k = 0; k < usrinput.transitions3.length; k++){
                            if(usrinput.transitions3[k].nextStates != name && usrinput.transitions3[k].state == name){
                                usrinput.transitions3.push(new Transition(start, usrinput.transitions3[k].nextStates, "(" + con + usrinput.transitions3[k].symbol + ")"));
                                usrinput.transitions3.splice(k, 1);
                                k--;
                                if(j>k)
                                    j--;
                                bool = true;
                            }
                        }
                        if(bool){
                            usrinput.transitions3.push(new Transition(start, start, "(" + con + ")"));
                        }
                        usrinput.transitions3.splice(j, 1);
                        j--;
                    }
                }
                usrinput.states3.splice(i, 1);
                i--;
            }
        }
        for(i = 0; i < usrinput.transitions3.length; i++){
            if(usrinput.transitions3[i].nextStates == usrinput.initialState3){
                start = usrinput.transitions3[i].state;
                for(j = 0; j < usrinput.transitions3.length; j++){
                    if(usrinput.transitions3[j].nextStates == usrinput.initialState3 && usrinput.transitions3[j].state == usrinput.initialState3){
                        con += usrinput.transitions3[j].symbol;
                        con += "*";
                        usrinput.transitions3.splice(j, 1);
                        j--;
                        if(i>j)
                            i--;
                    }
                }
                bool = false;
                for(j = 0; j < usrinput.transitions3.length; j++){
                    if(usrinput.transitions3[j].nextStates != usrinput.initialState3 && usrinput.transitions3[j].state == usrinput.initialState3){
                        usrinput.transitions3.push(new Transition(start, usrinput.transitions3[j].nextStates, "(" + con + usrinput.transitions3[j].symbol + ")"));
                        usrinput.transitions3.splice(j, 1);
                        j--;
                        if(i>j)
                            i--;
                    }
                }
                usrinput.transitions3.splice(i, 1);
                i--;
            }
        }
        for(i = 0; i < usrinput.states3.length; i++){
            con = "";
            name = usrinput.states3[i];
            if(usrinput.initialState3 != name){
                for(j = 0; j < usrinput.transitions3.length; j++){
                    if(usrinput.transitions3[j].nextStates == name && usrinput.transitions3[j].state != name){
                        con += usrinput.transitions3[j].symbol;
                        start = usrinput.transitions3[j].state;
                        for(k = 0; k < usrinput.transitions3.length; k++){
                            if(usrinput.transitions3[k].nextStates == name && usrinput.transitions3[k].state == name){
                                con += usrinput.transitions3[j].symbol;
                                con += "*";
                                usrinput.transitions3.splice(k, 1);
                                k--;
                                if(j>k)
                                    j--;
                            }
                        }
                        bool = false;
                        for(k = 0; k < usrinput.transitions3.length; k++){
                            if(usrinput.transitions3[k].nextStates != name && usrinput.transitions3[k].state == name){
                                usrinput.transitions3.push(new Transition(start, usrinput.transitions3[k].nextStates, "(" + con + usrinput.transitions3[k].symbol + ")"));
                                usrinput.transitions3.splice(k, 1);
                                k--;
                                if(j>k)
                                    j--;
                                bool = true;
                            }
                        }
                        if(bool){
                            usrinput.transitions3.push(new Transition(start, start, "(" + con + ")"));
                        }
                        usrinput.transitions3.splice(j, 1);
                        j--;
                    }
                }
                usrinput.states3.splice(i, 1);
                i--;
            }
        }
        con = "";
        for(i = 0; i < usrinput.transitions3.length; i++){
            if(con != "")
                con += "+";
            con += usrinput.transitions3[i].symbol;
        }
        $("#ER").html(con);
    });
});