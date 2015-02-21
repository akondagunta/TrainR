var InCloudTrnAppUrl = "https://hakunamatata.firebaseio.com";
var InCloudTrnID = "-JhvnHWyPDTJJCMGLjV5";
var trainingStepsUrl = InCloudTrnAppUrl + "/steps/" + InCloudTrnID + "/.json";
var ref = new Firebase("https://hakunamatata.firebaseio.com");


function startIntro() {
    resumeIntro(true);
}

function resumeIntro(startFresh) {
    var authData = ref.getAuth();
    if (authData) {
        //sweet! we can use the existing id
        authSuccessful(authData, startFresh)

    } else {
        ref.authAnonymously(function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);

            } else {
                authSuccessful(authData, startFresh);
            }
        }, {
            //forget the id when browser is closed
            remember: "sessionOnly"
        });
    }
}

function authSuccessful(authData, startFresh) {
    console.log("Authenticated successfully:", authData);
    if (startFresh)
        clearCurrentStep(authData);

    getJsonAndProcess(authData, startFresh);
}

function clearCurrentStep(authData) {
    var currentStep = ref.child("currentSteps").child(authData.uid);
    currentStep.remove();
    console.log("Current step cleared.");
}

function getJsonAndProcess(authData, startFresh) {
    $.getJSON(trainingStepsUrl, function (data) {
        var training = {
            steps: []
        };

        var intro = introJs();

        var processingStatus = {
            foundCurrentPage: false,
            onCompleteIsSet: false
        };

        //try to retrieve the current step
        var currentStep = ref.child("currentSteps").child(authData.uid);

        //check to see if there is a saved step or not and process accordingly
        var currentStepKey = null;
        currentStep.once("value", function (currentStepForUser) {
            if (currentStepForUser.val()) {
                //we found a saved step

                currentStepKey = currentStepForUser.val().currentStep;
                console.log("Resuming at step " + currentStepKey);

                var foundStepKey = false;
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        //skip all steps up to the current saved step
                        if (!foundStepKey && key != currentStepKey)
                            continue;
                        else {
                            foundStepKey = true;
                        }

                        if (checkStep(authData, data, key, processingStatus, intro, training, currentStep))
                            break;
                    }
                }
            } else if (startFresh) {
                //no saved step and we are just starting

                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (checkStep(authData, data, key, processingStatus, intro, training, currentStep))
                            break;
                    }
                }
            }

            //TODO: use to record user steps completed for saving progress/analytics
            //intro.onchange(function (target) {
            //    console.info("step");
            //});

            if (training.steps.length > 0) {
                console.log("Starting training with " + training.steps.length + " steps.")
                intro.setOptions(training);
                intro.start();
            } else if (startFresh) {
                console.log("No steps found for current page!");
            }
        });

    }).fail(function (error) {
        console.log("Error" + error);
    });
}

function checkStep(authData, data, key, processingStatus, intro, training, currentStep) {
    //check if the step is for this page
    if (window.location.pathname.indexOf(data[key].page) > -1) {
        var stepData = {};
        stepData["intro"] = data[key].content;
        stepData["element"] = data[key].element;

        console.log("Found step " + key + " for page " + window.location.pathname);
        training.steps.push(stepData);

        processingStatus.foundCurrentPage = true;

        //set a callback for when the whole training is done.
        intro.oncomplete(function () {
            clearCurrentStep(authData);
            console.log("Training complete.");
        });

    } else if (processingStatus.foundCurrentPage && !processingStatus.onCompleteIsSet) {
        intro.setOption('doneLabel', 'Next page');

        //set a callback for when the steps are completed on this page
        intro.oncomplete(function () {
            //set the current step to start from on the next page
            currentStep.set({
                currentStep: key
            })

            //head over to the next page!
            window.location.href = data[key].page;
        });
        processingStatus.onCompleteIsSet = true;
        return true;
    }

    return false;
}