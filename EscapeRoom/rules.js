let KEYS = 0;

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.show("You randomly wake up in a strange place you dont recognize\n");
        this.engine.show("Lying on the floor, you find a note on the ground\n");
        this.engine.show("'Trapped in 5 rooms, you are. Play with me, and I'll let you be...'\n".italics());
        this.engine.show("'Everywhere is connected, yes! Easy to get out, of course not!'\n".italics());
        this.engine.show("...Seems like there is only 1 thing to do:");
        this.engine.addChoice("Escape");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = key; // TODO: use `key` to get the data object for the current story location
        
        this.engine.show(this.engine.storyData.Locations[locationData].Body); // TODO: replace this text by the Body of the location data
        
        if(this.engine.storyData.Locations[locationData].Choices) { // TODO: check if the location has any Choices
            for(let choice of [this.engine.storyData.Locations[locationData].Choices]) { // TODO: loop over the location's Choices
                for (let i = 0; i < choice.length; i++){
                    //console.log("choice = " + choice[i] + " ");
                    if (choice[i] == null) {
                        //console.log("skipping null");
                    } else {this.engine.addChoice(choice[i].Text, choice[i])}; // TODO: use the Text of the choice
                        // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
                }
            }

        }
        else {
        this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            if (choice.Responce) {

                if (choice.Text == "Glasses" || choice.Text == "Camera" || choice.Text == "Paper") {
                    this.engine.show(choice.Responce);

                } else if (choice.Text == "Radio") {
                    this.engine.show(choice.Responce[Math.floor(Math.random() * 4)]);

                } else if (choice.Text == "Small Hole") {
                    if (KEYS <=3) {
                        let RNG = Math.floor(Math.random() * 2);
                        if (RNG == 0) {
                            this.engine.show(choice.Responce[0]);
                        } else if (RNG == 1){
                            this.engine.show(choice.Responce[1]);
                        }
                    } else {this.engine.show(choice.Responce[2]);}

                }
                
                this.engine.gotoScene(Location, choice.Target);


            }
            
            else if (choice.Riddle) {

                if (KEYS !=4 && choice.Target == "EXIT") {

                    this.engine.show("The door is protected by " + (4-KEYS) + " lock(s). You have to do something else first...");
                    this.engine.gotoScene(Location, "L3");

                } else if (choice.Target == "EXIT"){
                    let question = prompt(choice.Riddle).toLowerCase();
                    if (question == choice.Solution) { 
                        console.log("correct");
                        this.engine.show(choice.Correct);
                        var target = choice.Target;
                        this.engine.show("You step through the door and get blinded by an overwhelming light.\nYou wake up in your bed, safe and sound.")
                        this.engine.gotoScene(Location, target);
                    } else {
                        //console.log(question + " " + choice.Solution);
                        this.engine.show(choice.Incorrect);
                        this.engine.gotoScene(Location, "L3");
                    }
                } else {

                    let question = prompt(choice.Riddle).toLowerCase();


                    if (question == choice.Solution) { 
                        //console.log("correct");
                        this.engine.show(choice.Correct);
                        var target = choice.Target;
                        this.engine.storyData.Locations[target].Choices[2] = null;
                        //console.log(this.engine.storyData.Locations[target].Choices[2]);
                        //console.log(target);
                        this.engine.gotoScene(Location, target);
                        KEYS++;
                    } else if (typeof(choice.Solution) == 'object') { 
                        console.log("looping");
                        for (let c = 0; c < choice.Solution.length; c++) {

                            if (question == choice.Solution[c]) { 
                                this.engine.show(choice.Correct);
                                var target = choice.Target;
                                this.engine.storyData.Locations[target].Choices[2] = null;
                                //console.log(this.engine.storyData.Locations[target].Choices[2]);
                                //console.log(target);
                                this.engine.gotoScene(Location, target);
                                KEYS++;
                                break;
                            }
                        }

                    } else {
                        console.log("false");
                        this.engine.show(choice.Incorrect);
                        this.engine.gotoScene(Location, choice.Target);
                    }

                } 
            
            }
            
            else {
                this.engine.show("_________\n");
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }

    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');